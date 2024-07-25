import { Denomination, DenominationCount } from '../models/currency.ts';

/**
 * Calculates the change in the minimum number of denominations.
 * @param denominations - An array of currency denominations in cents.
 * @param amountCents - The amount of change needed in cents.
 * @returns An array of objects representing the count of each denomination.
 */
export function calculateChange(
  denominations: Denomination[],
  amountCents: number
): DenominationCount[] {
  const change: DenominationCount[] = [];
  let remainingAmount = amountCents;

  // Sort denominations in descending order
  const sortedDenominations = denominations
    .slice()
    .sort((a, b) => b.value - a.value);

  // Remove the highest count of a denomination from the remaining amount
  sortedDenominations.forEach((denomination) => {
    const count = Math.floor(remainingAmount / denomination.value);
    if (count > 0) {
      change.push({ denomination, count });
      remainingAmount -= count * denomination.value;
    }
  });

  return change;
}

/**
 * Generates random change while ensuring the total matches the requested amount.
 * @param denominations - An array of currency denominations in cents.
 * @param amountCents - The amount of change needed in cents.
 * @returns An array of objects representing the count of each denomination.
 */
export function generateRandomChange(
  denominations: Denomination[],
  amountCents: number
): DenominationCount[] {
  const change: DenominationCount[] = [];
  let remainingAmount = amountCents;

  // Sort denominations by value in descending order for better control
  const sortedDenominations = denominations
    .slice()
    .sort((a, b) => b.value - a.value);

  // Loop until we reach the desired amount
  while (remainingAmount > 0) {
    // Randomly select a denomination
    const denomination =
      sortedDenominations[Math.floor(Math.random() * denominations.length)];

    // Calculate the maximum number of this denomination we can use
    const maxCount = Math.floor(remainingAmount / denomination.value);

    // Randomly choose the count to use (between 1 and maxCount)
    const count = maxCount > 0 ? Math.floor(Math.random() * maxCount) + 1 : 0;

    // Add the selected denomination and count to the result
    if (count > 0) {
      change.push({ denomination, count });
    }

    // Subtract the value from the amount
    remainingAmount -= count * denomination.value;
  }

  // Ensure all remaining amount is zero
  if (remainingAmount !== 0) {
    throw new Error(
      'Random change calculation error: Remaining amount is not zero'
    );
  }

  // Return the result with aggregated counts
  return change.reduce((acc, curr) => {
    const existing = acc.find(
      (d) => d.denomination.value === curr.denomination.value
    );
    if (existing) {
      existing.count += curr.count;
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, [] as DenominationCount[]);
}

/**
 * Converts a list of DenominationCount objects to a formatted string representing the change.
 * @param denominationsCounts - List of DenominationCount objects.
 * @returns A formatted string representing the change from largest to smallest denomination.
 */
export function formatChange(denominationsCounts: DenominationCount[]): string {
  // Define the order of denominations from largest to smallest
  const sortedDenominations = denominationsCounts.sort(
    (a, b) => b.denomination.value - a.denomination.value
  );

  // Format the denominations into a string
  const result = sortedDenominations
    .map(({ denomination, count }) => {
      // Determine the proper name for the denomination
      let denominationName = denomination.name;
      if (denominationName.endsWith('y')) {
        // If denomination ends in 'y', replace 'y' with 'ies'
        denominationName =
          count > 1
            ? `${denominationName.slice(0, -1)}ies`
            : `${denominationName.slice(0, -1)}y`;
      } else {
        // General pluralization rule
        denominationName =
          count > 1 ? `${denominationName}s` : denominationName;
      }

      return `${count} ${denominationName}`;
    })
    .join(',');

  return result;
}

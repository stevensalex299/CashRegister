import { DenominationCount } from '../models/currency.ts';
import TransactionRepository from '../repositories/transactionRepository.ts';
import {
  calculateChange,
  generateRandomChange,
  formatChange,
} from '../utils/changeUtils.ts';

class TransactionManager {
  private repository: TransactionRepository;

  constructor() {
    this.repository = new TransactionRepository();
  }

  /**
   * Processes a transaction and returns the change string.
   * @param amountOwed - The amount owed.
   * @param amountPaid - The amount paid.
   * @param currencyCode - The currency code Ex: 'USD'.
   * @returns A promise that resolves to the formatted change string.
   */
  public async processTransaction(
    amountOwed: number,
    amountPaid: number,
    currencyCode: string
  ): Promise<string> {
    if (amountPaid < amountOwed) {
      throw new Error('Amount paid is less than amount owed');
    }

    // Get currency and denominations
    const currency =
      await this.repository.getCurrencyWithDenominations(currencyCode);
    const { denominations } = currency;

    // Calculate the change
    const amountOwedCents = Math.round(amountOwed * 100);
    const amountPaidCents = Math.round(amountPaid * 100);
    const changeCents = amountPaidCents - amountOwedCents;

    if (changeCents < 0) {
      throw new Error('Amount paid is insufficient');
    }

    let changeString = '';

    // If no change due, return that as the string
    if (changeCents === 0) {
      return 'No Change Due';
    }

    let denominationCounts: DenominationCount[];
    const RANDOM_DIVISOR = parseInt(process.env.RANDOM_DIVISOR || '3', 10);

    // Apply random twist if amount owed is divisible by 3
    // Allow divisor to be customizable with env
    // If another special case needed, can leverage util separation to add new functionality
    if (amountOwedCents % RANDOM_DIVISOR === 0) {
      denominationCounts = generateRandomChange(denominations, changeCents);
    } else {
      denominationCounts = calculateChange(denominations, changeCents);
    }

    changeString = formatChange(denominationCounts);

    // Add transaction to the database
    try {
      await this.repository.addTransaction(
        amountOwed,
        amountPaid,
        currencyCode,
        changeCents / 100,
        changeString
      );
    } catch (dbError) {
      throw new Error('Internal server error while logging transaction');
    }

    return changeString;
  }
}

export default TransactionManager;

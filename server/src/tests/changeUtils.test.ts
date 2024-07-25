import {
  calculateChange,
  generateRandomChange,
  formatChange,
} from '../utils/changeUtils';
import { DenominationCount } from '../models/currency';

const denominations = [
  { value: 1, name: 'penny' },
  { value: 5, name: 'nickel' },
  { value: 10, name: 'dime' },
  { value: 25, name: 'quarter' },
  { value: 100, name: 'dollar' },
  { value: 500, name: 'five dollar' },
  { value: 1000, name: 'ten dollar' },
  {
    value: 2000,
    name: 'twenty dollar',
  },
  {
    value: 5000,
    name: 'fifty dollar',
  },
  {
    value: 10000,
    name: 'hundred dollar',
  },
];

describe('Change Utility Functions', () => {
  describe('calculateChange', () => {
    it('should calculate the correct change for a given amount', () => {
      const amountCents = 287; // $2.87
      const expectedChange: DenominationCount[] = [
        { denomination: { name: 'dollar', value: 100 }, count: 2 },
        { denomination: { name: 'quarter', value: 25 }, count: 3 },
        { denomination: { name: 'dime', value: 10 }, count: 1 },
        { denomination: { name: 'penny', value: 1 }, count: 2 },
      ];

      const result = calculateChange(denominations, amountCents);
      expect(result).toEqual(expectedChange);
    });

    it('should return an empty array for zero amount', () => {
      const amountCents = 0;
      const result = calculateChange(denominations, amountCents);
      expect(result).toEqual([]);
    });
  });

  describe('generateRandomChange', () => {
    it('should generate valid change for a given amount', () => {
      const amountCents = 123; // $1.23
      const change = generateRandomChange(denominations, amountCents);

      // Check that the total value of the generated change matches the amount
      const totalCents = change.reduce(
        (sum, { denomination, count }) => sum + denomination.value * count,
        0
      );
      expect(totalCents).toBe(amountCents);
    });
  });

  describe('formatChange', () => {
    it('should format the change correctly', () => {
      const denominationCounts: DenominationCount[] = [
        { denomination: { name: 'dollar', value: 100 }, count: 3 },
        { denomination: { name: 'dime', value: 10 }, count: 2 },
        { denomination: { name: 'nickel', value: 5 }, count: 3 },
      ];
      const expectedString = '3 dollars,2 dimes,3 nickels';

      const result = formatChange(denominationCounts);
      expect(result).toBe(expectedString);
    });

    it('should handle pluralization correctly', () => {
      const denominationCounts: DenominationCount[] = [
        { denomination: { name: 'dime', value: 10 }, count: 2 },
        { denomination: { name: 'penny', value: 1 }, count: 5 },
      ];
      const expectedString = '2 dimes,5 pennies';

      const result = formatChange(denominationCounts);
      expect(result).toBe(expectedString);
    });
  });
});

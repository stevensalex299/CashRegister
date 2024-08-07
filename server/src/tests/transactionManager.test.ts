/* eslint-disable @typescript-eslint/no-explicit-any */
import TransactionManager from '../managers/transactionManager';
import TransactionRepository from '../repositories/transactionRepository';
import {
  calculateChange,
  generateRandomChange,
  formatChange,
} from '../utils/changeUtils';

jest.mock('../repositories/transactionRepository');
jest.mock('../utils/changeUtils');

describe('TransactionManager', () => {
  let manager: TransactionManager;
  let mockRepository: jest.Mocked<TransactionRepository>;

  const currencyDenominationsMock = {
    name: 'US Dollar',
    code: 'USD',
    denominations: [
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
    ],
  };
  const amountOwedMock = 2.12;
  const amountPaidMock = 3.0;
  const currencyCodeMock = 'USD';
  const changeMock = 0.88;
  const denominationCountsMock = [
    { denomination: { name: 'quarter', value: 25 }, count: 3 },
    { denomination: { name: 'dime', value: 10 }, count: 1 },
    { denomination: { name: 'penny', value: 1 }, count: 3 },
  ];
  const formattedChangeMock = '3 quarters,1 dime,3 pennies';

  beforeEach(() => {
    mockRepository =
      new TransactionRepository() as jest.Mocked<TransactionRepository>;
    manager = new TransactionManager();
    (manager as any).repository = mockRepository;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('processTransaction', () => {
    it('should throw error if amount paid is less than amount owed', async () => {
      const amountOwed = 2.0;
      const amountPaid = 1.0;
      await expect(
        manager.processTransaction(amountOwed, amountPaid, currencyCodeMock)
      ).rejects.toThrow('Amount paid is less than amount owed');
    });

    it('should return formatted change string without twist and log transaction', async () => {
      mockRepository.getCurrencyWithDenominations.mockResolvedValue(
        currencyDenominationsMock
      );
      (calculateChange as jest.Mock).mockReturnValue(denominationCountsMock);
      (formatChange as jest.Mock).mockReturnValue(formattedChangeMock);
      mockRepository.addTransaction.mockResolvedValue(undefined);
      const result = await manager.processTransaction(
        amountOwedMock,
        amountPaidMock,
        currencyCodeMock
      );
      expect(result).toBe(formattedChangeMock);
      expect(mockRepository.getCurrencyWithDenominations).toHaveBeenCalledWith(
        currencyCodeMock
      );
      expect(mockRepository.addTransaction).toHaveBeenCalledWith(
        amountOwedMock,
        amountPaidMock,
        currencyCodeMock,
        changeMock,
        formattedChangeMock
      );
    });

    it('should return formatted change string with twist and log transaction', async () => {
      const amountOwed = 9.0;
      const amountPaid = 15.0;
      const currencyCode = 'USD';
      const change = 6;
      const denominationCounts = [
        { denomination: { name: 'dollar', value: 100 }, count: 5 },
        { denomination: { name: 'quarter', value: 25 }, count: 2 },
        { denomination: { name: 'dime', value: 10 }, count: 5 },
      ];
      const formattedChange = '5 dollars,2 quarters,5 dimes';
      mockRepository.getCurrencyWithDenominations.mockResolvedValue(
        currencyDenominationsMock
      );
      (generateRandomChange as jest.Mock).mockReturnValue(denominationCounts);
      (formatChange as jest.Mock).mockReturnValue(formattedChange);
      mockRepository.addTransaction.mockResolvedValue(undefined);
      process.env.RANDOM_DIVISOR = '3'; // Set the environment variable
      const result = await manager.processTransaction(
        amountOwed,
        amountPaid,
        currencyCode
      );
      expect(result).toBe(formattedChange);
      expect(mockRepository.getCurrencyWithDenominations).toHaveBeenCalledWith(
        currencyCodeMock
      );
      expect(mockRepository.addTransaction).toHaveBeenCalledWith(
        amountOwed,
        amountPaid,
        currencyCodeMock,
        change,
        formattedChange
      );
    });

    it('should throw error if adding transaction fails', async () => {
      mockRepository.getCurrencyWithDenominations.mockResolvedValue(
        currencyDenominationsMock
      );
      (calculateChange as jest.Mock).mockReturnValue(denominationCountsMock);
      (formatChange as jest.Mock).mockReturnValue(formattedChangeMock);
      mockRepository.addTransaction.mockRejectedValue(
        new Error('Database error')
      );
      await expect(
        manager.processTransaction(
          amountOwedMock,
          amountPaidMock,
          currencyCodeMock
        )
      ).rejects.toThrow('Internal server error while logging transaction');
    });
  });
});

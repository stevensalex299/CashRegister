/* eslint-disable class-methods-use-this */
import dbInstance from '../../db/db.ts';
import { Currency, Denomination } from '../models/currency.ts';

class TransactionRepository {
  /**
   * Get currency with appropriate denominations from the database.
   * @param currencyCode - The currency code (e.g., 'USD').
   * @returns A promise that resolves to a currency with an array of denominations in cents.
   */
  public async getCurrencyWithDenominations(
    currencyCode: string
  ): Promise<Currency> {
    const currency = await dbInstance('currencies')
      .where({ code: currencyCode })
      .first();
    if (!currency) {
      throw new Error('Currency not found');
    }

    const denominations = await dbInstance('denominations').where({
      currency_id: currency.id,
    });

    const formattedDenominations: Denomination[] = denominations.map(
      (denom) => ({
        name: denom.name,
        value: Math.round(denom.value * 100),
      })
    );

    return {
      name: currency.name,
      code: currencyCode,
      denominations: formattedDenominations,
    };
  }

  /**
   * Add a new transaction to the database.
   * @param amountOwed - The amount owed in dollars.
   * @param amountPaid - The amount paid in dollars.
   * @param currencyCode - The currency code Ex: 'USD'.
   * @param change - The calculated change in dollars
   * @param formattedChange - The formatted change string Ex: '2 dollars, 1 dime'.
   * @returns A promise that resolves when the transaction is added.
   */
  public async addTransaction(
    amountOwed: number,
    amountPaid: number,
    currencyCode: string,
    change: number,
    formattedChange: string
  ): Promise<void> {
    const currency = await dbInstance('currencies')
      .where({ code: currencyCode })
      .first();

    if (!currency) {
      throw new Error('Currency not found');
    }

    await dbInstance('transactions').insert({
      amount_owed: amountOwed,
      amount_paid: amountPaid,
      currency_id: currency.id,
      change,
      formatted_change: formattedChange,
    });
  }
}

export default TransactionRepository;

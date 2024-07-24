import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Insert currency for USD
  await knex('currencies').insert([
    {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
    },
  ]);

  // Get the currency ID for USD
  const currency = await knex('currencies').where({ code: 'USD' }).first();
  if (!currency) {
    throw new Error('Currency USD not found.');
  }
  const currencyId = currency.id;

  // Insert denominations for USD
  await knex('denominations').insert([
    { currency_id: currencyId, value: 0.01, type: 'coin' }, // Penny
    { currency_id: currencyId, value: 0.05, type: 'coin' }, // Nickel
    { currency_id: currencyId, value: 0.1, type: 'coin' }, // Dime
    { currency_id: currencyId, value: 0.25, type: 'coin' }, // Quarter
    { currency_id: currencyId, value: 1.0, type: 'note' }, // Dollar Coin
    { currency_id: currencyId, value: 5.0, type: 'note' }, // Five Dollar Bill
    { currency_id: currencyId, value: 10.0, type: 'note' }, // Ten Dollar Bill
    { currency_id: currencyId, value: 20.0, type: 'note' }, // Twenty Dollar Bill
    { currency_id: currencyId, value: 50.0, type: 'note' }, // Fifty Dollar Bill
    { currency_id: currencyId, value: 100.0, type: 'note' }, // Hundred Dollar Bill
  ]);
}

export async function down(knex: Knex): Promise<void> {
  // Remove denominations for USD
  await knex('denominations')
    .where({
      currency_id: (await knex('currencies').where({ code: 'USD' }).first()).id,
    })
    .del();

  // Remove USD currency
  await knex('currencies').where({ code: 'USD' }).del();
}

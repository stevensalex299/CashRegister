import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('currencies', (table) => {
    table.increments('id').primary();
    table.string('code').notNullable().unique(); // Ex: 'USD'
    table.string('name').notNullable(); // Ex: 'US Dollar'
    table.string('symbol').notNullable(); // Ex: '$'
    table.timestamps(true, true); // created_at, updated_at
  });

  await knex.schema.createTable('denominations', (table) => {
    table.increments('id').primary();
    table
      .integer('currency_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('currencies')
      .onDelete('CASCADE');
    table.decimal('value', 10, 2).notNullable(); // Ex: 1.00 for $1
    table.string('type').notNullable(); // Ex: 'coin' or 'note'
    table.timestamps(true, true); // created_at, updated_at
  });

  await knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table.decimal('amount_owed', 10, 2).notNullable(); // Ex: 2.13
    table.decimal('amount_paid', 10, 2).notNullable(); // Ex: 3.00
    table
      .integer('currency_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('currencies')
      .onDelete('CASCADE');
    table.text('change').nullable(); // Serialized or formatted change information
    table.timestamps(true, true); // created_at, updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop tables in reverse order to avoid foreign key constraint issues
  await knex.schema.dropTableIfExists('transactions');
  await knex.schema.dropTableIfExists('denominations');
  await knex.schema.dropTableIfExists('currencies');
}

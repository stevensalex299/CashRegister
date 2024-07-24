import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const migrationDirectory = './db/migrations';
const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    directory: migrationDirectory,
  },
};

export default config;

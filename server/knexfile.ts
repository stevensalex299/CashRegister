import type { Knex } from 'knex';

import * as dotenv from 'dotenv';

dotenv.config();
const migrationDirectory = './db/migrations';

// This would represent the development environment, would ideally support multiple environments
const config: Knex.Config = {
  client: 'pg',
  connection:
    process.env.DATABASE_URL ||
    'postgres://user:password@0.0.0.0:5432/cashregister',
  migrations: {
    directory: migrationDirectory,
  },
};

export default config;

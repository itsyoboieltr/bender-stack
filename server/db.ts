import { drizzle, type NodePgClient } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { serverEnv } from '~/lib/env/server';

import * as schema from './routers/schema';

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  pool: NodePgClient;
};

const pool =
  globalForDb.pool ??
  new Pool({
    host: serverEnv.POSTGRES_HOST,
    port: serverEnv.POSTGRES_PORT,
    user: serverEnv.POSTGRES_USER,
    password: serverEnv.POSTGRES_PASSWORD,
    database: serverEnv.POSTGRES_DB,
    ssl: serverEnv.POSTGRES_SSL,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pool = pool;
}

export const db = drizzle({
  client: pool,
  schema,
  logger: process.env.NODE_ENV === 'development',
  casing: 'snake_case',
});

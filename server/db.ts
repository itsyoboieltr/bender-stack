import { drizzle } from 'drizzle-orm/postgres-js';
import postgres, { type Sql } from 'postgres';

import { serverEnv } from '~/lib/env/server';

import * as schema from './routers/schema';

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(serverEnv.DATABASE_URL);
if (process.env.NODE_ENV !== 'production') globalForDb.conn = conn;

export const db = drizzle(conn, {
  schema,
  casing: 'snake_case',
  logger: process.env.NODE_ENV === 'development',
});

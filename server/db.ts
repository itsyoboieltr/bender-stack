import { drizzle } from 'drizzle-orm/postgres-js';

import * as schema from './routers/schema';

import { serverEnv } from '~/utils/env/server';

export const db = drizzle({
  connection: serverEnv.DATABASE_URL,
  schema,
  casing: 'snake_case',
  logger: process.env.NODE_ENV === 'development',
});

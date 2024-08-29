import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';
import { env } from '../utils';

export const db = drizzle(postgres(env.server!.DATABASE_URL), {
  schema,
  logger: process.env.NODE_ENV === 'development',
});

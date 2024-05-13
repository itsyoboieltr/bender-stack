import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';
import { serverEnv } from '../utils/env/server';

export const db = drizzle(
  new Pool({ connectionString: serverEnv.DATABASE_URL }),
  { schema, logger: process.env.NODE_ENV === 'development' }
);

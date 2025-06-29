import { defineConfig } from 'drizzle-kit';

import { serverEnv } from '~/lib/env/server';

export default defineConfig({
  out: './migrations',
  dialect: 'postgresql',
  schema: './server/routers/schema.ts',
  casing: 'snake_case',
  dbCredentials: {
    host: serverEnv.POSTGRES_HOST,
    port: serverEnv.POSTGRES_PORT,
    user: serverEnv.POSTGRES_USER,
    password: serverEnv.POSTGRES_PASSWORD,
    database: serverEnv.POSTGRES_DB,
  },
});

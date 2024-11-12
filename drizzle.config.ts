import type { Config } from 'drizzle-kit';

if (!process.env.DATABASE_URL)
  throw new Error('DATABASE_URL environment variable is not set!');

export default {
  dialect: 'postgresql',
  schema: './server/routers/schema.ts',
  casing: 'snake_case',
  dbCredentials: { url: process.env.DATABASE_URL },
} satisfies Config;

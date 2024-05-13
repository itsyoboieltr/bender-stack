import type { Config } from 'drizzle-kit';

if (!process.env.DATABASE_URL)
  throw new Error('DATABASE_URL environment variable is not set!');

export default {
  dialect: 'postgresql',
  schema: './src/server/schema.ts',
  dbCredentials: { url: process.env.DATABASE_URL },
} satisfies Config;

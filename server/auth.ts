import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import { ulid } from 'ulidx';

import { db } from './db';

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg' }),
  session: { cookieCache: { enabled: true, maxAge: 5 * 60 } },
  plugins: [admin()],
  advanced: { generateId: () => ulid() },
  emailAndPassword: { enabled: true },
});

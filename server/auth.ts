import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createAuthMiddleware } from 'better-auth/api';
import { admin } from 'better-auth/plugins';
import { ulid } from 'ulidx';

import { db } from './db';

import { sendResetPassword } from '~/lib/emails/reset-password-email';
import { sendVerificationEmail } from '~/lib/emails/verification-email';
import { rateLimit } from '~/lib/rate-limit';

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg' }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 mins
    },
  },
  plugins: [admin()],
  advanced: { generateId: () => ulid() },
  emailAndPassword: { enabled: true, sendResetPassword },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail,
  },
  rateLimit,
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // invalidate the cookie cache on email verification
      if (ctx.path.startsWith('/verify-email')) {
        ctx.setCookie('better-auth.session_data', '');
      }
    }),
  },
});

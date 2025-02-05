import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, createAuthMiddleware, emailOTP } from 'better-auth/plugins';
import { ulid } from 'ulidx';

import { db } from './db';

import { sendResetPasswordEmail } from '~/lib/emails/reset-password-email';
import { sendVerificationEmail } from '~/lib/emails/verification-email';
import { minPasswordLength, otp, rateLimit } from '~/lib/shared';

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg' }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 300, // 5 mins
    },
  },
  plugins: [
    admin(),
    emailOTP({
      ...otp,
      disableSignUp: true, // disable automatic sign-up
      sendVerificationOTP: async (data) => {
        if (data.type === 'email-verification')
          return await sendVerificationEmail(data);
        else if (data.type === 'forget-password')
          return await sendResetPasswordEmail(data);
      },
    }),
  ],
  advanced: { generateId: () => ulid() },
  emailAndPassword: { enabled: true, minPasswordLength },
  rateLimit,
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // invalidate the cookie cache on email verification
      if (ctx.path.startsWith('/email-otp/verify-email')) {
        ctx.setCookie('better-auth.session_data', '');
      }
    }),
  },
});

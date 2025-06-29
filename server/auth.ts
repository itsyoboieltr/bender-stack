import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import {
  admin,
  createAuthMiddleware,
  emailOTP,
  twoFactor,
} from 'better-auth/plugins';
import { ulid } from 'ulidx';

import { sendResetPasswordEmail } from '~/lib/emails/reset-password-email';
import { sendVerificationEmail } from '~/lib/emails/verification-email';
import { minPasswordLength, otp, totp } from '~/lib/shared';
import { name as appName } from '~/package.json';

import { db } from './db';

export const auth = betterAuth({
  appName,
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
      sendVerificationOTP: async (data, request) => {
        if (data.type === 'email-verification')
          return await sendVerificationEmail(data, request);
        if (data.type === 'forget-password')
          return await sendResetPasswordEmail(data, request);
      },
    }),
    twoFactor({ issuer: appName, totpOptions: { ...totp } }),
  ],
  advanced: { database: { generateId: () => ulid() } },
  emailAndPassword: { enabled: true, minPasswordLength },
  rateLimit: {
    window: 60, // time window in seconds
    max: 100, // max requests in the window
    customRules: {
      // only send one verification otp a minute
      '/email-otp/send-verification-otp': {
        window: 60,
        max: 1,
      },
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // invalidate the cookie cache on email verification
      // workaround for: https://github.com/better-auth/better-auth/issues/1286
      if (ctx.path.startsWith('/email-otp/verify-email')) {
        ctx.setCookie('better-auth.session_data', '', { path: '/' });
      }
    }),
  },
});

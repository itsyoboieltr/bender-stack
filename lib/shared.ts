import type { emailOTP } from 'better-auth/plugins';
import type { BetterAuthOptions } from 'better-auth/types';

export const minPasswordLength = 8;

export const otp = {
  otpLength: 6,
  expiresIn: 300, // 5 mins
} as const satisfies Partial<Parameters<typeof emailOTP>[0]>;

export const rateLimit = {
  window: 60, // time window in seconds
  max: 100, // max requests in the window
  customRules: {
    // only send one verification otp a minute
    '/email-otp/send-verification-otp': {
      window: 60,
      max: 1,
    },
  },
} as const satisfies BetterAuthOptions['rateLimit'];

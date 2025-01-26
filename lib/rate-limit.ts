import type { BetterAuthOptions } from 'better-auth/types';

export const rateLimit = {
  window: 60, // time window in seconds
  max: 100, // max requests in the window
  customRules: {
    // only send one verification email a minute
    '/send-verification-email': {
      window: 60,
      max: 1,
    },
    // only send one forget password email a minute
    '/forget-password': {
      window: 60,
      max: 1,
    },
  },
} as const satisfies BetterAuthOptions['rateLimit'];

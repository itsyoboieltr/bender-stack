import type { emailOTP, twoFactor } from 'better-auth/plugins';

import { messages as en } from '~/locales/en/messages.po';

export const minPasswordLength = 8;

export const otp = {
  otpLength: 6,
  expiresIn: 300, // 5 mins
} as const satisfies Partial<Parameters<typeof emailOTP>[0]>;

export const totp = {
  digits: 6,
} as const satisfies NonNullable<Parameters<typeof twoFactor>[0]>['totpOptions'];

export const messages = { en };

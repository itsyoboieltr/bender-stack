import { t } from '@lingui/core/macro';
import { z } from 'zod/v4';

import { minPasswordLength, otp } from '~/lib/shared';

export const userSignInSchema = z.object({
  email: z.email().trim().min(1, { error: t`Email cannot be empty` }),
  password: z
    .string()
    .trim()
    .min(minPasswordLength, {
      error: t`Password must be minimum ${minPasswordLength} characters long`,
    }),
});

export type UserSignIn = z.infer<typeof userSignInSchema>;

export const createDefaultUserSignIn = (): UserSignIn => ({
  email: '',
  password: '',
});

export const userSignUpSchema = z.object({
  name: z.string().trim().min(1, { error: t`Name cannot be empty` }),
  email: z.email().trim().min(1, { error: t`Email cannot be empty` }),
  password: z
    .string()
    .trim()
    .min(minPasswordLength, {
      error: t`Password must be minimum ${minPasswordLength} characters long`,
    }),
});

export type UserSignUp = z.infer<typeof userSignUpSchema>;

export const createDefaultUserSignUp = (): UserSignUp => ({
  name: '',
  email: '',
  password: '',
});

export const userForgotPasswordSchema = z.object({
  email: z.email().trim().min(1, { error: t`Email cannot be empty` }),
});

export const userResetPasswordSchema = z
  .object({
    step: z.union([z.literal('email'), z.literal('otp'), z.literal('reset')]),
    email: z.email().trim().min(1, { error: t`Email cannot be empty` }),
    otp: z
      .string()
      .trim()
      .length(otp.otpLength, { error: t`OTP must be ${otp.otpLength} digits` }),
    password: z
      .string()
      .trim()
      .min(minPasswordLength, {
        error: t`Password must be minimum ${minPasswordLength} characters long`,
      }),
    passwordConfirm: z
      .string()
      .trim()
      .min(minPasswordLength, {
        error: t`Password must be minimum ${minPasswordLength} characters long`,
      }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: t`Passwords must match`,
    path: ['passwordConfirm'],
  });

export type UserResetPassword = z.infer<typeof userResetPasswordSchema>;

export const createDefaultUserResetPassword = (): UserResetPassword => ({
  step: 'email',
  email: '',
  otp: '',
  password: '',
  passwordConfirm: '',
});

export const userEnableTwoFactorSchema = z.object({
  step: z.union([z.literal('password'), z.literal('scan'), z.literal('verify')]),
  password: z
    .string()
    .trim()
    .min(minPasswordLength, {
      error: t`Password must be minimum ${minPasswordLength} characters long`,
    }),
  totpURI: z.string().trim(),
});

export type UserEnableTwoFactor = z.infer<typeof userEnableTwoFactorSchema>;

export const createDefaultUserEnableTwoFactor = (): UserEnableTwoFactor => ({
  step: 'password',
  password: '',
  totpURI: '',
});

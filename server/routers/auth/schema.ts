import { z } from 'zod/v4';

import { minPasswordLength, otp } from '~/lib/shared';

export const userSignInSchema = z.object({
  email: z.email().trim().min(1),
  password: z.string().trim().min(minPasswordLength),
});

export type UserSignIn = z.infer<typeof userSignInSchema>;

export const createDefaultUserSignIn = (): UserSignIn => ({
  email: '',
  password: '',
});

export const userSignUpSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email().trim().min(1),
  password: z.string().trim().min(minPasswordLength),
});

export type UserSignUp = z.infer<typeof userSignUpSchema>;

export const createDefaultUserSignUp = (): UserSignUp => ({
  name: '',
  email: '',
  password: '',
});

export const userForgotPasswordSchema = z.object({
  email: z.email().trim().min(1),
});

export const userResetPasswordSchema = z
  .object({
    step: z.union([z.literal('email'), z.literal('otp'), z.literal('reset')]),
    email: z.email().trim().min(1),
    otp: z.string().trim().length(otp.otpLength),
    password: z.string().trim().min(minPasswordLength),
    passwordConfirm: z.string().trim().min(minPasswordLength),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords must match',
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
  step: z.union([
    z.literal('password'),
    z.literal('scan'),
    z.literal('verify'),
  ]),
  password: z.string().trim().min(minPasswordLength),
  totpURI: z.string().trim(),
});

export type UserEnableTwoFactor = z.infer<typeof userEnableTwoFactorSchema>;

export const createDefaultUserEnableTwoFactor = (): UserEnableTwoFactor => ({
  step: 'password',
  password: '',
  totpURI: '',
});

import { z } from 'zod';

export const userSignInSchema = z.object({
  email: z.string().trim().min(1).email(),
  password: z.string().trim().min(1),
});

export type UserSignIn = z.infer<typeof userSignInSchema>;

export const createDefaultUserSignIn = (): UserSignIn => ({
  email: '',
  password: '',
});

export const userSignUpSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().min(1).email(),
  password: z.string().trim().min(1),
});

export type UserSignUp = z.infer<typeof userSignUpSchema>;

export const createDefaultUserSignUp = (): UserSignUp => ({
  name: '',
  email: '',
  password: '',
});

export const userForgotPasswordSchema = z.object({
  email: z.string().trim().min(1).email(),
  redirectTo: z.string().trim().min(1),
});

export type UserForgotPassword = z.infer<typeof userForgotPasswordSchema>;

export const createDefaultUserForgotPassword = (): UserForgotPassword => ({
  email: '',
  redirectTo: '/reset-password',
});

export const userResetPasswordSchema = z
  .object({
    newPassword: z.string().trim().min(1),
    newPasswordConfirm: z.string().trim().min(1),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: 'Passwords must match',
    path: ['newPasswordConfirm'],
  });

export type UserResetPassword = z.infer<typeof userResetPasswordSchema>;

export const createDefaultUserResetPassword = (): UserResetPassword => ({
  newPassword: '',
  newPasswordConfirm: '',
});

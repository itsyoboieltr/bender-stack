import { z } from 'zod/v4';

export const serverEnv = z
  .object({
    POSTGRES_HOST: z.string().min(1).trim(),
    POSTGRES_PORT: z.coerce.number().int().positive(),
    POSTGRES_USER: z.string().min(1).trim(),
    POSTGRES_PASSWORD: z.string().min(1).trim(),
    POSTGRES_DB: z.string().min(1).trim(),
    BETTER_AUTH_SECRET: z.string().min(1).trim(),
    BETTER_AUTH_URL: z.string().min(1).trim(),
    SMTP_HOST: z.string().min(1).trim(),
    SMTP_PORT: z.coerce.number().int().positive(),
    SMTP_USERNAME: z.string().min(1).trim(),
    SMTP_PASSWORD: z.string().min(1).trim(),
  })
  .parse({
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DB: process.env.POSTGRES_DB,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  });

import { z } from 'zod';

export const serverEnv = z
  .object({
    DATABASE_URL: z.string().min(1).trim(),
    BETTER_AUTH_SECRET: z.string().min(1).trim(),
    BETTER_AUTH_URL: z.string().min(1).trim(),
    SMTP_HOST: z.string().min(1).trim(),
    SMTP_PORT: z.coerce.number().int().positive(),
    SMTP_USERNAME: z.string().min(1).trim(),
    SMTP_PASSWORD: z.string().min(1).trim(),
  })
  .parse({
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  });

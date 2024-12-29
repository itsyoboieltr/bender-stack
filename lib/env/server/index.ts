import { z } from 'zod';

export const serverEnv = z
  .object({ DATABASE_URL: z.string().min(1).trim() })
  .parse({ DATABASE_URL: process.env.DATABASE_URL });

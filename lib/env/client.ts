import { z } from 'zod';

export const clientEnv = z
  .object({
    EXPO_PUBLIC_HOST_URL: z.string().min(1).trim().default('http://localhost:3000'),
  })
  .parse({
    EXPO_PUBLIC_HOST_URL: process.env.EXPO_PUBLIC_HOST_URL,
  });

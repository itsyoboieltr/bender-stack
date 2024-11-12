import { z } from 'zod';

export const clientEnv = z
  .object({ EXPO_PUBLIC_HOST_URL: z.string().min(1).trim() })
  .parse({
    EXPO_PUBLIC_HOST_URL:
      process.env.EXPO_PUBLIC_HOST_URL ?? 'http://localhost:3000',
  });

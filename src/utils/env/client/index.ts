import { Elysia, t } from 'elysia';

const {
  models: { clientSchema },
} = new Elysia().model({
  clientSchema: t.Object({
    HOST_URL: t.String({ minLength: 1 }),
  }),
});

export const clientEnv = clientSchema.parse({
  HOST_URL: process.env.EXPO_PUBLIC_HOST_URL ?? 'http://localhost:3000',
});

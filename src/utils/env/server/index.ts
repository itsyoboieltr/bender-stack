import { Elysia, t } from 'elysia';

const {
  models: { serverSchema },
} = new Elysia().model({
  serverSchema: t.Object({
    DATABASE_URL: t.String({ minLength: 1 }),
  }),
});

export const serverEnv = serverSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL ?? '',
});

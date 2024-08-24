import { Elysia, t } from 'elysia';

const {
  models: { serverSchema },
} = new Elysia().model({
  serverSchema: t.Object({
    DATABASE_URL: t.String({ minLength: 1 }),
  }),
});

const serverEnvResult = serverSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL ?? '',
});

if (!serverEnvResult.data) {
  const errors = serverEnvResult.errors.reduce(
    (previous, current) => {
      const path = current.path.slice(1);
      if (!previous[path])
        previous[path] = current.summary.replaceAll('  ', ' ');
      return previous;
    },
    {} as Record<string, string>
  );
  const message = Object.entries(errors)
    .map((parts) => parts.join(': '))
    .join('\n');
  throw new Error('Invalid server environment variables!\n' + message);
}

export const serverEnv = serverEnvResult.data;

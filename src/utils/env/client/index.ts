import { Elysia, t } from 'elysia';

const {
  models: { clientSchema },
} = new Elysia().model({
  clientSchema: t.Object({
    HOST_URL: t.String({ minLength: 1 }),
  }),
});

const clientEnvResult = clientSchema.safeParse({
  HOST_URL: process.env.EXPO_PUBLIC_HOST_URL ?? 'http://localhost:3000',
});

if (!clientEnvResult.data) {
  const errors = clientEnvResult.errors.reduce(
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
  throw new Error('Invalid client environment variables!\n' + message);
}

export const clientEnv = clientEnvResult.data;

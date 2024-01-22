import { Type as t } from '@sinclair/typebox/type';

import { parse } from '~/utils';

const clientEnvSchema = t.Object({
  HOST_URL: t.String({
    minLength: 1,
    error: 'EXPO_PUBLIC_HOST_URL client environment variable is not set!',
  }),
});

export const clientEnv = parse(clientEnvSchema, {
  HOST_URL: process.env.EXPO_PUBLIC_HOST_URL ?? 'http://localhost:3000',
});

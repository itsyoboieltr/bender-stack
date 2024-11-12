import { Type as t } from '@sinclair/typebox';

import { parse } from '~/utils';

export const serverEnv = parse(
  t.Object({ DATABASE_URL: t.String({ minLength: 1 }) }),
  { DATABASE_URL: process.env.DATABASE_URL }
);

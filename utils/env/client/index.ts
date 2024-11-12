import { Type as t } from '@sinclair/typebox';

import { parse } from '~/utils';

export const clientEnv = parse(t.Object({}), {});

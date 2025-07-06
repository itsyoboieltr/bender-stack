import { defineConfig } from '@lingui/cli';

import { locales, sourceLocale } from './lib/i18n';

export default defineConfig({
  sourceLocale,
  locales: [...locales],
  catalogs: [
    {
      path: '<rootDir>/locales/{locale}/messages',
      include: ['app', 'components', 'lib', 'server'],
    },
  ],
});

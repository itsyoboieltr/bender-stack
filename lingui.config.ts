import { defineConfig } from '@lingui/cli';

export default defineConfig({
  sourceLocale: 'en',
  locales: ['en'],
  catalogs: [
    {
      path: '<rootDir>/locales/{locale}/messages',
      include: ['app', 'components', 'lib', 'server'],
    },
  ],
});

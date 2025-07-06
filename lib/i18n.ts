export const locales = ['en'] as const;

export type Locale = (typeof locales)[number];

export const sourceLocale = 'en' satisfies Locale;

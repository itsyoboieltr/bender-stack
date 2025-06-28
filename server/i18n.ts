import i18n from 'i18next';

import {
  fallbackLocale,
  resources,
  type SupportedLanguage,
  supportedLngs,
} from '~/lib/shared';

export const getLanguageFromRequest = (request?: Request) => {
  const acceptLanguageHeader = request?.headers.get(
    'Accept-Language'
  ) as SupportedLanguage | null;

  const language = acceptLanguageHeader
    ? supportedLngs.includes(acceptLanguageHeader)
      ? acceptLanguageHeader
      : fallbackLocale
    : fallbackLocale;

  return language;
};

export default i18n.init({
  supportedLngs,
  lng: fallbackLocale,
  fallbackLng: false,
  interpolation: { escapeValue: false },
  resources,
});

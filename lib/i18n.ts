import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { z } from 'zod/v4';

import {
  fallbackLocale,
  resources,
  type SupportedLanguage,
  supportedLngs,
} from '~/lib/shared';
import { storage } from '~/lib/storage';

const locales = getLocales();

const firstDeviceLocale = locales[0]?.languageCode as
  | SupportedLanguage
  | undefined;

const defaultLanguage = firstDeviceLocale
  ? supportedLngs.includes(firstDeviceLocale)
    ? firstDeviceLocale
    : fallbackLocale
  : fallbackLocale;

export const getLanguageFromStorage = () => {
  const storedLanguage = storage.get('language') as SupportedLanguage | null;

  const language = storedLanguage
    ? supportedLngs.includes(storedLanguage)
      ? storedLanguage
      : defaultLanguage
    : defaultLanguage;

  return language;
};

const lng = getLanguageFromStorage();

z.config(z.locales[lng]());

export default i18n.use(initReactI18next).init({
  supportedLngs,
  lng,
  fallbackLng: false,
  interpolation: { escapeValue: false },
  resources,
});

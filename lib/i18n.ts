import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { z } from 'zod/v4';

import en from '~/assets/locales/en.json';
import { storage } from '~/lib/storage';

const resources = {
  en: { translation: en },
};

export type SupportedLanguage = keyof typeof resources;

export const supportedLngs = Object.keys(resources) as [SupportedLanguage];

const locales = getLocales();

const firstDeviceLocale = locales[0]?.languageCode as
  | SupportedLanguage
  | undefined;

const fallbackLocale = 'en' satisfies SupportedLanguage;

const defaultLanguage = firstDeviceLocale
  ? supportedLngs.includes(firstDeviceLocale)
    ? firstDeviceLocale
    : fallbackLocale
  : fallbackLocale;

const storedLanguage = (
  typeof window !== 'undefined' ? storage.get('language') : null
) as SupportedLanguage | null;

const lng = storedLanguage
  ? supportedLngs.includes(storedLanguage)
    ? storedLanguage
    : defaultLanguage
  : defaultLanguage;

z.config(z.locales[lng]());

export default i18n.use(initReactI18next).init({
  supportedLngs,
  lng,
  fallbackLng: false,
  interpolation: { escapeValue: false },
  resources,
});

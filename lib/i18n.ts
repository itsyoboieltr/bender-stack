import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '~/assets/locales/en.json';

import { storage } from './storage';

const resources = {
  en: { translation: en },
};

export const supportedLngs = Object.keys(resources);

const locales = getLocales();

const firstDeviceLocale = locales[0]?.languageCode;
const fallbackLocale = 'en';

const defaultLanguage = firstDeviceLocale
  ? supportedLngs.includes(firstDeviceLocale)
    ? firstDeviceLocale
    : fallbackLocale
  : fallbackLocale;

const lng =
  typeof window !== 'undefined'
    ? (storage.get('language') ?? defaultLanguage)
    : defaultLanguage;

export default i18n.use(initReactI18next).init({
  supportedLngs,
  lng,
  fallbackLng: false,
  interpolation: { escapeValue: false },
  resources,
});

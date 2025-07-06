import { setupI18n } from '@lingui/core';
import Negotiator from 'negotiator';

import { type Locale, locales, sourceLocale } from '~/lib/i18n';
import { messages } from '~/lib/shared';

export const getLocaleFromRequest = (request?: Request) => {
  if (!request) return sourceLocale;

  const requestLocale = new Negotiator({
    headers: Object.fromEntries(request.headers),
  }).language([...locales]) as Locale | undefined;

  return requestLocale ?? sourceLocale;
};

export const getI18n = (request?: Request) =>
  setupI18n({ locale: getLocaleFromRequest(request), messages });

import Negotiator from 'negotiator';

import {
  fallbackLocale,
  type SupportedLocale,
  supportedLocales,
} from '~/lib/shared';

export const getLocaleFromRequest = (request?: Request) => {
  if (!request) return fallbackLocale;

  const locale = new Negotiator({
    headers: Object.fromEntries(request.headers),
  }).language([...supportedLocales]) as SupportedLocale | undefined;

  return locale ?? fallbackLocale;
};

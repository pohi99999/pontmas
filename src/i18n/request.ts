import { getRequestConfig } from 'next-intl/server';
import { isLocale, routing, TIME_ZONE } from './routing';

// The messages of the request's language. An unknown locale falls back to Hungarian here; the
// [locale] layout answers it with 404 before anything renders.
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isLocale(requested) ? requested : routing.defaultLocale;
  return { locale, timeZone: TIME_ZONE, messages: (await import(`../../messages/${locale}.json`)).default };
});

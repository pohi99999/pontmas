import { defineRouting } from 'next-intl/routing';

// The site's languages (card c017f163). Hungarian stays at the root: "/", "/autizmus" keep their
// addresses, so existing links, search results and the contact form's ?topic= links do not break;
// English and German live under /en and /de. No redirect by the browser's language: a Hungarian
// visitor with an English browser still lands on the Hungarian page and chooses with the switcher.
export const LOCALES = ['hu', 'en', 'de'] as const;
export type Locale = (typeof LOCALES)[number];

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: 'hu',
  localePrefix: 'as-needed',
  localeDetection: false,
});

/** BCP 47 tags for <html lang> and hreflang, Open Graph locale for og:locale. */
export const HTML_LANG: Record<Locale, string> = { hu: 'hu', en: 'en', de: 'de' };
export const OG_LOCALE: Record<Locale, string> = { hu: 'hu_HU', en: 'en_GB', de: 'de_DE' };

/**
 * The languages the site actually serves. A language is listed here only once every text of it is
 * translated (the translation PR adds en and de); until then its pages answer 404 and it is in neither
 * the sitemap nor the hreflang links, so a half-done language is never published.
 */
export const PUBLISHED_LOCALES: readonly Locale[] = ['hu', 'en', 'de'];

/** The foundation is in Szombathely: dates and times are Budapest time on the server and in the browser. */
export const TIME_ZONE = 'Europe/Budapest';

export function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (LOCALES as readonly string[]).includes(v);
}

export function isPublished(v: unknown): v is Locale {
  return isLocale(v) && PUBLISHED_LOCALES.includes(v);
}

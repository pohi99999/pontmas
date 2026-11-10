import type { Locale } from '../i18n/routing';

// The language switcher's data (review 2026-11-10). The names (each language in its own name, an autonym,
// never a flag) are in messages/* under LanguageSwitcher.names; here only the short code for the compact
// button, the same in every language.
export const LANGUAGE_CODES: Record<Locale, string> = { hu: 'HU', en: 'EN', de: 'DE' };

/** The languages the switcher offers: nothing while only one is published, so a half-done language is never offered. */
export function switcherLocales(published: readonly Locale[]): readonly Locale[] {
  return published.length > 1 ? published : [];
}

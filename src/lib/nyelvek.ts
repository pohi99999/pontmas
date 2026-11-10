import type { Locale } from '../i18n/routing';

// The language switcher's data (review 2026-11-10). Each language in its own name (an autonym, never a
// flag: a flag is a country, Austrians read German too); the short code for the compact button.
export const LANGUAGE_NAMES: Record<Locale, { name: string; code: string }> = {
  hu: { name: 'Magyar', code: 'HU' },
  en: { name: 'English', code: 'EN' },
  de: { name: 'Deutsch', code: 'DE' },
};

/** The languages the switcher offers: nothing while only one is published, so a half-done language is never offered. */
export function switcherLocales(published: readonly Locale[]): readonly Locale[] {
  return published.length > 1 ? published : [];
}

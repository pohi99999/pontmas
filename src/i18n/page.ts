import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { isPublished, type Locale } from './routing';
import { languageAlternates } from '../lib/site';

/** The route params of every page under [locale]. */
export type PageParams = { params: Promise<{ locale: string }> };

/**
 * First line of every server page under [locale]: checks the language and tells next-intl which one
 * this render is for, so the page stays statically rendered. Without it a locale-aware Link reads the
 * request, and the page turns dynamic (measured on / and /segitseg, card c017f163).
 */
export async function pageLocale(params: PageParams['params']): Promise<Locale> {
  const { locale } = await params;
  if (!isPublished(locale)) notFound();
  setRequestLocale(locale);
  return locale;
}

/**
 * A page's generateMetadata: its own canonical address and hreflang links in the request's language,
 * on top of the page's static metadata. Every page needs its own: the [locale] layout cannot know the
 * path, and a canonical set there was inherited by every page (measured: /autizmus said "/", card c017f163).
 */
export function alternatesFor(path: string, base: Metadata = {}) {
  return async function generateMetadata({ params }: PageParams): Promise<Metadata> {
    const { locale } = await params;
    return isPublished(locale) ? { ...base, alternates: languageAlternates(path, locale) } : base;
  };
}

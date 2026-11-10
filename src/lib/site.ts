// The site's public address and the pages a search engine may list (card c017f163).
import { LEGAL_DRAFT } from './legal';

/**
 * The canonical address. pontmas.hu is the foundation's domain and what the page metadata and the
 * JSON-LD already name; until the domain points to this site (on 2026-11-10 it still served the old
 * one) a deployment can override it with SITE_URL, without a code change. No trailing slash.
 */
export const SITE_URL = (process.env.SITE_URL?.trim() || 'https://pontmas.hu').replace(/\/+$/, '');

/** Every public page. tests/site.test.mjs derives the real list from src/app and fails on a difference. */
export const PUBLIC_PATHS = [
  '/', '/autizmus', '/segitseg', '/rolunk', '/rolunk-irtak', '/hirek', '/programok', '/tamogatas',
  '/dokumentumok', '/kapcsolat', '/adatkezeles', '/impresszum',
] as const;

/** Drafts are not listed: the legal pages until they are approved (src/lib/legal.ts). */
export const DRAFT_PATHS: readonly string[] = LEGAL_DRAFT ? ['/adatkezeles', '/impresszum'] : [];

/** Never indexed: the content editor and the API. */
export const PRIVATE_PREFIXES = ['/szerkeszto', '/api/'] as const;

export function indexedPaths(): string[] {
  return PUBLIC_PATHS.filter((p) => !DRAFT_PATHS.includes(p));
}

// ---------- languages (card c017f163) ----------
// Hungarian at the root, the others under their prefix (src/i18n/routing.ts, localePrefix as-needed).
// Only published languages are linked: a language still being translated is in no hreflang and no sitemap.
import { HTML_LANG, PUBLISHED_LOCALES, routing, type Locale } from '../i18n/routing';

/** The path of a page in a language: "/autizmus" -> "/en/autizmus", "/" -> "/en"; Hungarian unchanged. */
export function localizedPath(path: string, locale: Locale): string {
  if (locale === routing.defaultLocale) return path;
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

export function absoluteUrl(path: string): string {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

/** hreflang links of a page: every published language, plus x-default (Hungarian). */
export function hreflangLinks(path: string): Record<string, string> {
  const links: Record<string, string> = {};
  for (const l of PUBLISHED_LOCALES) links[HTML_LANG[l]] = absoluteUrl(localizedPath(path, l));
  links['x-default'] = absoluteUrl(localizedPath(path, routing.defaultLocale));
  return links;
}

/** Next metadata `alternates` of a page in a language: its canonical address and the hreflang links. */
export function languageAlternates(path: string, locale: Locale) {
  return { canonical: absoluteUrl(localizedPath(path, locale)), languages: hreflangLinks(path) };
}

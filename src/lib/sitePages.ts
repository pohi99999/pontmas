// The pages a search engine may list, and the parts of the site it is asked to stay out of. The
// sitemap and robots.txt are built from these two lists and from the site's address (site.ts).

import { LEGAL_DRAFT } from './legal';

/** Every public page. tests/sitemap.test.mjs reads the real list from src/app and fails on a difference. */
export const PUBLIC_PATHS = [
  '/', '/autizmus', '/segitseg', '/kisfilmek', '/rolunk', '/rolunk-irtak', '/hirek', '/programok',
  '/dokumentumok', '/irodank', '/kapcsolat', '/tamogatas', '/adatkezeles', '/impresszum',
] as const;

/**
 * Public, but not listed for a search engine: the two legal pages while they are drafts (src/lib/legal.ts). They say
 * noindex themselves; a sitemap that listed them would ask for the opposite. The day LEGAL_DRAFT is false they are
 * listed without a change here.
 */
export const DRAFT_PATHS: readonly string[] = LEGAL_DRAFT ? ['/adatkezeles', '/impresszum'] : [];

/** The pages the sitemap lists. */
export const listedPaths = (): string[] => PUBLIC_PATHS.filter((p) => !DRAFT_PATHS.includes(p));

/** Never listed and not to be crawled: the content editor and the API. */
export const PRIVATE_PREFIXES = ['/szerkeszto', '/api/'] as const;

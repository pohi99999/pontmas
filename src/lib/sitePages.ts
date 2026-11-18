// The pages a search engine may list, and the parts of the site it is asked to stay out of. The
// sitemap and robots.txt are built from these two lists and from the site's address (site.ts).

/** Every public page. tests/sitemap.test.mjs reads the real list from src/app and fails on a difference. */
export const PUBLIC_PATHS = [
  '/', '/autizmus', '/segitseg', '/kisfilmek', '/rolunk', '/rolunk-irtak', '/hirek', '/programok',
  '/dokumentumok', '/irodank', '/kapcsolat', '/tamogatas',
] as const;

/** Never listed and not to be crawled: the content editor and the API. */
export const PRIVATE_PREFIXES = ['/szerkeszto', '/api/'] as const;

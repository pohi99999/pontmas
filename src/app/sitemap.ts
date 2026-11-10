import type { MetadataRoute } from 'next';
import { PUBLISHED_LOCALES } from '@/i18n/routing';
import { absoluteUrl, hreflangLinks, indexedPaths, localizedPath } from '@/lib/site';

// Every indexable page in every published language, each with its hreflang alternates (card c017f163).
// No lastModified: a build date would claim a change on every deploy, and a search engine ignores a
// lastmod it finds unreliable.
export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLISHED_LOCALES.flatMap((locale) =>
    indexedPaths().map((p) => ({ url: absoluteUrl(localizedPath(p, locale)), alternates: { languages: hreflangLinks(p) } })),
  );
}

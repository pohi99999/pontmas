import type { MetadataRoute } from 'next';
import { SITE_URL, indexedPaths } from '@/lib/site';

// Every indexable page. No lastModified: a build date would claim a change on every deploy, and a
// search engine ignores a lastmod it finds unreliable. The language versions (hreflang alternates)
// come with the i18n step.
export default function sitemap(): MetadataRoute.Sitemap {
  return indexedPaths().map((p) => ({ url: p === '/' ? `${SITE_URL}/` : `${SITE_URL}${p}` }));
}

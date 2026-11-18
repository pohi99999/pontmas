import type { MetadataRoute } from 'next';
import { pageUrl } from '@/lib/site';
import { PUBLIC_PATHS } from '@/lib/sitePages';

// Every public page, with the address its own canonical link names. No lastModified: a build date
// would claim a change on every deploy, and a search engine ignores a date it finds unreliable.
export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.map((path) => ({ url: pageUrl(path) }));
}

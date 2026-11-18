import type { MetadataRoute } from 'next';
import { pageUrl } from '@/lib/site';
import { listedPaths } from '@/lib/sitePages';

// Every public page but the drafts, with the address its own canonical link names. No lastModified: a build date
// would claim a change on every deploy, and a search engine ignores a date it finds unreliable.
export default function sitemap(): MetadataRoute.Sitemap {
  return listedPaths().map((path) => ({ url: pageUrl(path) }));
}

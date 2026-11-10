import type { MetadataRoute } from 'next';
import { PRIVATE_PREFIXES, SITE_URL } from '@/lib/site';

// The editor and the API are never crawled (the editor also sends X-Robots-Tag: noindex, see
// src/lib/securityHeaders.ts, and its pages say noindex). Robots.txt is a request, not a lock: the
// editor's real protection is its login.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: [...PRIVATE_PREFIXES] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

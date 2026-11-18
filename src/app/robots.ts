import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { PRIVATE_PREFIXES } from '@/lib/sitePages';

// Everything may be crawled but the editor and the API. The editor also answers with
// X-Robots-Tag: noindex (src/lib/securityHeaders.ts) and its pages say noindex. Robots.txt is a
// request, not a lock: the editor's real protection is its login.
//
// The same rules on pontmas.vercel.app and, later, on pontmas.hu: the site's address is the live
// one in both cases (src/lib/site.ts), and every page's canonical link names it.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: [...PRIVATE_PREFIXES] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

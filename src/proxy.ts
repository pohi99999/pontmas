import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// The language routing (card c017f163). Hungarian is served at the root without a prefix, /en and /de
// with one. The API, the content editor and every file (sitemap.xml, robots.txt, images, icons) are
// left alone: the editor is Hungarian only and lives outside the language segment.
export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|szerkeszto|_next|_vercel|.*\\..*).*)'],
};

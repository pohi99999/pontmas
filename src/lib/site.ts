// The site's own address, in one place (Péter 16977, 2026-11-18). The canonical link, og:url and the
// JSON-LD block of every page are built from it, and so will the sitemap and robots.txt be.
//
// Until this file the pages named https://pontmas.hu, which still serves the foundation's OLD site
// (measured 2026-11-18: another title, none of this site's code). A page shared from the new site
// told the reader of the tag that its real address was a page of the old one, and six pages named
// the bare root as their own address.
//
// Today the site lives at pontmas.vercel.app. On the day the domain is moved, ONE setting changes:
// NEXT_PUBLIC_SITE_URL=https://pontmas.hu in the Vercel project, then a redeploy (the pages are built
// ahead of time, so the value is read at build). No code change.
import type { Metadata } from 'next';

/** Where the site is served today. */
export const DEFAULT_SITE_URL = 'https://pontmas.vercel.app';

/**
 * The address from the setting, without a trailing slash. Unset or blank: today's address. A value
 * that is not a bare https origin throws, so a mistyped setting stops the build instead of
 * publishing every page with a wrong canonical.
 */
export function siteUrlFrom(raw: string | undefined | null): string {
  const value = (raw ?? '').trim();
  if (!value) return DEFAULT_SITE_URL;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`NEXT_PUBLIC_SITE_URL is not an address: "${value}"`);
  }
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
    throw new Error(`NEXT_PUBLIC_SITE_URL must be a bare https address like https://pontmas.hu, got "${value}"`);
  }
  return url.origin;
}

export const SITE_URL = siteUrlFrom(process.env.NEXT_PUBLIC_SITE_URL);

/** The full address of a page: pageUrl('/') is the site itself, pageUrl('/hirek') is its news page. */
export function pageUrl(path: string, base: string = SITE_URL): string {
  if (!path.startsWith('/') || path.includes('?') || path.includes('#')) throw new Error(`a page path starts with "/" and has no query or fragment: "${path}"`);
  return path === '/' ? base : `${base}${path.replace(/\/+$/, '')}`;
}

export const SITE_NAME = 'PontMás Alapítvány';
/** The title and descriptions of a page that has none of its own (the root layout's). */
export const DEFAULT_TITLE = 'PontMás Alapítvány | Vas Megyei Autista Gyermekekért';
export const DEFAULT_DESCRIPTION = 'A PontMás Alapítvány célja a Vas vármegyében élő autista gyermekek és családjaik támogatása. Csatlakozzon közösségünkhöz, támogassa munkánkat!';
export const DEFAULT_SHARE_DESCRIPTION = 'A PontMás Alapítvány célja a Vas vármegyében élő autista gyermekek és családjaik támogatása.';

/** The share image: src/app/opengraph-image.png, served at this path; its alt text is opengraph-image.alt.txt. */
export const SHARE_IMAGE = { url: '/opengraph-image.png', width: 1200, height: 630, alt: 'PontMás Vas Megyei Autista Gyermekekért Alapítvány logó' } as const;

/**
 * The Open Graph block of one page. Next.js does not merge a page's `openGraph` with the layout's:
 * the page's block replaces it whole. So every page states the whole block, through this function,
 * and only its own address, title and description differ.
 */
export function openGraphFor(path: string, og: { title: string; description: string }): NonNullable<Metadata['openGraph']> {
  return {
    title: og.title,
    description: og.description,
    url: pageUrl(path),
    siteName: SITE_NAME,
    locale: 'hu_HU',
    type: 'website',
    // on every page: a page shared without an image gets the small card (six pages did, until T2)
    images: [SHARE_IMAGE],
  };
}

/**
 * The address part of a page's metadata: its canonical link and its Open Graph block. A page with a
 * title and description of its own passes the share texts; a page without passes nothing and keeps
 * the layout's title and description.
 */
export function pageMetadata(path: string, og?: { title: string; description: string }): Metadata {
  return {
    alternates: { canonical: pageUrl(path) },
    openGraph: openGraphFor(path, og ?? { title: DEFAULT_TITLE, description: DEFAULT_SHARE_DESCRIPTION }),
  };
}

/**
 * The whole metadata of a page with a title and a description of its own, which are also what a
 * share shows. The description is the sentence the page itself opens with (its header's subtitle):
 * the tag says nothing the page does not.
 */
export function titledPage(path: string, title: string, description: string): Metadata {
  return { title, description, ...pageMetadata(path, { title, description }) };
}

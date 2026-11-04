// The editable content model of the site (version 1: news and programs, each with an optional image).
//
// What is NOT here, on purpose and for good: the bank account number, the tax number, the
// registration number, the address and phone of the foundation, the legal pages and the privacy
// text. They stay in the code, are changed only through a reviewed pull request, and the model has
// no field for them, so the editor cannot write them (tests/editor-content.test.mjs states this).
//
// Every text field is plain text: the pages render it as React text, never as HTML or markdown.

export type ProgramCategory = 'event' | 'camp' | 'family';
export const PROGRAM_CATEGORIES: readonly ProgramCategory[] = ['event', 'camp', 'family'];

/** Who ticked the child photo declaration, and when. Stamped by the server, not by the browser. */
export interface ChildPhotoDeclaration {
  declaredBy: string;
  at: string;
}

/**
 * An image in the Blob store. Without a childPhotoDeclaration it is a draft: stored, but never
 * shown on the public pages.
 */
export interface ContentImage {
  url: string;
  alt: string;
  width: number;
  height: number;
  childPhotoDeclaration?: ChildPhotoDeclaration;
}

export interface NewsItem {
  id: string;
  /** Machine-readable date (YYYY-MM-DD); `date` is the text shown on the page. */
  publishedAt: string;
  hidden: boolean;
  /** The first visible featured item is shown in the large banner on /hirek. */
  featured: boolean;
  badge: string;
  title: string;
  date: string;
  location: string;
  speaker: string;
  description: string;
  highlights: string[];
  actionText: string;
  actionHref: string;
  googleFormHref?: string;
  image?: ContentImage;
}

export interface ProgramItem {
  id: string;
  publishedAt: string;
  hidden: boolean;
  category: ProgramCategory;
  title: string;
  date: string;
  location: string;
  badge: string;
  description: string;
  highlights: string[];
  image?: ContentImage;
}

export interface SiteContent {
  version: 1;
  /** Set by the store on every save; null for the seed. */
  updatedAt: string | null;
  news: NewsItem[];
  programs: ProgramItem[];
}

// The complete list of keys the validator accepts. Anything else is refused.
export const CONTENT_FIELDS = ['version', 'updatedAt', 'news', 'programs'] as const;
export const NEWS_FIELDS = [
  'id', 'publishedAt', 'hidden', 'featured', 'badge', 'title', 'date', 'location', 'speaker',
  'description', 'highlights', 'actionText', 'actionHref', 'googleFormHref', 'image',
] as const;
export const PROGRAM_FIELDS = [
  'id', 'publishedAt', 'hidden', 'category', 'title', 'date', 'location', 'badge', 'description',
  'highlights', 'image',
] as const;
export const IMAGE_FIELDS = ['url', 'alt', 'width', 'height', 'childPhotoDeclaration'] as const;
export const DECLARATION_FIELDS = ['declaredBy', 'at'] as const;

export const LIMITS = {
  title: 160,
  description: 2000,
  highlight: 200,
  highlights: 8,
  location: 200,
  speaker: 200,
  badge: 80,
  date: 120,
  actionText: 80,
  href: 500,
  alt: 200,
  declaredBy: 200,
  id: 64,
  news: 100,
  programs: 50,
  imageSide: 1600,
} as const;

/** Cache tag of the public content; the save route revalidates it. */
export const CONTENT_TAG = 'site-content';

/** Images may only come from this site's Blob store, under media/, with a random name. */
export const BLOB_IMAGE_URL_RE =
  /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/media\/[A-Za-z0-9_-]{16,64}\.(?:jpg|png|webp)$/;

export const CHILD_PHOTO_DECLARATION_TEXT =
  'A képen nincs felismerhető gyermek, VAGY van írásos szülői hozzájárulásunk a nyilvános közzétételhez.';

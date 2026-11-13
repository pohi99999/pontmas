// What the public pages show, as plain functions (no Next imports) so node:test can run them.
// Rule: the site never breaks because of the store. Empty, not configured, unreadable or invalid
// content all mean the seed.
import { SEED_CONTENT } from './seed';
import { BLOB_IMAGE_URL_RE, type ContentImage, type NewsItem, type ProgramItem, type SiteContent } from './types';
import { validateContent } from './validate';

export type ContentSource = 'store' | 'seed';

/** Valid stored content, or the seed. */
export function pickContent(raw: unknown): { content: SiteContent; source: ContentSource } {
  if (raw === null || raw === undefined) return { content: SEED_CONTENT, source: 'seed' };
  // lenient on the declaration: publicImage() below hides an undeclared image, and one such image
  // must never make the whole site fall back to the seed
  const v = validateContent(raw, { requireDeclaration: false });
  if (!v.ok) {
    console.warn('[tartalom] a tárolt tartalom hibás, a beépített tartalom jelenik meg');
    return { content: SEED_CONTENT, source: 'seed' };
  }
  return { content: v.value, source: 'store' };
}

/** Runs the read and falls back to the seed on any error. */
export async function readContentSafely(read: () => Promise<unknown>): Promise<{ content: SiteContent; source: ContentSource }> {
  try {
    return pickContent(await read());
  } catch {
    console.warn('[tartalom] a tároló nem érhető el, a beépített tartalom jelenik meg');
    return { content: SEED_CONTENT, source: 'seed' };
  }
}

/**
 * Events that are over and get no new date (Edina 2026-11-13: the parent club of 2024-10-26). Whatever
 * the store says about them (featured, a registration link), they show among the earlier items, with no
 * registration button or form. By id, not by date: publishedAt is the publishing date, not the event's.
 */
export const LEZARULT_ESEMENYEK: ReadonlySet<string> = new Set(['szuloklub-2024-10-26']);

/** A news item as the visitor sees it: an ended event loses the banner and its registration links. */
export function publicNews(item: NewsItem): NewsItem {
  if (!LEZARULT_ESEMENYEK.has(item.id)) return item;
  return { ...item, featured: false, actionText: '', actionHref: '', googleFormHref: undefined };
}

/**
 * The banner item and the cards of /hirek. On main the banner was newsItems[0] and the cards
 * newsItems.slice(1); now the banner is the first visible featured item and the cards are every
 * other visible item, which is the same for the seed.
 */
export function splitNews(items: NewsItem[]): { featured: NewsItem | null; rest: NewsItem[] } {
  const visible = items.filter((n) => !n.hidden).map(publicNews);
  const featured = visible.find((n) => n.featured) ?? null;
  return { featured, rest: visible.filter((n) => n !== featured) };
}

export function visiblePrograms(items: ProgramItem[]): ProgramItem[] {
  return items.filter((p) => !p.hidden);
}

/** An image is shown only when it is from our store AND carries the child photo declaration. */
export function publicImage(image: ContentImage | undefined): ContentImage | null {
  if (!image || !image.childPhotoDeclaration) return null;
  if (!BLOB_IMAGE_URL_RE.test(image.url)) return null;
  return image;
}

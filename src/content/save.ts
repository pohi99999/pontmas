// What happens to content between the editor's PUT and the store: validation, the stamping of the
// child photo declarations, and the one-line summary for history and the notification mail.
import type { ContentImage, SiteContent } from './types';
import { validateContent, type ValidationError } from './validate';

type Item = { id: string; hidden: boolean; image?: ContentImage };

function imagesByUrl(content: SiteContent): Map<string, ContentImage> {
  const m = new Map<string, ContentImage>();
  for (const it of [...content.news, ...content.programs]) if (it.image) m.set(it.image.url, it.image);
  return m;
}

/**
 * Validates the new content and stamps the declarations. The browser only says "ticked": who and
 * when is decided here. A declaration that was already stored for the same image is kept as it was;
 * a new one gets the logged-in editor and the current time.
 */
export function prepareSave(
  prev: SiteContent,
  raw: unknown,
  editor: string,
  now: Date,
): { ok: true; content: SiteContent; summary: string; removedImages: string[] } | { ok: false; errors: ValidationError[] } {
  const v = validateContent(raw);
  if (!v.ok) return v;
  const before = imagesByUrl(prev);
  const stamp = (it: Item) => {
    if (!it.image?.childPhotoDeclaration) return;
    const old = before.get(it.image.url)?.childPhotoDeclaration;
    it.image.childPhotoDeclaration = old ? { ...old } : { declaredBy: editor, at: now.toISOString() };
  };
  v.value.news.forEach(stamp);
  v.value.programs.forEach(stamp);
  const after = imagesByUrl(v.value);
  const removedImages = [...before.keys()].filter((u) => !after.has(u));
  return { ok: true, content: v.value, summary: summarizeChange(prev, v.value), removedImages };
}

function diff(prev: Item[], next: Item[], noun: string): string[] {
  const p = new Map(prev.map((x) => [x.id, x]));
  const n = new Map(next.map((x) => [x.id, x]));
  let added = 0, removed = 0, changed = 0, hidden = 0, shown = 0;
  for (const [id, it] of n) {
    const old = p.get(id);
    if (!old) { added++; continue; }
    if (old.hidden !== it.hidden) {
      if (it.hidden) hidden++;
      else shown++;
    }
    const a = JSON.stringify({ ...old, hidden: false }), b = JSON.stringify({ ...it, hidden: false });
    if (a !== b) changed++;
  }
  for (const id of p.keys()) if (!n.has(id)) removed++;
  const order = prev.map((x) => x.id).filter((id) => n.has(id)).join() !== next.map((x) => x.id).filter((id) => p.has(id)).join();
  const out: string[] = [];
  if (added) out.push(`+${added} ${noun}`);
  if (removed) out.push(`-${removed} ${noun}`);
  if (changed) out.push(`${changed} ${noun} módosítva`);
  if (hidden) out.push(`${hidden} ${noun} elrejtve`);
  if (shown) out.push(`${shown} ${noun} újra látható`);
  if (order && !added && !removed) out.push(`${noun} sorrend módosítva`);
  return out;
}

/** "+1 hír, 1 program módosítva" style summary; "nincs változás" when nothing differs. */
export function summarizeChange(prev: SiteContent, next: SiteContent): string {
  const parts = [...diff(prev.news, next.news, 'hír'), ...diff(prev.programs, next.programs, 'program')];
  return parts.length ? parts.join(', ') : 'nincs változás';
}

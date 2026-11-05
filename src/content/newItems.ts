// New items of the editor and the wording around publishing them, as plain functions so node:test
// can run them. A new item starts HIDDEN: the first save never publishes anything by itself, the
// editor decides when it goes public. An item that already exists keeps the state it has.
import type { NewsItem, ProgramItem } from './types';

const today = () => new Date().toISOString().slice(0, 10);
const newId = (prefix: 'hir' | 'program') => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

export function blankNews(): NewsItem {
  return {
    id: newId('hir'), publishedAt: today(), hidden: true, featured: false, badge: '', title: '', date: '',
    location: '', speaker: '', description: '', highlights: [], actionText: '', actionHref: '',
  };
}

export function blankProgram(): ProgramItem {
  return {
    id: newId('program'), publishedAt: today(), hidden: true, category: 'event', title: '', date: '', location: '',
    badge: '', description: '', highlights: [],
  };
}

export const HIDDEN_TOGGLE_LABEL = 'Rejtett';
export const HIDDEN_TOGGLE_HINT = 'A rejtett elem nem jelenik meg a honlapon. A közzétételhez vegye ki a pipát.';

/** What the Save button says: it must be clear before the click whether the item goes public. */
export const saveButtonText = (hidden: boolean) => (hidden ? 'Mentés rejtve' : 'Mentés és közzététel');

/** What the editor is told after a save. */
export const savedMessage = (hidden: boolean) =>
  hidden ? 'Mentve rejtve, a honlapon nem látszik.' : 'Mentve, a honlapon is megjelent.';

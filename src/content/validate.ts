// Validation of the editable content. The same code runs on the server (the save route, which is
// the real check) and in the editor in the browser (so mistakes show before a save is tried).
// A rejected save changes nothing: the route validates first and writes only a valid whole.
import {
  BLOB_IMAGE_URL_RE,
  CONTENT_FIELDS,
  DECLARATION_FIELDS,
  IMAGE_FIELDS,
  LIMITS,
  NEWS_FIELDS,
  PROGRAM_CATEGORIES,
  PROGRAM_FIELDS,
  type ContentImage,
  type NewsItem,
  type ProgramItem,
  type SiteContent,
} from './types';

export interface ValidationError {
  path: string;
  message: string;
}
export type ValidationResult<T> = { ok: true; value: T } | { ok: false; errors: ValidationError[] };

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v);

// Control characters are never wanted; a newline is allowed only in the long description.
const CONTROL = /[\u0000-\u0008\u000B-\u001F\u007F]/;
const NEWLINE = /[\n\r\t]/;
// Something that looks like an HTML tag or comment. The pages would show it as text anyway, but
// pasted markup is almost always a mistake, so it is refused with a clear message.
const TAG_LIKE = /<[A-Za-z!/?]/;
const ID_RE = /^[a-z0-9][a-z0-9-]{0,63}$/;
const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

/** A link is either https:// with a host, or a path on this site starting with a single "/". */
export function isAllowedLink(v: string): boolean {
  if (/\s/.test(v)) return false;
  if (v.startsWith('/')) return !v.startsWith('//') && !v.startsWith('/\\');
  if (!v.startsWith('https://')) return false;
  try {
    const u = new URL(v);
    return u.protocol === 'https:' && !!u.hostname && !u.username && !u.password;
  } catch {
    return false;
  }
}

/** A real calendar date in the form YYYY-MM-DD (2024-02-30 is refused). */
export function isRealDate(v: string): boolean {
  const m = DATE_RE.exec(v);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (y < 1990 || y > 2100) return false;
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
}

type TextOpts = { max: number; required: boolean; label: string; multiline?: boolean };

class Checker {
  errors: ValidationError[] = [];
  add(path: string, message: string) {
    this.errors.push({ path, message });
  }

  keys(o: Obj, allowed: readonly string[], path: string) {
    for (const k of Object.keys(o)) {
      if (!allowed.includes(k)) this.add(path ? `${path}.${k}` : k, `Ismeretlen mező: ${k}. Ezt a szerkesztő nem írhatja.`);
    }
  }

  text(o: Obj, key: string, path: string, opts: TextOpts): string {
    return this.str(o[key], `${path}.${key}`, opts);
  }

  str(v: unknown, p: string, opts: TextOpts): string {
    if (v === undefined || v === null) {
      if (opts.required) this.add(p, `${opts.label}: kötelező.`);
      return '';
    }
    if (typeof v !== 'string') {
      this.add(p, `${opts.label}: szöveg kell.`);
      return '';
    }
    const s = v.trim();
    if (opts.required && !s) this.add(p, `${opts.label}: kötelező.`);
    if (s.length > opts.max) this.add(p, `${opts.label}: legfeljebb ${opts.max} karakter lehet (most ${s.length}).`);
    if (CONTROL.test(s) || (!opts.multiline && NEWLINE.test(s))) this.add(p, `${opts.label}: nem megengedett vezérlőkaraktert tartalmaz.`);
    if (TAG_LIKE.test(s)) this.add(p, `${opts.label}: csak egyszerű szöveg lehet, HTML nem.`);
    return s;
  }

  bool(o: Obj, key: string, path: string, label: string): boolean {
    const v = o[key];
    if (typeof v !== 'boolean') {
      this.add(`${path}.${key}`, `${label}: igen/nem érték kell.`);
      return false;
    }
    return v;
  }

  link(o: Obj, key: string, path: string, label: string, required: boolean): string {
    const s = this.text(o, key, path, { max: LIMITS.href, required, label });
    if (s && !isAllowedLink(s)) this.add(`${path}.${key}`, `${label}: csak https:// kezdetű cím vagy "/" kezdetű belső útvonal lehet.`);
    return s;
  }

  highlights(o: Obj, path: string): string[] {
    const v = o.highlights;
    const p = `${path}.highlights`;
    if (!Array.isArray(v)) {
      this.add(p, 'A kiemelt pontok listája hiányzik.');
      return [];
    }
    if (v.length > LIMITS.highlights) this.add(p, `Legfeljebb ${LIMITS.highlights} kiemelt pont lehet.`);
    return v.map((h, i) => this.str(h, `${p}[${i}]`, { max: LIMITS.highlight, required: true, label: `${i + 1}. kiemelt pont` }));
  }

  image(o: Obj, path: string): ContentImage | undefined {
    const v = o.image;
    if (v === undefined || v === null) return undefined;
    const p = `${path}.image`;
    if (!isObj(v)) {
      this.add(p, 'A kép adatai hibásak.');
      return undefined;
    }
    this.keys(v, IMAGE_FIELDS, p);
    const url = typeof v.url === 'string' ? v.url : '';
    if (!BLOB_IMAGE_URL_RE.test(url)) this.add(`${p}.url`, 'A kép csak a szerkesztőben feltöltött fájl lehet.');
    const alt = this.text(v, 'alt', p, { max: LIMITS.alt, required: true, label: 'A kép leírása (alt szöveg)' });
    const dim = (k: 'width' | 'height') => {
      const n = v[k];
      if (typeof n !== 'number' || !Number.isInteger(n) || n < 1 || n > LIMITS.imageSide) {
        this.add(`${p}.${k}`, `A kép mérete hibás (legfeljebb ${LIMITS.imageSide} képpont).`);
        return 1;
      }
      return n;
    };
    const image: ContentImage = { url, alt, width: dim('width'), height: dim('height') };
    const d = v.childPhotoDeclaration;
    if (d !== undefined && d !== null) {
      const dp = `${p}.childPhotoDeclaration`;
      if (!isObj(d)) {
        this.add(dp, 'A nyilatkozat adatai hibásak.');
      } else {
        this.keys(d, DECLARATION_FIELDS, dp);
        const declaredBy = this.text(d, 'declaredBy', dp, { max: LIMITS.declaredBy, required: true, label: 'A nyilatkozó' });
        const at = typeof d.at === 'string' ? d.at : '';
        if (!ISO_RE.test(at) || Number.isNaN(Date.parse(at))) this.add(`${dp}.at`, 'A nyilatkozat időpontja hibás.');
        image.childPhotoDeclaration = { declaredBy, at };
      }
    }
    return image;
  }

  base(o: Obj, path: string) {
    const id = typeof o.id === 'string' ? o.id : '';
    if (!ID_RE.test(id)) this.add(`${path}.id`, 'Belső azonosító hibás.');
    const publishedAt = typeof o.publishedAt === 'string' ? o.publishedAt : '';
    if (!isRealDate(publishedAt)) this.add(`${path}.publishedAt`, 'A közzététel dátuma valós dátum kell legyen (ÉÉÉÉ-HH-NN).');
    const hidden = this.bool(o, 'hidden', path, 'Rejtett');
    return { id, publishedAt, hidden };
  }
}

function checkNews(c: Checker, raw: unknown, path: string): NewsItem {
  const o = isObj(raw) ? raw : {};
  if (!isObj(raw)) c.add(path, 'A hír adatai hibásak.');
  c.keys(o, NEWS_FIELDS, path);
  const item: NewsItem = {
    ...c.base(o, path),
    featured: c.bool(o, 'featured', path, 'Kiemelt'),
    badge: c.text(o, 'badge', path, { max: LIMITS.badge, required: true, label: 'A címke' }),
    title: c.text(o, 'title', path, { max: LIMITS.title, required: true, label: 'A cím' }),
    date: c.text(o, 'date', path, { max: LIMITS.date, required: true, label: 'Az időpont szövege' }),
    location: c.text(o, 'location', path, { max: LIMITS.location, required: false, label: 'A helyszín' }),
    speaker: c.text(o, 'speaker', path, { max: LIMITS.speaker, required: false, label: 'Az előadó' }),
    description: c.text(o, 'description', path, { max: LIMITS.description, required: true, label: 'A leírás', multiline: true }),
    highlights: c.highlights(o, path),
    actionText: c.text(o, 'actionText', path, { max: LIMITS.actionText, required: false, label: 'A gomb szövege' }),
    actionHref: c.link(o, 'actionHref', path, 'A gomb linkje', false),
  };
  if (!!item.actionText !== !!item.actionHref) c.add(`${path}.actionHref`, 'A gomb szövegét és linkjét együtt kell megadni (vagy egyiket sem).');
  const form = c.link(o, 'googleFormHref', path, 'Az űrlap linkje', false);
  if (form) {
    if (!form.startsWith('https://')) c.add(`${path}.googleFormHref`, 'Az űrlap linkje https:// kezdetű kell legyen.');
    item.googleFormHref = form;
  }
  const image = c.image(o, path);
  if (image) item.image = image;
  return item;
}

function checkProgram(c: Checker, raw: unknown, path: string): ProgramItem {
  const o = isObj(raw) ? raw : {};
  if (!isObj(raw)) c.add(path, 'A program adatai hibásak.');
  c.keys(o, PROGRAM_FIELDS, path);
  const category = o.category as ProgramItem['category'];
  if (!PROGRAM_CATEGORIES.includes(category)) c.add(`${path}.category`, 'A kategória hibás.');
  const item: ProgramItem = {
    ...c.base(o, path),
    category,
    title: c.text(o, 'title', path, { max: LIMITS.title, required: true, label: 'A cím' }),
    date: c.text(o, 'date', path, { max: LIMITS.date, required: true, label: 'Az időpont szövege' }),
    location: c.text(o, 'location', path, { max: LIMITS.location, required: true, label: 'A helyszín' }),
    badge: c.text(o, 'badge', path, { max: LIMITS.badge, required: true, label: 'A címke' }),
    description: c.text(o, 'description', path, { max: LIMITS.description, required: true, label: 'A leírás', multiline: true }),
    highlights: c.highlights(o, path),
  };
  const image = c.image(o, path);
  if (image) item.image = image;
  return item;
}

function uniqueIds(c: Checker, items: { id: string }[], path: string) {
  const seen = new Set<string>();
  items.forEach((it, i) => {
    if (seen.has(it.id)) c.add(`${path}[${i}].id`, 'Két elemnek ugyanaz az azonosítója.');
    seen.add(it.id);
  });
}

export function validateNewsItem(raw: unknown): ValidationResult<NewsItem> {
  const c = new Checker();
  const value = checkNews(c, raw, 'item');
  return c.errors.length ? { ok: false, errors: c.errors } : { ok: true, value };
}

export function validateProgramItem(raw: unknown): ValidationResult<ProgramItem> {
  const c = new Checker();
  const value = checkProgram(c, raw, 'item');
  return c.errors.length ? { ok: false, errors: c.errors } : { ok: true, value };
}

/** Checks the whole content and returns a clean copy (trimmed text, only known keys). */
export function validateContent(raw: unknown): ValidationResult<SiteContent> {
  const c = new Checker();
  if (!isObj(raw)) return { ok: false, errors: [{ path: '', message: 'A tartalom hibás.' }] };
  c.keys(raw, CONTENT_FIELDS, '');
  if (raw.version !== 1) c.add('version', 'Ismeretlen tartalomverzió.');
  const updatedAt = typeof raw.updatedAt === 'string' && ISO_RE.test(raw.updatedAt) ? raw.updatedAt : null;
  const news = Array.isArray(raw.news) ? raw.news : null;
  const programs = Array.isArray(raw.programs) ? raw.programs : null;
  if (!news) c.add('news', 'A hírek listája hiányzik.');
  if (!programs) c.add('programs', 'A programok listája hiányzik.');
  if (news && news.length > LIMITS.news) c.add('news', `Legfeljebb ${LIMITS.news} hír lehet.`);
  if (programs && programs.length > LIMITS.programs) c.add('programs', `Legfeljebb ${LIMITS.programs} program lehet.`);
  const value: SiteContent = {
    version: 1,
    updatedAt,
    news: (news ?? []).slice(0, LIMITS.news).map((n, i) => checkNews(c, n, `news[${i}]`)),
    programs: (programs ?? []).slice(0, LIMITS.programs).map((p, i) => checkProgram(c, p, `programs[${i}]`)),
  };
  uniqueIds(c, value.news, 'news');
  uniqueIds(c, value.programs, 'programs');
  return c.errors.length ? { ok: false, errors: c.errors } : { ok: true, value };
}

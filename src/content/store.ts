// The storage interface of the editor, and an in-memory implementation for the tests.
// The real one is BlobContentStore (blobStore.ts), which gets the @vercel/blob functions injected,
// so no module here loads @vercel/blob.
import type { SiteContent } from './types';

export interface HistoryEntry {
  /** Timestamp based, also the file name: content/history/<id>.json */
  id: string;
  at: string;
  editor: string;
  summary: string;
}

export interface StoredFile {
  url: string;
  pathname: string;
}

export type ImageExt = 'jpg' | 'png' | 'webp';

export interface ContentStore {
  /** The saved content, or null when nothing was saved yet. Throws when the store cannot be read. */
  read(): Promise<SiteContent | null>;
  /** Saves a new version (and a history copy); returns its history entry. */
  write(content: SiteContent, editor: string, summary: string): Promise<HistoryEntry>;
  /** Newest first, at most HISTORY_KEEP entries. */
  listHistory(): Promise<HistoryEntry[]>;
  readHistory(id: string): Promise<SiteContent | null>;
  /** Stores an image under media/ with a random name; the caller cannot choose the path. */
  putFile(bytes: Uint8Array, ext: ImageExt, contentType: string): Promise<StoredFile>;
  deleteFile(url: string): Promise<void>;
  hasFile(url: string): Promise<boolean>;
}

export const CONTENT_PATH = 'content/content.json';
export const HISTORY_PREFIX = 'content/history/';
export const HISTORY_INDEX_PATH = 'content/history-index.json';
export const MEDIA_PREFIX = 'media/';
export const HISTORY_KEEP = 50;
export const HISTORY_ID_RE = /^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z-[a-z0-9]{6}$/;

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

function randomChars(n: number, alphabet: string): string {
  const bytes = new Uint8Array(n);
  globalThis.crypto.getRandomValues(bytes);
  let out = '';
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return out;
}

/** 2026-11-04T10:00:00.000Z becomes 2026-11-04T10-00-00-000Z-<6 random>: sortable, path safe. */
export function historyIdFor(at: Date): string {
  return `${at.toISOString().replace(/[:.]/g, '-')}-${randomChars(6, ALPHABET)}`;
}

/** A random, unguessable file name (24 characters from 64, about 144 bits). */
export function randomFileName(): string {
  return randomChars(24, `${ALPHABET}ABCDEFGHIJKLMNOPQRSTUVWXYZ_-`.slice(0, 64));
}

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

/** In-memory store for the tests. `failing: true` makes every call throw, like an unreachable store. */
export class MemoryContentStore implements ContentStore {
  content: SiteContent | null = null;
  history: { entry: HistoryEntry; content: SiteContent }[] = [];
  files = new Map<string, { bytes: Uint8Array; contentType: string }>();
  failing = false;
  private now: () => Date;
  private base: string;

  constructor(opts: { now?: () => Date; failing?: boolean; base?: string } = {}) {
    this.now = opts.now ?? (() => new Date());
    this.failing = !!opts.failing;
    this.base = opts.base ?? 'https://teszt-tarolo.public.blob.vercel-storage.com/';
  }

  private check() {
    if (this.failing) throw new Error('store unreachable');
  }

  async read() {
    this.check();
    return this.content ? clone(this.content) : null;
  }

  async write(content: SiteContent, editor: string, summary: string) {
    this.check();
    const at = this.now();
    const entry: HistoryEntry = { id: historyIdFor(at), at: at.toISOString(), editor, summary };
    const saved = { ...clone(content), updatedAt: entry.at };
    this.history.unshift({ entry, content: saved });
    this.history = this.history.slice(0, HISTORY_KEEP);
    this.content = saved;
    return entry;
  }

  async listHistory() {
    this.check();
    return this.history.map((h) => ({ ...h.entry }));
  }

  async readHistory(id: string) {
    this.check();
    const h = this.history.find((x) => x.entry.id === id);
    return h ? clone(h.content) : null;
  }

  async putFile(bytes: Uint8Array, ext: ImageExt, contentType: string) {
    this.check();
    const pathname = `${MEDIA_PREFIX}${randomFileName()}.${ext}`;
    const url = `${this.base}${pathname}`;
    this.files.set(url, { bytes, contentType });
    return { url, pathname };
  }

  async deleteFile(url: string) {
    this.check();
    this.files.delete(url);
  }

  async hasFile(url: string) {
    this.check();
    return this.files.has(url);
  }
}

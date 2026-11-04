// ContentStore on Vercel Blob. The @vercel/blob functions are injected (blobApi.ts passes the real
// ones), so this file never loads the package itself and the tests can run it against a fake.
//
// TWO stores, because the two kinds of data have opposite needs:
//   PRIVATE store (token BLOB_CONTENT_READ_WRITE_TOKEN): only this server reads it, with the token.
//     content/content.json         the current content (hidden items included)
//     content/history/<id>.json    a copy of every saved version, the last HISTORY_KEEP kept
//     content/history-index.json   who saved what and when (the editors' addresses), newest first
//   PUBLIC store (token BLOB_READ_WRITE_TOKEN): the site has to show the images.
//     media/<random>.<ext>         images, random names, the caller cannot choose the path
// Fail closed: a write that does not come back with a URL of the expected kind (private host for
// the content, public host for an image) is deleted again and refused, so a token that points at
// the wrong kind of store can not quietly publish the content.
import type { SiteContent } from './types';
import {
  CONTENT_PATH,
  HISTORY_ID_RE,
  HISTORY_INDEX_PATH,
  HISTORY_KEEP,
  HISTORY_PREFIX,
  MEDIA_PREFIX,
  historyIdFor,
  randomFileName,
  type ContentStore,
  type HistoryEntry,
  type ImageExt,
} from './store';

type Access = { access: 'public' | 'private'; token: string };

/** The part of @vercel/blob this store uses. */
export interface BlobApi {
  put(
    pathname: string,
    body: string | Uint8Array | Blob,
    options: Access & { contentType?: string; addRandomSuffix?: boolean; allowOverwrite?: boolean; cacheControlMaxAge?: number },
  ): Promise<{ url: string; pathname: string }>;
  get(pathname: string, options: Access & { useCache?: boolean }): Promise<{ statusCode: number; stream: ReadableStream<Uint8Array> | null } | null>;
  list(options: { token: string; prefix?: string; cursor?: string; limit?: number }): Promise<{
    blobs: { url: string; pathname: string }[];
    cursor?: string;
    hasMore: boolean;
  }>;
  del(urlOrPathname: string | string[], options: { token: string }): Promise<void>;
  head(urlOrPathname: string, options: { token: string }): Promise<unknown>;
}

interface HistoryFile {
  entry: HistoryEntry;
  content: SiteContent;
}

const JSON_TYPE = 'application/json; charset=utf-8';

/** What the store hands back for a private blob and for a public one (the SDK builds <store>.<access>.blob...). */
export const PRIVATE_URL_RE = /^https:\/\/[a-z0-9-]+\.private\.blob\.vercel-storage\.com\//;
export const PUBLIC_URL_RE = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//;

export interface BlobTokens {
  /** Token of the PRIVATE store: content and history. */
  content: string;
  /** Token of the PUBLIC store: images. Without it the content works, uploads do not. */
  media?: string;
}

export class BlobContentStore implements ContentStore {
  constructor(
    private api: BlobApi,
    private tokens: BlobTokens,
    private now: () => Date = () => new Date(),
  ) {}

  private async readJson<T>(pathname: string): Promise<T | null> {
    // useCache: false makes the SDK read from the origin (?cache=0), so a save is seen at once
    const res = await this.api.get(pathname, { access: 'private', token: this.tokens.content, useCache: false });
    if (!res) return null;
    if (res.statusCode !== 200 || !res.stream) throw new Error(`blob read failed: ${res.statusCode}`);
    const text = await new Response(res.stream).text();
    return JSON.parse(text) as T;
  }

  private async writeJson(pathname: string, value: unknown, overwrite: boolean) {
    const res = await this.api.put(pathname, JSON.stringify(value), {
      access: 'private',
      token: this.tokens.content,
      contentType: JSON_TYPE,
      addRandomSuffix: false,
      allowOverwrite: overwrite,
    });
    if (!PRIVATE_URL_RE.test(res.url)) {
      // the token belongs to a store that is not private: take the file out again and refuse
      await this.api.del(pathname, { token: this.tokens.content }).catch(() => undefined);
      throw new Error('the content store is not private');
    }
  }

  private mediaToken(): string {
    if (!this.tokens.media) throw new Error('the image store is not configured');
    return this.tokens.media;
  }

  read(): Promise<SiteContent | null> {
    return this.readJson<SiteContent>(CONTENT_PATH);
  }

  async write(content: SiteContent, editor: string, summary: string): Promise<HistoryEntry> {
    const at = this.now();
    const entry: HistoryEntry = { id: historyIdFor(at), at: at.toISOString(), editor, summary };
    const saved: SiteContent = { ...content, updatedAt: entry.at };
    // the history copy first: if the main write fails after it, nothing visible has changed
    await this.writeJson(`${HISTORY_PREFIX}${entry.id}.json`, { entry, content: saved } satisfies HistoryFile, false);
    await this.writeJson(CONTENT_PATH, saved, true);
    const index = (await this.readJson<HistoryEntry[]>(HISTORY_INDEX_PATH).catch(() => null)) ?? [];
    await this.writeJson(HISTORY_INDEX_PATH, [entry, ...index.filter((e) => e.id !== entry.id)].slice(0, HISTORY_KEEP), true);
    await this.prune();
    return entry;
  }

  /** Deletes every history copy beyond the newest HISTORY_KEEP (by file name, which is the time). */
  private async prune() {
    const paths: string[] = [];
    let cursor: string | undefined;
    do {
      const page = await this.api.list({ token: this.tokens.content, prefix: HISTORY_PREFIX, cursor, limit: 1000 });
      paths.push(...page.blobs.map((b) => b.pathname));
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    const old = paths.sort().reverse().slice(HISTORY_KEEP);
    if (old.length) await this.api.del(old, { token: this.tokens.content });
  }

  async listHistory(): Promise<HistoryEntry[]> {
    return ((await this.readJson<HistoryEntry[]>(HISTORY_INDEX_PATH)) ?? []).slice(0, HISTORY_KEEP);
  }

  async readHistory(id: string): Promise<SiteContent | null> {
    if (!HISTORY_ID_RE.test(id)) return null;
    const file = await this.readJson<HistoryFile>(`${HISTORY_PREFIX}${id}.json`);
    return file?.content ?? null;
  }

  async putFile(bytes: Uint8Array, ext: ImageExt, contentType: string) {
    const pathname = `${MEDIA_PREFIX}${randomFileName()}.${ext}`;
    const token = this.mediaToken();
    const res = await this.api.put(pathname, bytes, {
      access: 'public',
      token,
      contentType,
      addRandomSuffix: false,
      allowOverwrite: false,
      cacheControlMaxAge: 31536000,
    });
    if (!PUBLIC_URL_RE.test(res.url)) {
      // an image must be on the public store (the site shows it); anything else is refused
      await this.api.del(pathname, { token }).catch(() => undefined);
      throw new Error('the image store is not public');
    }
    return { url: res.url, pathname: res.pathname };
  }

  private isOurMedia(url: string) {
    try {
      const u = new URL(url);
      return u.protocol === 'https:' && u.hostname.endsWith('.public.blob.vercel-storage.com') && u.pathname.startsWith(`/${MEDIA_PREFIX}`);
    } catch {
      return false;
    }
  }

  async deleteFile(url: string) {
    if (!this.isOurMedia(url)) throw new Error('not a media file of this store');
    await this.api.del(url, { token: this.mediaToken() });
  }

  async hasFile(url: string) {
    if (!this.isOurMedia(url)) return false;
    try {
      await this.api.head(url, { token: this.mediaToken() });
      return true;
    } catch {
      return false;
    }
  }
}

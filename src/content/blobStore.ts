// ContentStore on Vercel Blob. The @vercel/blob functions are injected (blobApi.ts passes the real
// ones), so this file never loads the package itself and the tests can run it against a fake.
//
// Layout in the store (all public, because the site has to show the images):
//   content/content.json         the current content
//   content/history/<id>.json    a copy of every saved version, the last HISTORY_KEEP kept
//   content/history-index.json   who saved what and when, newest first
//   media/<random>.<ext>         images, random names, the caller cannot choose the path
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

type Access = { access: 'public'; token: string };

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

export class BlobContentStore implements ContentStore {
  constructor(
    private api: BlobApi,
    private token: string,
    private now: () => Date = () => new Date(),
  ) {}

  private async readJson<T>(pathname: string): Promise<T | null> {
    const res = await this.api.get(pathname, { access: 'public', token: this.token, useCache: false });
    if (!res) return null;
    if (res.statusCode !== 200 || !res.stream) throw new Error(`blob read failed: ${res.statusCode}`);
    const text = await new Response(res.stream).text();
    return JSON.parse(text) as T;
  }

  private async writeJson(pathname: string, value: unknown, overwrite: boolean) {
    await this.api.put(pathname, JSON.stringify(value), {
      access: 'public',
      token: this.token,
      contentType: JSON_TYPE,
      addRandomSuffix: false,
      allowOverwrite: overwrite,
      // the minimum the service allows; reads use useCache: false anyway
      cacheControlMaxAge: 60,
    });
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
      const page = await this.api.list({ token: this.token, prefix: HISTORY_PREFIX, cursor, limit: 1000 });
      paths.push(...page.blobs.map((b) => b.pathname));
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    const old = paths.sort().reverse().slice(HISTORY_KEEP);
    if (old.length) await this.api.del(old, { token: this.token });
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
    const res = await this.api.put(pathname, bytes, {
      access: 'public',
      token: this.token,
      contentType,
      addRandomSuffix: false,
      allowOverwrite: false,
      cacheControlMaxAge: 31536000,
    });
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
    await this.api.del(url, { token: this.token });
  }

  async hasFile(url: string) {
    if (!this.isOurMedia(url)) return false;
    try {
      await this.api.head(url, { token: this.token });
      return true;
    } catch {
      return false;
    }
  }
}

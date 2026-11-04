// The editor, part 4: the store layer (2026-11-04). BlobContentStore runs against a fake of the
// @vercel/blob functions; the real package is never loaded in tests (helpers/ts-loader.mjs makes
// loading it throw).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { src } from './helpers/load.mjs';
import { jpeg } from './helpers/fixtures.mjs';

const { BlobContentStore } = await src('content/blobStore.ts');
const store = await src('content/store.ts');
const { SEED_CONTENT } = await src('content/seed.ts');
const { createContentStore } = await src('content/createStore.ts');

const BASE = 'https://teszt-tarolo.public.blob.vercel-storage.com/';

/** An in-memory imitation of the @vercel/blob functions BlobContentStore uses. */
function fakeBlob() {
  const files = new Map();
  const calls = [];
  const key = (p) => (p.startsWith(BASE) ? p.slice(BASE.length) : p);
  return {
    files,
    calls,
    api: {
      async put(pathname, body, o) {
        calls.push(['put', pathname, o]);
        assert.equal(o.access, 'public');
        if (files.has(pathname) && !o.allowOverwrite) throw new Error('exists');
        files.set(pathname, typeof body === 'string' ? body : Buffer.from(body));
        return { url: BASE + pathname, pathname };
      },
      async get(pathname, o) {
        calls.push(['get', pathname, o]);
        const f = files.get(key(pathname));
        if (f === undefined) return null;
        return { statusCode: 200, stream: new Response(f).body };
      },
      async list({ prefix = '', cursor }) {
        calls.push(['list', prefix]);
        const all = [...files.keys()].filter((p) => p.startsWith(prefix)).sort();
        const start = cursor ? Number(cursor) : 0;
        const page = all.slice(start, start + 20); // small pages, so paging is exercised
        const more = start + 20 < all.length;
        return { blobs: page.map((p) => ({ url: BASE + p, pathname: p })), hasMore: more, cursor: more ? String(start + 20) : undefined };
      },
      async del(u) {
        calls.push(['del', u]);
        for (const x of [u].flat()) files.delete(key(x));
      },
      async head(u) {
        if (!files.has(key(u))) throw new Error('not found');
        return {};
      },
    },
  };
}

const clock = () => {
  let t = Date.UTC(2026, 10, 4, 9, 0, 0);
  return () => new Date((t += 1000));
};

test('BlobContentStore: content at a fixed path, a history copy per save, newest first', async () => {
  const b = fakeBlob();
  const s = new BlobContentStore(b.api, 'teszt-token', clock());
  assert.equal(await s.read(), null, 'empty store');
  const e1 = await s.write(SEED_CONTENT, 'a@example.org', '+1 hír');
  const e2 = await s.write({ ...SEED_CONTENT, news: SEED_CONTENT.news.slice(1) }, 'b@example.org', '-1 hír');
  assert.ok(b.files.has(store.CONTENT_PATH));
  assert.ok(b.files.has(`${store.HISTORY_PREFIX}${e1.id}.json`) && b.files.has(`${store.HISTORY_PREFIX}${e2.id}.json`));
  assert.match(e1.id, store.HISTORY_ID_RE);
  const now = await s.read();
  assert.equal(now.updatedAt, e2.at);
  assert.equal(now.news.length, SEED_CONTENT.news.length - 1);
  assert.deepEqual((await s.listHistory()).map((h) => [h.editor, h.summary]), [['b@example.org', '-1 hír'], ['a@example.org', '+1 hír']]);
  assert.equal((await s.readHistory(e1.id)).news.length, SEED_CONTENT.news.length);
  assert.equal(await s.readHistory('../content'), null, 'no path tricks');
  for (const [op, , o] of b.calls.filter((c) => c[0] === 'get')) assert.equal(o.useCache, false, op);
});

test('BlobContentStore: keeps the last 50 history copies', async () => {
  const b = fakeBlob();
  const s = new BlobContentStore(b.api, 'teszt-token', clock());
  const entries = [];
  for (let i = 0; i < 55; i++) entries.push(await s.write(SEED_CONTENT, 'a@example.org', `${i}`));
  const kept = [...b.files.keys()].filter((p) => p.startsWith(store.HISTORY_PREFIX));
  assert.equal(kept.length, 50);
  assert.ok(!kept.includes(`${store.HISTORY_PREFIX}${entries[4].id}.json`), 'the oldest are deleted');
  assert.ok(kept.includes(`${store.HISTORY_PREFIX}${entries[5].id}.json`));
  const list = await s.listHistory();
  assert.equal(list.length, 50);
  assert.equal(list[0].summary, '54');
});

test('BlobContentStore: images under media/ with a random name; foreign URLs are never deleted', async () => {
  const b = fakeBlob();
  const s = new BlobContentStore(b.api, 'teszt-token', clock());
  const a = await s.putFile(jpeg(), 'jpg', 'image/jpeg');
  const c = await s.putFile(jpeg(), 'jpg', 'image/jpeg');
  assert.match(a.pathname, /^media\/[A-Za-z0-9_-]{24}\.jpg$/);
  assert.notEqual(a.pathname, c.pathname);
  const put = b.calls.find((x) => x[0] === 'put' && x[1] === a.pathname)[2];
  assert.equal(put.addRandomSuffix, false);
  assert.equal(put.allowOverwrite, false);
  assert.equal(put.contentType, 'image/jpeg');
  assert.equal(await s.hasFile(a.url), true);
  await s.deleteFile(a.url);
  assert.equal(await s.hasFile(a.url), false);
  await assert.rejects(() => s.deleteFile(`${BASE}content/content.json`));
  await assert.rejects(() => s.deleteFile('https://example.org/media/x.jpg'));
});

test('MemoryContentStore: keeps the last 50 too, and can play an unreachable store', async () => {
  const m = new store.MemoryContentStore({ now: clock() });
  for (let i = 0; i < 52; i++) await m.write(SEED_CONTENT, 'a@example.org', `${i}`);
  assert.equal((await m.listHistory()).length, 50);
  const f = new store.MemoryContentStore({ failing: true });
  await assert.rejects(() => f.read());
});

test('no token, no store: @vercel/blob is loaded only when BLOB_READ_WRITE_TOKEN is set', async () => {
  assert.equal(await createContentStore({}), null);
  assert.equal(await createContentStore({ BLOB_READ_WRITE_TOKEN: '  ' }), null);
  // with a token it would load the package, which the test loader forbids: proves the lazy import
  await assert.rejects(() => createContentStore({ BLOB_READ_WRITE_TOKEN: 'x' }), /@vercel\/blob was loaded in a test/);
  const importers = [];
  const walk = (d) => {
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, f.name);
      if (f.isDirectory()) walk(p);
      else if (/\.tsx?$/.test(f.name) && /from ['"]@vercel\/blob['"]/.test(fs.readFileSync(p, 'utf8'))) importers.push(path.relative('.', p));
    }
  };
  walk(path.resolve('src'));
  assert.deepEqual(importers, [path.join('src', 'content', 'blobApi.ts')]);
});

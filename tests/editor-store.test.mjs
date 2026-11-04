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

// Two fake stores, like the two real ones: a PRIVATE store for the content and a PUBLIC one for the
// images. Each has its own token and its own host, and the fake refuses a call that mixes them up.
const CONTENT_TOKEN = 'teszt-tartalom-token';
const MEDIA_TOKEN = 'teszt-kep-token';
const PRIVATE_BASE = 'https://teszt-privat.private.blob.vercel-storage.com/';
const PUBLIC_BASE = 'https://teszt-tarolo.public.blob.vercel-storage.com/';

/** An in-memory imitation of the @vercel/blob functions BlobContentStore uses. `contentStoreIs` / `mediaStoreIs` model a token that belongs to the WRONG kind of store (a misconfiguration). */
function fakeBlob({ contentStoreIs = 'private', mediaStoreIs = 'public' } = {}) {
  const stores = { private: new Map(), public: new Map() };
  const calls = [];
  const bases = { private: PRIVATE_BASE, public: PUBLIC_BASE };
  const tokenKind = (t) => (t === CONTENT_TOKEN ? contentStoreIs : t === MEDIA_TOKEN ? mediaStoreIs : null);
  const wanted = (t) => (t === CONTENT_TOKEN ? 'private' : 'public');
  return {
    stores,
    calls,
    api: {
      async put(pathname, body, o) {
        calls.push(['put', pathname, o]);
        const kind = tokenKind(o.token);
        assert.ok(kind, 'a known token');
        assert.equal(o.access, wanted(o.token), 'the call asks for the access its token is meant for');
        const m = stores[kind];
        if (m.has(pathname) && !o.allowOverwrite) throw new Error('exists');
        m.set(pathname, typeof body === 'string' ? body : Buffer.from(body));
        return { url: bases[kind] + pathname, pathname };
      },
      async get(pathname, o) {
        calls.push(['get', pathname, o]);
        const kind = tokenKind(o.token);
        assert.equal(o.access, wanted(o.token), 'read with the access its token is meant for');
        const f = stores[kind].get(pathname.startsWith(bases[kind]) ? pathname.slice(bases[kind].length) : pathname);
        if (f === undefined) return null;
        return { statusCode: 200, stream: new Response(f).body };
      },
      async list({ token, prefix = '', cursor }) {
        calls.push(['list', prefix, token]);
        const kind = tokenKind(token);
        const keys = [...stores[kind].keys()].filter((p) => p.startsWith(prefix)).sort();
        const start = cursor ? Number(cursor) : 0;
        const page = keys.slice(start, start + 20); // small pages, so paging is exercised
        const more = start + 20 < keys.length;
        return { blobs: page.map((p) => ({ url: bases[kind] + p, pathname: p })), hasMore: more, cursor: more ? String(start + 20) : undefined };
      },
      async del(u, { token }) {
        calls.push(['del', u, token]);
        const kind = tokenKind(token);
        for (const x of [u].flat()) {
          const key = x.startsWith(bases[kind]) ? x.slice(bases[kind].length) : x;
          stores[kind].delete(key);
        }
      },
      async head(u, { token }) {
        calls.push(['head', u, token]);
        const kind = tokenKind(token);
        const key = u.startsWith(bases[kind]) ? u.slice(bases[kind].length) : u;
        if (!stores[kind].has(key)) throw new Error('not found');
        return {};
      },
    },
  };
}

const TOKENS = { content: CONTENT_TOKEN, media: MEDIA_TOKEN };

const clock = () => {
  let t = Date.UTC(2026, 10, 4, 9, 0, 0);
  return () => new Date((t += 1000));
};

test('BlobContentStore: content at a fixed path in the PRIVATE store, a history copy per save, newest first', async () => {
  const b = fakeBlob();
  const s = new BlobContentStore(b.api, TOKENS, clock());
  assert.equal(await s.read(), null, 'empty store');
  const e1 = await s.write(SEED_CONTENT, 'a@example.org', '+1 hír');
  const e2 = await s.write({ ...SEED_CONTENT, news: SEED_CONTENT.news.slice(1) }, 'b@example.org', '-1 hír');
  assert.ok(b.stores.private.has(store.CONTENT_PATH));
  assert.ok(b.stores.private.has(`${store.HISTORY_PREFIX}${e1.id}.json`) && b.stores.private.has(`${store.HISTORY_PREFIX}${e2.id}.json`));
  assert.match(e1.id, store.HISTORY_ID_RE);
  const now = await s.read();
  assert.equal(now.updatedAt, e2.at);
  assert.equal(now.news.length, SEED_CONTENT.news.length - 1);
  assert.deepEqual((await s.listHistory()).map((h) => [h.editor, h.summary]), [['b@example.org', '-1 hír'], ['a@example.org', '+1 hír']]);
  assert.equal((await s.readHistory(e1.id)).news.length, SEED_CONTENT.news.length);
  assert.equal(await s.readHistory('../content'), null, 'no path tricks');
  for (const [, , o] of b.calls.filter((c) => c[0] === 'get')) assert.equal(o.useCache, false);
});

test('BlobContentStore: nothing of the content ever touches the public store, and no content call uses the image token', async () => {
  const b = fakeBlob();
  const s = new BlobContentStore(b.api, TOKENS, clock());
  await s.write(SEED_CONTENT, 'a@example.org', 'x');
  await s.read();
  await s.listHistory();
  assert.equal(b.stores.public.size, 0, 'the public store holds no content, no history, no editor address');
  for (const c of b.calls) {
    const o = c[0] === 'put' || c[0] === 'get' ? c[2] : null;
    if (o) assert.equal(o.access, 'private', c[0]);
    const token = o ? o.token : c[0] === 'list' ? c[2] : c[2];
    assert.equal(token, CONTENT_TOKEN, `${c[0]} uses the content token`);
  }
  // the editors' addresses are in the private files only
  assert.ok([...b.stores.private.values()].some((v) => String(v).includes('a@example.org')));
});

test('BlobContentStore: keeps the last 50 history copies', async () => {
  const b = fakeBlob();
  const s = new BlobContentStore(b.api, TOKENS, clock());
  const entries = [];
  for (let i = 0; i < 55; i++) entries.push(await s.write(SEED_CONTENT, 'a@example.org', `${i}`));
  const kept = [...b.stores.private.keys()].filter((p) => p.startsWith(store.HISTORY_PREFIX));
  assert.equal(kept.length, 50);
  assert.ok(!kept.includes(`${store.HISTORY_PREFIX}${entries[4].id}.json`), 'the oldest are deleted');
  assert.ok(kept.includes(`${store.HISTORY_PREFIX}${entries[5].id}.json`));
  const list = await s.listHistory();
  assert.equal(list.length, 50);
  assert.equal(list[0].summary, '54');
});

test('BlobContentStore: images go to the PUBLIC store under media/ with a random name; foreign URLs are never deleted', async () => {
  const b = fakeBlob();
  const s = new BlobContentStore(b.api, TOKENS, clock());
  const a = await s.putFile(jpeg(), 'jpg', 'image/jpeg');
  const c = await s.putFile(jpeg(), 'jpg', 'image/jpeg');
  assert.match(a.pathname, /^media\/[A-Za-z0-9_-]{24}\.jpg$/);
  assert.notEqual(a.pathname, c.pathname);
  assert.ok(a.url.startsWith(PUBLIC_BASE), 'a public URL, the page can show it');
  assert.ok(b.stores.public.has(a.pathname) && !b.stores.private.has(a.pathname));
  const put = b.calls.find((x) => x[0] === 'put' && x[1] === a.pathname)[2];
  assert.equal(put.access, 'public');
  assert.equal(put.token, MEDIA_TOKEN);
  assert.equal(put.addRandomSuffix, false);
  assert.equal(put.allowOverwrite, false);
  assert.equal(put.contentType, 'image/jpeg');
  assert.equal(await s.hasFile(a.url), true);
  await s.deleteFile(a.url);
  assert.equal(await s.hasFile(a.url), false);
  await assert.rejects(() => s.deleteFile(`${PUBLIC_BASE}content/content.json`));
  await assert.rejects(() => s.deleteFile(`${PRIVATE_BASE}media/x.jpg`));
  await assert.rejects(() => s.deleteFile('https://example.org/media/x.jpg'));
});

test('fail closed: a content token that points at a PUBLIC store never leaves the content published', async () => {
  const b = fakeBlob({ contentStoreIs: 'public' }); // the content token belongs to a public store
  const s = new BlobContentStore(b.api, TOKENS, clock());
  await assert.rejects(() => s.write(SEED_CONTENT, 'a@example.org', 'x'), /not private/);
  assert.equal(b.stores.public.size, 0, 'the file was taken out again');
  assert.ok(b.calls.some((c) => c[0] === 'del' && c[2] === CONTENT_TOKEN), 'deleted with the content token');
  assert.equal(await s.read(), null);
});

test('fail closed: an image that did not land on the public store is deleted and refused', async () => {
  const b = fakeBlob({ mediaStoreIs: 'private' }); // the image token belongs to a private store
  const s = new BlobContentStore(b.api, TOKENS, clock());
  await assert.rejects(() => s.putFile(jpeg(), 'jpg', 'image/jpeg'), /not public/);
  assert.equal(b.stores.private.size, 0);
});

test('without the image token the content works and uploads are refused', async () => {
  const b = fakeBlob();
  const s = new BlobContentStore(b.api, { content: CONTENT_TOKEN }, clock());
  await s.write(SEED_CONTENT, 'a@example.org', 'x');
  assert.ok(await s.read());
  await assert.rejects(() => s.putFile(jpeg(), 'jpg', 'image/jpeg'), /not configured/);
  assert.equal(await s.hasFile(`${PUBLIC_BASE}media/abcdefghijklmnopqrstuvwx.jpg`), false);
  assert.equal(b.stores.public.size, 0);
});

test('MemoryContentStore: keeps the last 50 too, and can play an unreachable store', async () => {
  const m = new store.MemoryContentStore({ now: clock() });
  for (let i = 0; i < 52; i++) await m.write(SEED_CONTENT, 'a@example.org', `${i}`);
  assert.equal((await m.listHistory()).length, 50);
  const f = new store.MemoryContentStore({ failing: true });
  await assert.rejects(() => f.read());
});

test('no content token, no store: @vercel/blob is loaded only when BLOB_CONTENT_READ_WRITE_TOKEN is set', async () => {
  assert.equal(await createContentStore({}), null);
  assert.equal(await createContentStore({ BLOB_CONTENT_READ_WRITE_TOKEN: '  ' }), null);
  assert.equal(await createContentStore({ BLOB_READ_WRITE_TOKEN: 'x' }), null, 'the image token alone is not a content store');
  // with a content token it would load the package, which the test loader forbids: proves the lazy import
  await assert.rejects(() => createContentStore({ BLOB_CONTENT_READ_WRITE_TOKEN: 'x' }), /@vercel\/blob was loaded in a test/);
  await assert.rejects(() => createContentStore({ BLOB_CONTENT_READ_WRITE_TOKEN: 'x', BLOB_READ_WRITE_TOKEN: 'y' }), /@vercel\/blob was loaded in a test/);
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

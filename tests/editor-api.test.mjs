// The editor, part 5: the API routes (src/lib/editorApi.ts) with every outside service faked:
// MemoryContentStore for Vercel Blob, a recording fetch for Resend (2026-11-04).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { src } from './helpers/load.mjs';
import { EDITOR, NOTIFY_TO, NOW, SITE, STRANGER, fakeMailer, imageFor, jpeg, makeEnv, png, webp } from './helpers/fixtures.mjs';

const api = await src('lib/editorApi.ts');
const auth = await src('lib/editorAuth.ts');
const { MemoryContentStore } = await src('content/store.ts');
const { SEED_CONTENT, SEED_NEWS } = await src('content/seed.ts');

function setup({ mail = 'ok', env = {}, store } = {}) {
  const mailer = fakeMailer(mail);
  const logs = [];
  const deferred = [];
  let clock = NOW;
  const deps = {
    env: makeEnv(env),
    store: store === undefined ? new MemoryContentStore({ now: () => new Date((clock += 1000)) }) : store,
    fetchFn: mailer.fn,
    now: () => new Date(clock),
    limiters: api.createEditorLimiters(),
    usedTokens: new Map(),
    revalidated: 0,
    revalidate() { this.revalidated++; },
    defer: (task) => deferred.push(task()),
    log: (m) => logs.push(m),
  };
  deps.revalidate = deps.revalidate.bind(deps);
  const settle = () => Promise.all(deferred.splice(0));
  const cookie = () => `${auth.SESSION_COOKIE}=${auth.createSessionValue(EDITOR, deps.env.EDITOR_SESSION_SECRET, clock)}`;
  return { deps, mailer, logs, settle, cookie };
}

// the editor sets this header only after the child photo declaration box is ticked
const DECL = { 'x-child-photo-declaration': '1' };

function req(route, { method = 'POST', body, cookie, origin = SITE, ip = '203.0.113.7', type = 'application/json', headers = {} } = {}) {
  const h = { host: new URL(SITE).host, 'x-forwarded-for': ip, ...headers };
  if (origin) h.origin = origin;
  if (cookie) h.cookie = cookie;
  if (body !== undefined) h['content-type'] = type;
  const payload = body === undefined ? undefined : body instanceof Uint8Array ? body : JSON.stringify(body);
  return new Request(`${SITE}/api/szerkeszto/${route}`, { method, headers: h, body: payload });
}
const read = async (res) => ({ status: res.status, body: await res.json(), cookie: res.headers.get('set-cookie') });

// ---------------------------------------------------------------- login

test('login: the same answer for an allowed and an unknown address; mail only to the allowed one', async () => {
  const { deps, mailer, settle } = setup();
  const a = await read(await api.handleLogin(req('login', { body: { email: EDITOR } }), deps));
  const b = await read(await api.handleLogin(req('login', { body: { email: STRANGER }, ip: '203.0.113.8' }), deps));
  await settle();
  assert.deepEqual(a, b, 'identical status, body and headers');
  assert.equal(a.status, 200);
  assert.equal(mailer.mails.length, 1);
  assert.deepEqual(mailer.mails[0].body.to, [EDITOR]);
  const link = mailer.mails[0].body.text.match(/https:\/\/\S+/)[0];
  assert.ok(link.startsWith(`${SITE}/szerkeszto/belepes#t=`), 'the token is in the fragment, never sent to the server by the link');
  assert.equal(mailer.mails[0].body.html, undefined, 'plain text');
});

test('login: the link page posts the token once and gets a 12-hour session cookie', async () => {
  const { deps, mailer, settle } = setup();
  await api.handleLogin(req('login', { body: { email: EDITOR } }), deps);
  await settle();
  const token = mailer.mails[0].body.text.match(/#t=(\S+)/)[1];
  const r = await read(await api.handleRedeem(req('belepes', { body: { token } }), deps));
  assert.equal(r.status, 200);
  assert.match(r.cookie, /HttpOnly; Secure; SameSite=Lax; Max-Age=43200/);
  const value = r.cookie.split(';')[0].split('=')[1];
  assert.equal(auth.verifySessionValue(value, deps.env.EDITOR_SESSION_SECRET, NOW, auth.parseAllowList(deps.env.EDITOR_EMAILS)), EDITOR);
  const again = await read(await api.handleRedeem(req('belepes', { body: { token } }), deps));
  assert.equal(again.status, 400, 'a used link does not work again');
  const forged = await read(await api.handleRedeem(req('belepes', { body: { token: `${token.split('.')[0]}.x` } }), deps));
  assert.equal(forged.status, 400);
  assert.equal(forged.cookie, null);
});

test('login: rate limits per address (3 mails per hour) and per IP (5 per 10 minutes)', async () => {
  const { deps, mailer, settle } = setup();
  for (let i = 0; i < 5; i++) {
    const r = await api.handleLogin(req('login', { body: { email: EDITOR }, ip: `198.51.100.${i}` }), deps);
    assert.equal(r.status, 200, 'still the same answer');
  }
  await settle();
  assert.equal(mailer.mails.length, 3, 'only 3 mails to one address');
  const { deps: d2 } = setup();
  const statuses = [];
  for (let i = 0; i < 6; i++) statuses.push((await api.handleLogin(req('login', { body: { email: `x${i}@example.org` } }), d2)).status);
  assert.deepEqual(statuses, [200, 200, 200, 200, 200, 429]);
});

test('login: disabled (503) without a usable secret or without mail; invalid address 400', async () => {
  const short = setup({ env: { EDITOR_SESSION_SECRET: 'x'.repeat(31) } });
  assert.equal((await api.handleLogin(req('login', { body: { email: EDITOR } }), short.deps)).status, 503);
  assert.equal((await api.handleRedeem(req('belepes', { body: { token: 'a.b' } }), short.deps)).status, 503);
  const nomail = setup({ env: { RESEND_API_KEY: '' } });
  assert.equal((await api.handleLogin(req('login', { body: { email: EDITOR } }), nomail.deps)).status, 503);
  const { deps } = setup();
  assert.equal((await api.handleLogin(req('login', { body: { email: 'nem-cim' } }), deps)).status, 400);
});

test('a failed login mail is logged without the address and does not change the answer', async () => {
  const { deps, logs, settle } = setup({ mail: 'throw' });
  const r = await api.handleLogin(req('login', { body: { email: EDITOR } }), deps);
  await settle();
  assert.equal(r.status, 200);
  assert.ok(logs.length > 0 && logs.every((l) => !l.includes('@')), JSON.stringify(logs));
});

// ---------------------------------------------------------------- session and origin

test('every route that changes something answers 401 without a session', async () => {
  const { deps } = setup();
  const routes = [
    () => api.handleContentPut(req('tartalom', { method: 'PUT', body: { base: null, content: SEED_CONTENT } }), deps),
    () => api.handleUpload(req('feltoltes', { body: jpeg(), type: 'image/jpeg' }), deps),
    () => api.handleLogout(req('kilepes'), deps),
    () => api.handleContentGet(req('tartalom', { method: 'GET', origin: null }), deps),
  ];
  for (const r of routes) assert.equal((await r()).status, 401);
  // an expired or forged session is no session either
  const old = `${auth.SESSION_COOKIE}=${auth.createSessionValue(EDITOR, deps.env.EDITOR_SESSION_SECRET, NOW - 13 * 3600_000)}`;
  assert.equal((await api.handleContentPut(req('tartalom', { method: 'PUT', cookie: old, body: { base: null, content: SEED_CONTENT } }), deps)).status, 401);
  assert.equal(deps.store.content, null, 'nothing written');
});

test('the Origin check: a changing request from another site or without Origin is refused', async () => {
  const { deps, cookie } = setup();
  for (const origin of ['https://evil.example', null, 'http://pontmas.example.org']) {
    const put = await api.handleContentPut(req('tartalom', { method: 'PUT', origin, cookie: cookie(), body: { base: null, content: SEED_CONTENT } }), deps);
    assert.equal(put.status, 403, String(origin));
    assert.equal((await api.handleUpload(req('feltoltes', { origin, cookie: cookie(), body: jpeg(), type: 'image/jpeg' }), deps)).status, 403);
    assert.equal((await api.handleLogin(req('login', { origin, body: { email: EDITOR } }), deps)).status, 403);
    assert.equal((await api.handleRedeem(req('belepes', { origin, body: { token: 'a.b' } }), deps)).status, 403);
    assert.equal((await api.handleLogout(req('kilepes', { origin, cookie: cookie() }), deps)).status, 403);
  }
  assert.equal(deps.store.content, null);
});

// ---------------------------------------------------------------- content

test('save: writes, revalidates, notifies with who, what and when', async () => {
  const { deps, mailer, settle, cookie } = setup();
  const g = await read(await api.handleContentGet(req('tartalom', { method: 'GET', cookie: cookie() }), deps));
  assert.equal(g.status, 200);
  assert.deepEqual(g.body.content, SEED_CONTENT, 'an empty store starts from the seed');
  const added = { ...SEED_NEWS[1], id: 'uj-hir', title: 'Új hír a szerkesztőből' };
  const r = await read(await api.handleContentPut(req('tartalom', { method: 'PUT', cookie: cookie(), body: { base: g.body.base, content: { ...SEED_CONTENT, news: [added, ...SEED_NEWS] } } }), deps));
  await settle();
  assert.equal(r.status, 200, JSON.stringify(r.body));
  assert.equal(r.body.summary, '+1 hír');
  assert.equal(deps.store.content.news[0].title, 'Új hír a szerkesztőből');
  assert.equal(deps.revalidated, 1);
  assert.equal(mailer.mails.length, 1);
  const m = mailer.mails[0].body;
  assert.deepEqual(m.to, [NOTIFY_TO]);
  assert.ok(m.text.includes(`Ki: ${EDITOR}`) && m.text.includes('Mi: +1 hír') && m.text.includes('Mikor: 2026.'), m.text);
  assert.equal(r.body.history[0].editor, EDITOR);
});

test('a failed notification does not fail the save, and the log has no address', async () => {
  for (const mode of ['throw', 'error']) {
    const { deps, logs, settle, cookie } = setup({ mail: mode });
    const r = await api.handleContentPut(req('tartalom', { method: 'PUT', cookie: cookie(), body: { base: null, content: SEED_CONTENT } }), deps);
    await settle();
    assert.equal(r.status, 200, mode);
    assert.ok(deps.store.content);
    assert.ok(logs.length > 0 && logs.every((l) => !l.includes('@')), JSON.stringify(logs));
  }
});

test('a rejected save changes nothing; the editor cannot write a protected key', async () => {
  const { deps, cookie, mailer, settle } = setup();
  await api.handleContentPut(req('tartalom', { method: 'PUT', cookie: cookie(), body: { base: null, content: SEED_CONTENT } }), deps);
  await settle();
  const before = JSON.stringify(deps.store.content);
  const base = deps.store.content.updatedAt;
  const historyBefore = deps.store.history.length;
  const attempts = [
    { ...SEED_CONTENT, bankAccount: '11600006-00000000-00000000' },
    { ...SEED_CONTENT, taxNumber: '12345678-1-12' },
    { ...SEED_CONTENT, news: [{ ...SEED_NEWS[0], phone: '+36 1 234 5678' }] },
    { ...SEED_CONTENT, news: [{ ...SEED_NEWS[0], address: 'Valahol 1.' }] },
    { ...SEED_CONTENT, programs: [{ ...SEED_CONTENT.programs[0], registrationNumber: '1' }] },
    { ...SEED_CONTENT, news: [{ ...SEED_NEWS[0], title: 'x'.repeat(161) }] },
    { ...SEED_CONTENT, news: [{ ...SEED_NEWS[0], actionHref: 'javascript:alert(1)' }] },
  ];
  for (const content of attempts) {
    const r = await read(await api.handleContentPut(req('tartalom', { method: 'PUT', cookie: cookie(), body: { base, content } }), deps));
    assert.equal(r.status, 400);
    assert.ok(r.body.errors.length > 0);
  }
  await settle();
  assert.equal(JSON.stringify(deps.store.content), before, 'content unchanged');
  assert.equal(deps.store.history.length, historyBefore, 'no new version');
  assert.equal(mailer.mails.length, 1, 'no notification for a rejected save');
});

test('two editors: a save on stale content is refused (409), nothing is overwritten', async () => {
  const { deps, cookie } = setup();
  await api.handleContentPut(req('tartalom', { method: 'PUT', cookie: cookie(), body: { base: null, content: SEED_CONTENT } }), deps);
  const before = JSON.stringify(deps.store.content);
  const r = await api.handleContentPut(req('tartalom', { method: 'PUT', cookie: cookie(), body: { base: null, content: { ...SEED_CONTENT, news: [] } } }), deps);
  assert.equal(r.status, 409);
  assert.equal(JSON.stringify(deps.store.content), before);
});

test('an unreachable store: the editor gets an error, never the seed to overwrite with', async () => {
  const { deps, cookie } = setup({ store: new MemoryContentStore({ failing: true }) });
  assert.equal((await api.handleContentGet(req('tartalom', { method: 'GET', cookie: cookie() }), deps)).status, 502);
  assert.equal((await api.handleContentPut(req('tartalom', { method: 'PUT', cookie: cookie(), body: { base: null, content: SEED_CONTENT } }), deps)).status, 502);
  const none = setup({ store: null });
  assert.equal((await api.handleContentPut(req('tartalom', { method: 'PUT', cookie: none.cookie(), body: { base: null, content: SEED_CONTENT } }), none.deps)).status, 503);
});

test('the declaration is stamped by the server with the logged-in editor and the time', async () => {
  const { deps, cookie } = setup();
  const img = imageFor(deps.store);
  const forged = { ...img, childPhotoDeclaration: { declaredBy: 'valaki.mas@example.org', at: '2020-01-01T00:00:00.000Z' } };
  const content = { ...SEED_CONTENT, news: [{ ...SEED_NEWS[0], image: forged }, ...SEED_NEWS.slice(1)] };
  const r = await read(await api.handleContentPut(req('tartalom', { method: 'PUT', cookie: cookie(), body: { base: null, content } }), deps));
  assert.equal(r.status, 200);
  const d = deps.store.content.news[0].image.childPhotoDeclaration;
  assert.equal(d.declaredBy, EDITOR);
  assert.equal(d.at, new Date(NOW).toISOString());
});

test('history: a restore is a new save, and a photo removed since is not brought back', async () => {
  const { deps, cookie, settle } = setup();
  const img = imageFor(deps.store);
  const v1 = { ...SEED_CONTENT, news: [{ ...SEED_NEWS[0], image: img }, ...SEED_NEWS.slice(1)] };
  let r = await read(await api.handleContentPut(req('tartalom', { method: 'PUT', cookie: cookie(), body: { base: null, content: v1 } }), deps));
  const first = r.body.history[0];
  r = await read(await api.handleContentPut(req('tartalom', { method: 'PUT', cookie: cookie(), body: { base: r.body.base, content: { ...SEED_CONTENT, news: SEED_NEWS.slice(1) } } }), deps));
  assert.equal(r.status, 200);
  assert.equal(deps.store.files.has(img.url), false, 'the removed photo was deleted from the store');
  r = await read(await api.handleContentPut(req('tartalom', { method: 'PUT', cookie: cookie(), body: { base: r.body.base, restore: first.id } }), deps));
  await settle();
  assert.equal(r.status, 200, JSON.stringify(r.body));
  assert.equal(deps.store.history.length, 3, 'restore wrote a new version');
  assert.match(r.body.history[0].summary, /^Visszaállítás: /);
  assert.equal(deps.store.content.news.length, SEED_NEWS.length);
  assert.equal(deps.store.content.news[0].image, undefined, 'the deleted photo is not restored');
  const missing = await api.handleContentPut(req('tartalom', { method: 'PUT', cookie: cookie(), body: { base: r.body.base, restore: '2020-01-01T00-00-00-000Z-abcdef' } }), deps);
  assert.equal(missing.status, 404);
});

// ---------------------------------------------------------------- upload

test('upload: JPEG, PNG and WebP by their first bytes, random name under media/, notification with the link', async () => {
  const { deps, cookie, mailer, settle } = setup();
  for (const [bytes, ext] of [[jpeg({ width: 1600, height: 1200 }), 'jpg'], [png(), 'png'], [webp(), 'webp']]) {
    const r = await read(await api.handleUpload(req('feltoltes', { cookie: cookie(), body: bytes, type: 'application/octet-stream', headers: DECL }), deps));
    assert.equal(r.status, 200, ext);
    assert.match(r.body.url, new RegExp(`/media/[A-Za-z0-9_-]{24}\\.${ext}$`));
    assert.ok(r.body.width > 0 && r.body.height > 0);
  }
  await settle();
  assert.equal(mailer.mails.length, 3);
  assert.ok(mailer.mails[0].body.text.includes('Kép: https://'), 'the image link is in the mail');
});

test('upload: a text file named .jpg is refused; so are a 6 MB file, a too large picture and EXIF/GPS data', async () => {
  const { deps, cookie } = setup();
  const up = (body, headers = {}) => api.handleUpload(req('feltoltes', { cookie: cookie(), body, type: 'image/jpeg', headers: { ...DECL, ...headers } }), deps);
  const text = new TextEncoder().encode('Ez nem kép, csak egy szöveg.');
  assert.equal((await up(text, { 'x-file-name': 'foto.jpg' })).status, 415);
  assert.equal((await up(jpeg({ pad: 6 * 1024 * 1024 }))).status, 413);
  assert.equal((await up(jpeg(), { 'content-length': String(6 * 1024 * 1024) })).status, 413, 'refused by the length header before reading');
  assert.equal((await read(await up(jpeg({ width: 3000, height: 2000 })))).body.error, 'too_big_dimensions');
  assert.equal((await read(await up(jpeg({ exif: true })))).body.error, 'has_metadata');
  assert.equal((await read(await up(png({ exif: true })))).body.error, 'has_metadata');
  assert.equal(deps.store.files.size, 0, 'nothing stored');
});

test('upload without the child photo declaration: refused, nothing stored, no mail', async () => {
  const { deps, cookie, mailer, settle } = setup();
  for (const headers of [{}, { 'x-child-photo-declaration': '' }, { 'x-child-photo-declaration': '0' }, { 'x-child-photo-declaration': 'true' }, { 'x-child-photo-declaration': 'yes' }]) {
    const r = await read(await api.handleUpload(req('feltoltes', { cookie: cookie(), body: jpeg(), type: 'image/jpeg', headers }), deps));
    assert.equal(r.status, 400, JSON.stringify(headers));
    assert.equal(r.body.error, 'declaration_required');
  }
  await settle();
  assert.equal(deps.store.files.size, 0, 'no file reached the store');
  assert.equal(mailer.mails.length, 0, 'no notification');
  // and the same picture WITH the declaration goes through
  const ok = await read(await api.handleUpload(req('feltoltes', { cookie: cookie(), body: jpeg(), type: 'image/jpeg', headers: DECL }), deps));
  assert.equal(ok.status, 200);
  assert.equal(deps.store.files.size, 1);
});

test('save: an image without the declaration is refused and nothing is written', async () => {
  const { deps, cookie, mailer, settle } = setup();
  const undeclared = imageFor(deps.store, { declared: false });
  const content = { ...SEED_CONTENT, news: [{ ...SEED_NEWS[0], image: undeclared }, ...SEED_NEWS.slice(1)] };
  const r = await read(await api.handleContentPut(req('tartalom', { method: 'PUT', cookie: cookie(), body: { base: null, content } }), deps));
  await settle();
  assert.equal(r.status, 400);
  assert.ok(r.body.errors.some((e) => e.path.endsWith('image.childPhotoDeclaration')), JSON.stringify(r.body.errors));
  assert.equal(deps.store.content, null, 'nothing stored');
  assert.equal(deps.store.history.length, 0);
  assert.equal(deps.revalidated, 0);
  assert.equal(mailer.mails.length, 0);
  // the declared one is accepted, and stamped by the server
  const declared = { ...undeclared, childPhotoDeclaration: { declaredBy: 'x@example.org', at: '2020-01-01T00:00:00.000Z' } };
  const ok = await read(await api.handleContentPut(req('tartalom', { method: 'PUT', cookie: cookie(), body: { base: null, content: { ...content, news: [{ ...SEED_NEWS[0], image: declared }, ...SEED_NEWS.slice(1)] } } }), deps));
  assert.equal(ok.status, 200, JSON.stringify(ok.body));
  assert.equal(deps.store.content.news[0].image.childPhotoDeclaration.declaredBy, EDITOR);
});

test('restore: a stored version that holds an undeclared image is refused, nothing new is written', async () => {
  const { deps, cookie } = setup();
  const old = { ...SEED_CONTENT, updatedAt: '2026-11-04T08:00:00.000Z', news: [{ ...SEED_NEWS[0], image: imageFor(deps.store, { declared: false }) }, ...SEED_NEWS.slice(1)] };
  const entry = await deps.store.write(old, 'regi@example.org', 'regi verzio'); // written straight to the store, bypassing the API
  const before = JSON.stringify(deps.store.content);
  const r = await read(await api.handleContentPut(req('tartalom', { method: 'PUT', cookie: cookie(), body: { base: deps.store.content.updatedAt, restore: entry.id } }), deps));
  assert.equal(r.status, 400);
  assert.equal(JSON.stringify(deps.store.content), before);
});

test('the editor sends the declaration header only from the ticked state, and the route files only wire the handlers to the real services', () => {
  const ui = fs.readFileSync(path.resolve('src/components/editor/EditorApp.tsx'), 'utf8');
  assert.ok(ui.includes("[DECLARATION_HEADER]: '1'"), 'the upload sends the header');
  assert.match(ui, /disabled=\{uploading \|\| !ticked/, 'the file input is locked until the box is ticked');
  assert.match(ui, /if \(!ticked\) \{\s+onMessage\(\{ kind: 'error', text: ERROR_TEXT\.declaration_required \}\);\s+return;/, 'and onFile itself refuses without the tick');
  assert.ok(!ui.includes('piszkozatként'), 'no draft image state is left in the list');
  const types = fs.readFileSync(path.resolve('src/content/types.ts'), 'utf8');
  assert.ok(types.includes("DECLARATION_HEADER = 'x-child-photo-declaration'"), 'the header name the tests send');
  for (const r of ['login', 'belepes', 'kilepes', 'tartalom', 'feltoltes']) {
    const s = fs.readFileSync(path.resolve(`src/app/api/szerkeszto/${r}/route.ts`), 'utf8');
    assert.match(s, /return handle\w+\(request, await editorDeps\(\)\);/, r);
  }
  const server = fs.readFileSync(path.resolve('src/lib/editorServer.ts'), 'utf8');
  for (const name of ['EDITOR_EMAILS', 'EDITOR_SESSION_SECRET', 'EDITOR_NOTIFY_TO', 'RESEND_API_KEY', 'CONTACT_FROM', 'BLOB_CONTENT_READ_WRITE_TOKEN', 'BLOB_READ_WRITE_TOKEN']) assert.ok(server.includes(`env.${name}`), name);
  assert.match(server, /revalidateTag\(CONTENT_TAG/);
});

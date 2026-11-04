// The editor, part 3: login by e-mail link (2026-11-04). The token and the session are
// HMAC-SHA256 with a secret generated here at runtime.
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { src } from './helpers/load.mjs';
import { EDITOR, NOW, OTHER_EDITOR, STRANGER } from './helpers/fixtures.mjs';

const auth = await src('lib/editorAuth.ts');
const SECRET = randomBytes(32).toString('hex');
const LIST = auth.parseAllowList(`${EDITOR}, ${OTHER_EDITOR}`);

test('allow-list: commas, semicolons, spaces and case; invalid entries dropped', () => {
  assert.deepEqual(auth.parseAllowList(` ${EDITOR.toUpperCase()} ;${OTHER_EDITOR}\n nem-cim , ${EDITOR}`), [EDITOR, OTHER_EDITOR]);
  assert.deepEqual(auth.parseAllowList(undefined), []);
  assert.deepEqual(auth.parseAllowList(''), []);
  assert.ok(auth.isAllowed(` ${EDITOR.toUpperCase()} `, LIST));
  assert.equal(auth.isAllowed(STRANGER, LIST), false);
  assert.equal(auth.isAllowed('', LIST), false);
});

test('login token: valid for 15 minutes for the address it was issued to', () => {
  const t = auth.createLoginToken(EDITOR, SECRET, NOW);
  assert.equal(auth.verifyLoginToken(t, SECRET, NOW, LIST), EDITOR);
  assert.equal(auth.verifyLoginToken(t, SECRET, NOW + 15 * 60_000 - 1, LIST), EDITOR);
});

test('login token: expired, wrong secret, tampered or wrong address is refused', () => {
  const t = auth.createLoginToken(EDITOR, SECRET, NOW);
  assert.equal(auth.verifyLoginToken(t, SECRET, NOW + 15 * 60_000, LIST), null, 'expired');
  assert.equal(auth.verifyLoginToken(t, randomBytes(32).toString('hex'), NOW, LIST), null, 'wrong secret');
  const [body, sig] = t.split('.');
  const forged = Buffer.from(JSON.stringify({ p: 'login', e: OTHER_EDITOR, x: NOW + 60_000 })).toString('base64url');
  assert.equal(auth.verifyLoginToken(`${forged}.${sig}`, SECRET, NOW, LIST), null, 'tampered payload');
  assert.equal(auth.verifyLoginToken(`${body}.${sig.slice(0, -2)}AA`, SECRET, NOW, LIST), null, 'tampered signature');
  assert.equal(auth.verifyLoginToken(`${body}.`, SECRET, NOW, LIST), null, 'no signature');
  assert.equal(auth.verifyLoginToken(auth.createLoginToken(STRANGER, SECRET, NOW), SECRET, NOW, LIST), null, 'address not on the list');
  assert.equal(auth.verifyLoginToken(t, SECRET, NOW, [OTHER_EDITOR]), null, 'address removed from the list since');
  assert.equal(auth.verifyLoginToken(42, SECRET, NOW, LIST), null);
});

test('a login token is not a session and a session is not a login token', () => {
  const login = auth.createLoginToken(EDITOR, SECRET, NOW);
  const session = auth.createSessionValue(EDITOR, SECRET, NOW);
  assert.equal(auth.verifySessionValue(login, SECRET, NOW, LIST), null);
  assert.equal(auth.verifyLoginToken(session, SECRET, NOW, LIST), null);
});

test('session: 12 hours, HttpOnly, Secure, SameSite=Lax', () => {
  const v = auth.createSessionValue(EDITOR, SECRET, NOW);
  assert.equal(auth.verifySessionValue(v, SECRET, NOW + 12 * 3600_000 - 1, LIST), EDITOR);
  assert.equal(auth.verifySessionValue(v, SECRET, NOW + 12 * 3600_000, LIST), null);
  const c = auth.sessionCookie(v);
  assert.match(c, new RegExp(`^${auth.SESSION_COOKIE}=${v.replace(/[.]/g, '\\.')}; `));
  for (const flag of ['HttpOnly', 'Secure', 'SameSite=Lax', 'Max-Age=43200', 'Path=/']) assert.ok(c.split('; ').includes(flag), flag);
  assert.ok(auth.clearSessionCookie().includes('Max-Age=0'));
  const env = { EDITOR_SESSION_SECRET: SECRET, EDITOR_EMAILS: EDITOR };
  assert.equal(auth.sessionFromCookieHeader(`a=1; ${auth.SESSION_COOKIE}=${v}; b=2`, env, NOW), EDITOR);
  assert.equal(auth.sessionFromCookieHeader('a=1', env, NOW), null);
});

test('a secret shorter than 32 characters switches the login off', () => {
  const short = randomBytes(15).toString('hex'); // 30 characters
  assert.equal(auth.secretUsable(short), false);
  assert.equal(auth.secretUsable(undefined), false);
  assert.throws(() => auth.createLoginToken(EDITOR, short, NOW));
  const t = auth.createLoginToken(EDITOR, SECRET, NOW);
  assert.equal(auth.verifyLoginToken(t, short, NOW, LIST), null);
});

test('constant-time comparison is correct for equal, different and different-length strings', () => {
  assert.equal(auth.safeEqual('abc', 'abc'), true);
  assert.equal(auth.safeEqual('abc', 'abd'), false);
  assert.equal(auth.safeEqual('abc', 'abcd'), false);
  assert.equal(auth.safeEqual('', ''), true);
});

test('Origin check: same host over https only (http only for localhost)', () => {
  const H = (o) => new Headers({ ...(o ? { origin: o } : {}), host: 'pontmas.example.org' });
  const url = 'https://pontmas.example.org/api/szerkeszto/tartalom';
  assert.equal(auth.sameOrigin(H('https://pontmas.example.org'), url), 'https://pontmas.example.org');
  assert.equal(auth.sameOrigin(H(null), url), null, 'no Origin');
  assert.equal(auth.sameOrigin(H('https://evil.example'), url), null, 'other site');
  assert.equal(auth.sameOrigin(H('http://pontmas.example.org'), url), null, 'plain http');
  assert.equal(auth.sameOrigin(H('null'), url), null, 'opaque origin');
  assert.equal(auth.sameOrigin(new Headers({ origin: 'http://localhost:3000', host: 'localhost:3000' }), 'http://localhost:3000/x'), 'http://localhost:3000');
});

// The contact form's brake, measured by calling the endpoint itself (review of #60, gap a12; Marveen 8116).
// The data notice says the brake keeps the sender's IP address in memory for at most 10 minutes, five
// messages per address in that time. tests/legal.test.mjs ties the notice to the constants; this test
// ties it to what the endpoint DOES: with the brake unwired, the sixth message from one address would be
// accepted and this test fails.
//
// Nothing is sent: the mail settings are absent (the endpoint answers 503 before any request), and fetch
// is replaced by one that fails the test if it is ever called. Each test uses addresses of its own, since
// the brake's memory belongs to the loaded module.
import './helpers/load.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { src } from './helpers/load.mjs';

const realFetch = globalThis.fetch;
globalThis.fetch = () => {
  throw new Error('the contact endpoint made a request in a test');
};
for (const k of ['RESEND_API_KEY', 'CONTACT_TO', 'CONTACT_FROM']) delete process.env[k];
const { POST } = await src('app/api/kapcsolat/route.ts');
test.after(() => {
  globalThis.fetch = realFetch;
});

const send = (ip, body = '{}') =>
  POST(new Request('http://localhost/api/kapcsolat', { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': ip }, body }));

test('five messages from one address go through to the form check, the sixth is stopped with 429', async () => {
  const statuses = [];
  for (let i = 0; i < 6; i++) statuses.push((await send('203.0.113.1')).status);
  assert.deepEqual(statuses.slice(0, 5).map((s) => s === 429), [false, false, false, false, false], `the first five: ${statuses.slice(0, 5)}`);
  assert.equal(statuses[5], 429, `the sixth: ${statuses[5]}`);
  const body = await (await send('203.0.113.1')).json();
  assert.deepEqual(body, { ok: false, error: 'rate_limited' });
});

test('the brake stops even a message that would be refused anyway: it is checked before the body is read', async () => {
  for (let i = 0; i < 5; i++) assert.equal((await send('203.0.113.2', 'not json')).status, 400);
  assert.equal((await send('203.0.113.2', 'not json')).status, 429);
});

test('another address is not stopped by the first one being stopped', async () => {
  for (let i = 0; i < 6; i++) await send('203.0.113.3');
  assert.equal((await send('203.0.113.3')).status, 429);
  assert.notEqual((await send('203.0.113.4')).status, 429);
});

test('the address is the first one of x-forwarded-for, as the notice and the code say', async () => {
  for (let i = 0; i < 5; i++) await send(`203.0.113.5, 198.51.100.${i}`);
  assert.equal((await send('203.0.113.5, 198.51.100.99')).status, 429, 'the same first address behind other proxies is the same sender');
});

test('after 10 minutes the address may send again: the brake keeps it no longer', async (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: Date.now() });
  for (let i = 0; i < 5; i++) await send('203.0.113.6');
  assert.equal((await send('203.0.113.6')).status, 429);
  t.mock.timers.tick(10 * 60_000 - 1);
  assert.equal((await send('203.0.113.6')).status, 429, 'one millisecond before the 10 minutes: still stopped');
  t.mock.timers.tick(1);
  assert.notEqual((await send('203.0.113.6')).status, 429, 'at 10 minutes: free again');
});

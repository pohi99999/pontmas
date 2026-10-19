// The contact form really sends (SECURITY_AUDIT.md M-2, 2026-10-19). Behaviour of src/lib/contact.ts
// with an injected fetch, plus guards on the form: the old code showed success after a 800 ms
// setTimeout without any request, and the form tests below fail on it.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { sendContact, validateContact, buildEmail, TOPICS } from '../src/lib/contact.ts';

const ENV = { RESEND_API_KEY: 're_test_0123456789abcdef', CONTACT_TO: 'cimzett@example.com', CONTACT_FROM: 'Pont Más űrlap <urlap@example.com>' };
const GOOD = { nev: 'Teszt Elek', email: 'elek@example.com', telefon: '+36 30 123 4567', tema: 'aosz', uzenet: 'Szeretnék időpontot kérni.' };

function fakeFetch(response) {
  const calls = [];
  const fn = async (url, init) => { calls.push({ url, init }); if (response instanceof Error) throw response; return response; };
  return { fn, calls };
}
const json = (status, body) => ({ ok: status >= 200 && status < 300, status, json: async () => body });

test('a valid message goes to Resend with the env recipient/sender and reply_to the visitor', async () => {
  const f = fakeFetch(json(200, { id: 'msg_1' }));
  const r = await sendContact(GOOD, ENV, f.fn);
  assert.deepEqual(r, { status: 200, body: { ok: true } });
  assert.equal(f.calls.length, 1);
  assert.equal(f.calls[0].url, 'https://api.resend.com/emails');
  assert.equal(f.calls[0].init.headers.Authorization, `Bearer ${ENV.RESEND_API_KEY}`);
  const mail = JSON.parse(f.calls[0].init.body);
  assert.deepEqual(mail.to, ['cimzett@example.com']);
  assert.equal(mail.from, ENV.CONTACT_FROM);
  assert.equal(mail.reply_to, 'elek@example.com');
  assert.ok(mail.text.includes('Szeretnék időpontot kérni.') && mail.text.includes('Téma: aosz'));
  assert.equal(mail.html, undefined, 'plain text only, nothing the visitor typed becomes markup');
});

test('no success without an accepted mail: Resend error, missing id, network failure', async () => {
  for (const resp of [json(422, { message: 'bad' }), json(200, {}), new Error('ECONNRESET')]) {
    const r = await sendContact(GOOD, ENV, fakeFetch(resp).fn);
    assert.equal(r.status, 502);
    assert.equal(r.body.ok, false);
  }
});

test('missing configuration answers 503 and sends nothing', async () => {
  for (const k of Object.keys(ENV)) {
    const f = fakeFetch(json(200, { id: 'x' }));
    const r = await sendContact(GOOD, { ...ENV, [k]: '' }, f.fn);
    assert.equal(r.status, 503, k);
    assert.equal(f.calls.length, 0, k);
  }
});

test('invalid input is refused before any send', async () => {
  const bad = [{ ...GOOD, nev: '' }, { ...GOOD, email: 'nem-email' }, { ...GOOD, tema: 'barmi' }, { ...GOOD, uzenet: 'x'.repeat(5001) }, { ...GOOD, telefon: '<script>' }, null];
  for (const b of bad) {
    const f = fakeFetch(json(200, { id: 'x' }));
    const r = await sendContact(b, ENV, f.fn);
    assert.equal(r.status, 400, JSON.stringify(b)?.slice(0, 40));
    assert.equal(f.calls.length, 0);
  }
  assert.equal(validateContact(GOOD).ok, true);
});

test('a filled honeypot gets a 200 but nothing is sent', async () => {
  const f = fakeFetch(json(200, { id: 'x' }));
  const r = await sendContact({ ...GOOD, website: 'http://spam.example' }, ENV, f.fn);
  assert.equal(r.status, 200);
  assert.equal(f.calls.length, 0);
});

test('the subject cannot carry a header injection', () => {
  const m = buildEmail({ ...GOOD, nev: 'A\r\nBcc: x@example.com' }, 'f@example.com', 't@example.com');
  assert.ok(!/[\r\n]/.test(m.subject));
});

test('the form topics match the server allowlist', () => {
  const form = fs.readFileSync(path.resolve('src/components/forms/ContactForm.tsx'), 'utf8');
  const values = [...form.matchAll(/<option value="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual([...values].sort(), [...TOPICS].sort());
});

test('the form no longer fakes success: it posts to /api/kapcsolat and shows success only on ok', () => {
  const form = fs.readFileSync(path.resolve('src/components/forms/ContactForm.tsx'), 'utf8');
  assert.ok(!/setTimeout\(/.test(form), 'no simulated delay');
  assert.ok(form.includes("fetch('/api/kapcsolat'"), 'posts to the real endpoint');
  const success = form.indexOf('setIsSuccess(true)');
  const guard = form.lastIndexOf('if (res.ok && data?.ok === true)', success);
  assert.ok(success > 0 && guard > 0 && success - guard < 80, 'success only inside the ok branch');
  assert.ok(fs.existsSync(path.resolve('src/app/api/kapcsolat/route.ts')), 'the endpoint exists');
});

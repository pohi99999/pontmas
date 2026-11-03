import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { TOPICS } from '../src/lib/contact.ts';

// Rumi Edina's answer (2026-11-03, card 92c278ae): the AOSZ Info-Pont closed, the bank is Erste Bank,
// the contact is her phone. No published address may lead to a mailbox nobody reads.
const files = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? files(path.join(dir, e.name)) : /\.(tsx?|mjs|json)$/.test(e.name) ? [path.join(dir, e.name)] : []);
const src = files(path.resolve('src')).map((f) => [f, fs.readFileSync(f, 'utf8')]);

test('no page mentions the closed AOSZ Info-Pont or an unpublished e-mail address', () => {
  for (const [f, s] of src) {
    for (const bad of ['Info-Pont', 'info@pontmas.hu', 'pontmas.alapitvany@gmail.com', 'pontmas2024@gmail.com'])
      assert.ok(!s.includes(bad), `${path.relative(process.cwd(), f)} contains ${bad}`);
  }
  assert.ok(!TOPICS.includes('aosz'), 'the contact form must not offer an Info-Pont appointment');
});

test('the bank account is named Erste Bank wherever it is shown, and the number is unchanged', () => {
  const shown = src.filter(([, s]) => s.includes('11600006-00000000-75701521'));
  assert.ok(shown.length >= 3, 'home, donation page and footer show the account');
  for (const [f, s] of shown) assert.ok(s.includes('Erste Bank'), `${path.relative(process.cwd(), f)} shows the account without Erste Bank`);
});

test('footer, contact page and JSON-LD carry the contact phone', () => {
  for (const f of ['src/components/layout/Footer.tsx', 'src/app/kapcsolat/page.tsx']) {
    const s = fs.readFileSync(path.resolve(f), 'utf8');
    assert.ok(s.includes('Rumi Edina') && s.includes('tel:+36209698715'), f);
  }
  assert.ok(fs.readFileSync(path.resolve('src/app/layout.tsx'), 'utf8').includes('"telephone": "+36 20 969 8715"'));
});

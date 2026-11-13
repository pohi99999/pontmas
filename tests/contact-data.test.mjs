import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { TOPICS } from '../src/lib/contact.ts';
import { renderHtml, visibleText } from './helpers/render.mjs';
import { FOUNDATION, foundationJsonLd } from '../src/lib/foundation.ts';

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

// Edina 2026-11-13 (Péter 15449): Edit is no longer the AOSZ vice-president. The foundation stays an AOSZ
// member organisation; only the vice-presidency goes, and no new role is written in its place.
test('no page names a vice-presidency any more, in the source or on the rendered pages', async () => {
  for (const [f, s] of src) assert.ok(!/alelnök/i.test(s), `${path.relative(process.cwd(), f)} still names a vice-presidency`);
  for (const p of ['app/page.tsx', 'app/rolunk/page.tsx']) {
    const shown = visibleText(await renderHtml(p));
    assert.ok(!/alelnök/i.test(shown), `${p} still shows a vice-presidency`);
    assert.ok(shown.includes('AOSZ'), `${p} still shows the AOSZ membership`);
  }
});

test('the bank account is named Erste Bank wherever it is shown, and the number is unchanged', async () => {
  assert.equal(FOUNDATION.bankAccount, '11600006-00000000-75701521');
  assert.equal(FOUNDATION.bankName, 'Erste Bank');
  // the rendered pages: every place that shows the account also names the bank
  for (const p of ['app/page.tsx', 'app/tamogatas/page.tsx', 'components/layout/Footer.tsx']) {
    const shown = visibleText(await renderHtml(p));
    assert.ok(shown.includes('11600006-00000000-75701521'), `${p} shows the account`);
    assert.ok(shown.includes('Bankszámlaszám (Erste Bank)'), `${p} shows the account without Erste Bank`);
  }
});

test('footer, contact page and JSON-LD carry the contact phone', async () => {
  for (const p of ['components/layout/Footer.tsx', 'app/kapcsolat/page.tsx']) {
    const html = await renderHtml(p);
    assert.ok(visibleText(html).includes('Rumi Edina') && html.includes('href="tel:+36209698715"'), p);
  }
  assert.equal(foundationJsonLd().telephone, '+36 20 969 8715');
});

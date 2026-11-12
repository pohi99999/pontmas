// The legal pages (card c017f163): drafts until approved, and a draft must never look final.
import test from 'node:test';
import assert from 'node:assert/strict';
import { src } from './helpers/load.mjs';
import { renderHtml, visibleText } from './helpers/render.mjs';

const PAGES = ['app/adatkezeles/page.tsx', 'app/impresszum/page.tsx'];
const { LEGAL_DRAFT, REVIEW_MARKERS } = await src('lib/legal.ts');
const hasMarker = (text) => REVIEW_MARKERS.some((m) => text.includes(m));

test('a page with an open review marker is a draft: banner shown, not indexed', async () => {
  for (const p of PAGES) {
    const text = visibleText(await renderHtml(p));
    const { metadata } = await src(p);
    if (hasMarker(text)) {
      assert.equal(LEGAL_DRAFT, true, `${p} has open review points, so LEGAL_DRAFT must stay true`);
      assert.ok(text.includes('Tervezet: ez a szöveg még nem hatályos.'), `${p} shows the draft banner`);
      assert.deepEqual(metadata.robots, { index: false, follow: false }, `${p} is not indexed`);
    }
  }
});

test('the draft guard is not vacuous: the drafts do have markers today', async () => {
  for (const p of PAGES) assert.ok(hasMarker(visibleText(await renderHtml(p))), `${p} still has open points`);
});

test('the privacy notice states only what the site measurably does', async () => {
  const text = visibleText(await renderHtml('app/adatkezeles/page.tsx'));
  // the contact form's fields (src/lib/contact.ts validateContact)
  for (const w of ['név, e-mail-cím, telefonszám (nem kötelező), a választott téma és az üzenet szövege'])
    assert.ok(text.includes(w), w);
  const { LIMITS } = await src('lib/contact.ts');
  assert.deepEqual(Object.keys(LIMITS).sort(), ['email', 'nev', 'telefon', 'uzenet'], 'the form fields changed: update section 3');
  // the processors the code uses
  for (const w of ['Vercel Inc.', 'Resend', 'Anthropic']) assert.ok(text.includes(w), w);
  // the chat section is conditional while the chat does not exist
  assert.ok(text.includes('csak akkor lép hatályba, ha a chatet bekapcsoljuk'));
  // the foundation's facts come from foundation.ts
  const { FOUNDATION } = await src('lib/foundation.ts');
  for (const w of [FOUNDATION.name, FOUNDATION.taxNumber, FOUNDATION.phone]) assert.ok(text.includes(w), w);
});

test('footer, documents page and contact form link the legal pages', async () => {
  const footer = await renderHtml('components/layout/Footer.tsx');
  assert.ok(footer.includes('href="/adatkezeles"') && footer.includes('href="/impresszum"'), 'footer links both');
  assert.ok(!/href="\/kapcsolat"[^>]*>Adatvédelem/.test(footer), 'the old "Adatvédelem & Kapcsolat" link to /kapcsolat is gone');
  assert.ok((await renderHtml('app/dokumentumok/page.tsx')).includes('href="/adatkezeles"'), 'documents page opens the notice');
  assert.ok((await renderHtml('app/kapcsolat/page.tsx')).includes('href="/adatkezeles"') ||
    (await renderHtml('components/forms/ContactForm.tsx')).includes('href="/adatkezeles"'), 'contact form links the notice');
});

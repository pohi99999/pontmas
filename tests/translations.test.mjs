// The English and German site (card c017f163): every page renders in each language with its own texts,
// nothing Hungarian leaks through except what is Hungarian on purpose (the legal drafts' body, the
// editor's news and programme items, names), and the translations keep the structure of hu.json.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { renderHtml, visibleText } from './helpers/render.mjs';
import { src } from './helpers/load.mjs';

const read = (l) => JSON.parse(fs.readFileSync(path.resolve(`messages/${l}.json`), 'utf8'));
const HU = read('hu');
const flatten = (v, p = '') => (typeof v === 'string' ? [[p, v]] : Object.entries(v).flatMap(([k, x]) => flatten(x, p ? `${p}.${k}` : k)));
const SAME_ON_PURPOSE = ['+36 30 123 4567', 'PontMás WCAG 2.1 AA'];
// Hungarian institution names kept as names (with a description beside them), see the glossary
const KEPT_NAMES = ['Vas Vármegyei Pedagógiai Szakszolgálat'];

const PAGES = ['app/[locale]/page.tsx', 'app/[locale]/autizmus/page.tsx', 'app/[locale]/segitseg/page.tsx', 'app/[locale]/rolunk/page.tsx',
  'app/[locale]/rolunk-irtak/page.tsx', 'app/[locale]/tamogatas/page.tsx', 'app/[locale]/dokumentumok/page.tsx', 'app/[locale]/kapcsolat/page.tsx',
  'app/[locale]/hirek/page.tsx', 'app/[locale]/programok/page.tsx', 'components/layout/Header.tsx', 'components/layout/Footer.tsx',
  'components/forms/ContactForm.tsx', 'components/ui/AccessibilityToolbar.tsx'];

test('en and de have the keys, {parameters} and <tags> of hu, and no empty or untranslated text', () => {
  const huFlat = Object.fromEntries(flatten(HU));
  for (const l of ['en', 'de']) {
    const tr = Object.fromEntries(flatten(read(l)));
    assert.deepEqual(Object.keys(tr).sort(), Object.keys(huFlat).sort(), `${l} keys`);
    for (const [k, h] of Object.entries(huFlat)) {
      const v = tr[k];
      assert.ok(v.trim(), `${l} ${k} empty`);
      for (const re of [/\{(\w+)\}/g, /<\/?(\w+)>/g]) assert.deepEqual([...v.matchAll(re)].map((m) => m[1]).sort(), [...h.matchAll(re)].map((m) => m[1]).sort(), `${l} ${k}`);
      if (h.split(/\s+/).length > 3 && !SAME_ON_PURPOSE.includes(h)) assert.notEqual(v, h, `${l} ${k} is still Hungarian`);
    }
  }
});

test('every page renders in English and German with no Hungarian message text in it', async () => {
  // a Hungarian message of 4+ words found in an English or German page means a text was not translated
  const huTexts = flatten(HU).map(([, v]) => v.replace(/<\/?\w+>/g, '').replace(/\{\w+\}/g, '').trim())
    .filter((v) => v.split(/\s+/).length >= 4 && !SAME_ON_PURPOSE.includes(v) && !KEPT_NAMES.includes(v));
  for (const l of ['en', 'de']) {
    for (const p of PAGES) {
      const text = visibleText(await renderHtml(p, {}, l));
      // the whole message: a shared prefix such as the foundation's name is not a leak
      for (const h of huTexts) assert.ok(!text.includes(h), `${l} ${p}: Hungarian text "${h.slice(0, 50)}"`);
    }
  }
});

test('on /en and /de the editor items are marked Hungarian, with a note; on / nothing changes', async () => {
  for (const l of ['en', 'de']) {
    const html = await renderHtml('app/[locale]/hirek/page.tsx', {}, l);
    assert.ok(html.includes('lang="hu"'), `${l} news cards are marked Hungarian`);
    assert.ok(html.includes(read(l).Cards.huOnly), `${l} note`);
  }
  const hu = await renderHtml('app/[locale]/hirek/page.tsx', {}, 'hu');
  assert.ok(!hu.includes('lang="hu"') && !hu.includes(HU.Cards.huOnly), 'Hungarian page unchanged');
});

test('the legal drafts stay Hungarian on /en and /de, marked so, with the binding-text note', async () => {
  for (const l of ['en', 'de']) {
    for (const p of ['app/[locale]/adatkezeles/page.tsx', 'app/[locale]/impresszum/page.tsx']) {
      const html = await renderHtml(p, {}, l);
      assert.ok(html.includes('<article class="mx-auto max-w-3xl" lang="hu"'), `${l} ${p} article lang`);
      assert.ok(visibleText(html).includes(read(l).Legal.languageNote), `${l} ${p} note`);
    }
  }
  const hu = await renderHtml('app/[locale]/adatkezeles/page.tsx', {}, 'hu');
  assert.ok(!hu.includes(HU.Legal.languageNote) && !hu.includes('<article class="mx-auto max-w-3xl" lang="hu"'));
});

test('page titles are translated: metadata in each language', async () => {
  const mod = await src('app/[locale]/segitseg/page.tsx');
  for (const l of ['hu', 'en', 'de']) {
    const meta = await mod.generateMetadata({ params: Promise.resolve({ locale: l }) });
    assert.equal(meta.title, read(l).Help.meta.title, l);
    assert.equal(meta.alternates.canonical, l === 'hu' ? 'https://pontmas.hu/segitseg' : `https://pontmas.hu/${l}/segitseg`);
    assert.deepEqual(Object.keys(meta.alternates.languages).sort(), ['de', 'en', 'hu', 'x-default']);
  }
});

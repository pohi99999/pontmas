// PONTMAS-LATVANY-2 (Péter 15566): Lumen's proposals 3 (news cards) and 6 (footer on phones).
// The 1% band (proposal 2) is in sav-hatter.test.mjs. The browser run (390 and 1280 px, light and dark) is in the PR.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { src } from './helpers/load.mjs';
import { renderHtml, visibleText } from './helpers/render.mjs';
import { imageFor } from './helpers/fixtures.mjs';

const { renderToStaticMarkup } = await import('react-dom/server');
const { createElement: h } = await import('react');
const seed = await src('content/seed.ts');
const { NewsCard } = await src('components/content/ContentCards.tsx');
const read = (f) => fs.readFileSync(f, 'utf8');

test('a news card without a photo opens with the calm brand band; with a photo there is no band', () => {
  const plain = renderToStaticMarkup(h(NewsCard, { item: { ...seed.SEED_NEWS[1], image: undefined } }));
  assert.match(plain, /<div data-kartya-sav="true" aria-hidden="true" class="pm-kartya-sav [^"]*">(<span class="lufi"[^>]*><\/span>){3}<\/div>/);
  // a draft photo (no child photo declaration) is not shown, so the card gets the band
  const draft = renderToStaticMarkup(h(NewsCard, { item: { ...seed.SEED_NEWS[1], image: imageFor(null, { declared: false }) } }));
  assert.ok(draft.includes('data-kartya-sav') && !draft.includes('<img'));
  const photo = renderToStaticMarkup(h(NewsCard, { item: { ...seed.SEED_NEWS[1], image: imageFor(null) } }));
  assert.ok(photo.includes('<img') && !photo.includes('data-kartya-sav'));
  assert.match(read('src/app/globals.css'), /\.pm-kartya-sav \{ background: linear-gradient\(120deg, var\(--color-blue-50\) 0%, var\(--color-blue-100\) 100%\); \}/);
});

test('card titles: hyphenation only on phones, balanced lines from 768 px', () => {
  const card = renderToStaticMarkup(h(NewsCard, { item: seed.SEED_NEWS[1] }));
  const h3 = card.match(/<h3 class="([^"]*)"/)[1].split(' ');
  assert.ok(h3.includes('max-md:hyphens-auto') && h3.includes('md:text-balance') && h3.includes('break-words'));
  assert.ok(!h3.includes('hyphens-auto'), 'no hyphenation at every width');
});

test('/hirek: two columns from 768 px, an odd last card centred at the same width', async () => {
  const html = await renderHtml('app/hirek/page.tsx');
  const grid = html.match(/<div class="(grid grid-cols-1 md:grid-cols-2[^"]*)"><article/);
  assert.ok(grid, 'the card grid has two columns from md');
  for (const c of ['md:[&>:last-child:nth-child(odd)]:col-span-2', 'md:[&>:last-child:nth-child(odd)]:justify-self-center', 'md:[&>:last-child:nth-child(odd)]:w-[calc(50%-1rem)]']) {
    assert.ok(grid[1].replaceAll('&amp;', '&').replaceAll('&gt;', '>').split(' ').includes(c), c);
  }
  assert.ok(!html.includes('md:grid-cols-3 gap-8"><article'));
});

test('footer: the sitemap in two columns on phones, every link and button at least 44 px tall below 1024 px', async () => {
  const html = await renderHtml('components/layout/Footer.tsx');
  assert.match(html, /<ul class="grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-0 lg:gap-y-2 text-sm">/);
  const targets = [...html.matchAll(/<(a|button)\b[^>]*class="([^"]*)"/g)];
  assert.equal(targets.length, 16, 'eleven sitemap links, phone, Facebook, the donation button, two bottom links');
  for (const [, , cls] of targets) assert.ok(cls.split(' ').includes('max-lg:min-h-11'), cls);
  // the phone link keeps its space after the comma (a flex <a> would drop it)
  assert.ok(visibleText(html).includes('Rumi Edina, +36 20 969 8715'));
  assert.match(html, /<a [^>]*href="\/irodank"[^>]*>Irodánk<\/a>/);
});

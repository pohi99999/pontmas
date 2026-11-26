// Edina 2026-11-26 (Marveen 9386, Péter 18477): the charity cake sale on /hirek, her text verbatim with her bold
// parts, and her poster whole (never cropped), as small WebP files.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { src } from './helpers/load.mjs';
import { htmlText, inOrder } from './helpers/fixtures.mjs';
import { MAIN_NEWS } from './fixtures/main-items.mjs';

const { renderToStaticMarkup } = await import('react-dom/server');
const { createElement: h } = await import('react');
const { SEED_NEWS } = await src('content/seed.ts');
const meg = await src('content/hirMegjelenes.ts');
const cards = await src('components/content/ContentCards.tsx');

const ID = 'sutivasar-2026-12-19';
const item = SEED_NEWS.find((n) => n.id === ID);

// Her e-mail, the text between the title and the signature's contact lines, with the e-mail's line wraps joined.
const EDINA = [
  'Advent idején különösen sokat jelent minden apró segítség. December 19-én a PontMás Vas Megyei Autista Gyermekekért Alapítvány is ott lesz a Family Center Szombathely jótékonysági sütivásárán.',
  'A vásár *10:00 és 16:00 óra között* várja az érdeklődőket a *Family Center Szombathelyben, 9700 Szombathely, Varasd u. 1.* alatt.',
  'Azok, akik süteménnyel támogatják az alapítványt és a helyszínre hozzák felajánlásukat, *9:00–9:30 között* tudják átadni a süteményeket.',
  'A sütivásár bevételével közvetlenül a PontMás Alapítvány munkáját lehet támogatni, ezért minden egyes vásárlás segítség számunkra.',
  'Nagyon köszönjük mindazoknak, akik süteményt ajánlottak fel, segítenek a szervezésben, vagy vásárlóként csatlakoznak hozzánk.',
  '*Találkozzunk december 19-én a Family Centerben!*',
  '*Rumi Edina*\nPontMás Vas Megyei Autista Gyermekekért Alapítvány',
];

test('the item: first, the banner, her title and text verbatim, her bold parts exactly', () => {
  assert.equal(SEED_NEWS[0].id, ID, 'the newest first');
  assert.equal(item.featured, true);
  assert.equal(item.hidden, false);
  assert.equal(item.publishedAt, '2026-11-26');
  assert.equal(item.title, 'Jótékonysági sütivásár a Family Centerben – találkozzunk december 19-én!');
  assert.equal(item.description, EDINA.join('\n\n').replaceAll('*', ''));
  const bold = EDINA.join('\n\n').match(/\*([^*]+)\*/g).map((s) => s.slice(1, -1));
  assert.deepEqual([...meg.HIR_KIEMELES.get(ID)], bold);
  // her signature's phone, the foundation's address and the tax number stay out of the editable content
  for (const s of ['+36209698715', '20 969', 'Váci M.', '18654996']) assert.ok(!JSON.stringify(item).includes(s), s);
  assert.equal(SEED_NEWS.filter((n) => !n.hidden).find((n) => n.featured).id, ID, 'the first visible featured item: the banner');
});

test('the banner: her badge, seven paragraphs, five bold parts, the poster whole beside the text', () => {
  const html = renderToStaticMarkup(h(cards.NewsFeaturedCard, { item }));
  assert.ok(html.includes(item.badge) && !html.includes('Legközelebbi Szülőklub'), 'the item badge, not the hard-coded one');
  const paras = html.match(/<p class="text-base text-slate-700 leading-relaxed">[\s\S]*?<\/p>/g) ?? [];
  assert.equal(paras.length, 7);
  const strong = [...html.matchAll(/<strong[^>]*>([\s\S]*?)<\/strong>/g)].map((m) => m[1]);
  assert.deepEqual(strong, [...meg.HIR_KIEMELES.get(ID)]);
  assert.ok(paras[6].includes('Rumi Edina</strong><br/>PontMás Vas Megyei'), 'the signature keeps its line break');
  const norm = (t) => t.replace(/\s+/g, ' ').trim();
  assert.equal(norm(htmlText(paras.join(' '))), norm(EDINA.join(' ').replaceAll('*', '')));
  const img = html.match(/<img[^>]*data-plakat[^>]*>/)?.[0];
  assert.ok(img, 'the poster is there');
  const poster = meg.HIR_PLAKAT.get(ID);
  for (const s of [`src="${poster.src}"`, `${poster.srcSmall} 560w`, `width="${poster.width}"`, `height="${poster.height}"`, 'loading="lazy"', `alt="${poster.alt}"`]) assert.ok(img.includes(s), s);
  assert.ok(!/aspect-\[|object-cover/.test(img), 'never cropped: no fixed aspect, no cover');
  assert.match(html, /md:grid-cols-\[minmax\(0,5fr\)_minmax\(0,7fr\)\]/, 'beside the text from 768 px');
  for (const s of ['9:00–9:30', '10:00–16:00', 'Varasd u. 1.', 'Family Center Szombathely', '2026. december 19.']) assert.ok(poster.alt.includes(s), `alt: ${s}`);
});

test('the poster files: plain lossy WebP, small, the source ratio, the size the markup declares', () => {
  const vp8 = (f) => { const b = fs.readFileSync(path.join('public', f)); return { b, w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff }; };
  const poster = meg.HIR_PLAKAT.get(ID);
  const big = vp8(poster.src), small = vp8(poster.srcSmall);
  for (const f of [big, small]) {
    assert.equal(f.b.toString('ascii', 0, 4), 'RIFF');
    assert.equal(f.b.toString('ascii', 8, 16), 'WEBPVP8 ', 'lossy, no EXIF/XMP/ICC chunks');
    assert.ok(Math.abs(f.w / f.h - 1122 / 1402) < 0.005, 'the ratio of her 1122x1402 poster');
  }
  assert.deepEqual([big.w, big.h], [poster.width, poster.height]);
  assert.equal(small.w, 560);
  assert.ok(big.b.length <= 200 * 1024 && small.b.length <= 100 * 1024, `${big.b.length} / ${small.b.length} bytes`);
});

test("main's cards render the same markup as before: one plain <p>, no bold, no poster", () => {
  for (const n of SEED_NEWS.filter((x) => x.id !== ID)) {
    const html = renderToStaticMarkup(h(cards.NewsCard, { item: n }));
    assert.ok(html.includes(`<p class="text-sm text-slate-600 leading-relaxed">${n.description.replaceAll('"', '&quot;')}</p>`) ||
      html.includes(`<p class="text-sm text-slate-600 leading-relaxed">${n.description}</p>`), n.id);
    assert.ok(!html.includes('<strong') && !html.includes('data-plakat'), n.id);
  }
  assert.deepEqual(meg.descriptionBlocks('Egy sor, csillag *nélkül*.'), [[[{ text: 'Egy sor, csillag *nélkül*.', bold: false }]]], 'stars are not markup');
});

test('/hirek: the cake sale is the banner above the cards of main', async () => {
  delete process.env.BLOB_READ_WRITE_TOKEN; delete process.env.BLOB_CONTENT_READ_WRITE_TOKEN;
  const html = renderToStaticMarkup(await (await src('app/hirek/page.tsx')).default());
  const text = htmlText(html);
  inOrder(assert, text, [item.badge, item.date, item.title, 'Rumi Edina', 'További híreink és beszámolóink', MAIN_NEWS[1].title]);
  assert.equal((html.match(/<article/g) ?? []).length, MAIN_NEWS.length, 'the banner is not a card; main keeps its cards');
});

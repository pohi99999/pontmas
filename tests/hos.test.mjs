// The home hero of the 2026-11-10 round (Marveen 6913, Péter GO 14675): the logo's sphere as a window to a
// camp photo, the facts as a navy band, a static blue thread through the four points. No motion (11-05).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (f) => fs.readFileSync(f, 'utf8');
const ablak = read('src/components/brand/PontAblak.tsx');
const home = read('src/app/page.tsx');

test('the photo window sits exactly on the sphere of the vector logo', () => {
  // sphere: centre 326.5/279.5, radius 134 in the viewBox 100 25 369 398 (public/brand/pontmas-jel.svg)
  const svg = read('public/brand/pontmas-jel.svg');
  assert.match(svg, /viewBox="100 25 369 398"/);
  assert.match(svg, /<circle cx="326.5" cy="279.5" r="134"/);
  const pct = (v) => `${(v * 100).toFixed(2)}%`;
  const expected = { left: pct((326.5 - 134 - 100) / 369), top: pct((279.5 - 134 - 25) / 398), width: pct(268 / 369), height: pct(268 / 398) };
  for (const [k, v] of Object.entries(expected)) assert.match(ablak, new RegExp(`${k}: '${v.replace('.', '\\.')}'`), `${k} ${v}`);
  assert.match(ablak, /viewBox="100 25 369 398"/);
  assert.match(ablak, /d=\{INK_PATH\}/);
  assert.match(ablak, /d=\{RIBBON_PATH\}/);
});

test('the hero photo is one already on the site with consent (#26), with its caption as alt', () => {
  assert.match(home, /<PontAblak\s+src="\/images\/galeria\/tabor-korjatek\.webp"\s+alt="Közös játék körben"/);
  assert.ok(fs.existsSync('public/images/galeria/tabor-korjatek.webp'));
  assert.ok(read('src/components/content/Gallery.tsx').includes('tabor-korjatek'));
});

test('the facts are a navy band that keeps its palette in the dark theme; the texts are the same as before', () => {
  assert.match(home, /bg-blue-950 text-white pm-sotet/);
  for (const t of ["value: '2015 óta'", "label: 'Segítjük a családokat'", "value: '40+'", "value: 'AOSZ'"]) assert.ok(home.includes(t), t);
});

test('a static blue thread runs through the four points, the last one ends it', () => {
  const threads = [...home.matchAll(/thread="([a-z-]+)"/g)].map((m) => m[1]);
  assert.deepEqual(threads, ['continue-right', 'continue', 'continue-right', 'last']);
  const card = read('src/components/ui/FeatureCard.tsx');
  // the rule is a line element (so it can be drawn, tests/mozgas.test.mjs); without motion it simply stands
  assert.match(card, /h-0\.5 bg-blue-400" data-mozgas="vonal"/);
});

test('the hero window itself has no animation of its own: its only movement is the gated data-mozgas', () => {
  assert.doesNotMatch(ablak, /animate-|framer|@keyframes/);
  assert.match(ablak, /data-mozgas="iv"/);
});

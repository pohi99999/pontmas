// The navy 1% band (Péter 15566, Lumen's proposal 2; before: Péter 14781, the mural as a faint background).
// The sea mural is now shown in full in a frame beside the text (below 1024 px above it), and the text sits on
// plain navy. The browser run (contrast from pixels, both themes, 390 and 1280 px, no overflow) is in the PR.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { renderHtml } from './helpers/render.mjs';

const read = (f) => fs.readFileSync(f, 'utf8');
const html = await renderHtml('app/page.tsx');
const start = html.indexOf('<section class="relative isolate overflow-hidden bg-blue-950');
const band = html.slice(start, html.indexOf('</section>', start));
assert.ok(start > 0 && band.length > 200, 'the band section is found');

test('the mural is a framed picture in the grid, not a layer under the text', () => {
  assert.match(band, /<div class="pm-egyszazalek grid[^"]*lg:grid-cols-\[minmax\(0,1\.2fr\)_minmax\(0,1fr\)\]/);
  const fig = band.slice(band.indexOf('<div data-hatter'), band.indexOf('</div>', band.indexOf('<div data-hatter')) + 6);
  assert.match(fig, /^<div data-hatter="true" aria-hidden="true" class="lg:order-2[^"]*">/);
  assert.match(fig, /<img alt=""[^>]*width="1200" height="676"/);
  assert.match(fig, /class="foto w-full h-auto rounded-3xl/);
  assert.doesNotMatch(band, /absolute inset-0/, 'nothing is laid over or under the text any more');
  assert.doesNotMatch(band, /pm-hatter-takaras/);
  assert.ok(fs.existsSync('public/images/galeria/tengeri-falikep.webp'));
});

test('on phones the picture comes first (above the text), on desktop it moves to the right', () => {
  assert.ok(band.indexOf('<div data-hatter') < band.indexOf('<h2'), 'the picture is before the heading in the markup');
  assert.match(band, /<div class="lg:order-1 min-w-0"><p class="eyebrow/);
});

test('never competes for the LCP: lazy, no priority', () => {
  const img = band.slice(band.indexOf('<img'), band.indexOf('>', band.indexOf('<img')));
  assert.match(img, /loading="lazy"/);
  assert.doesNotMatch(img, /fetchpriority|fetchPriority/);
});

test('soft mode removes the picture as before, and the text then takes the whole width', () => {
  const css = read('src/app/globals.css');
  assert.match(css, /\.sensory-friendly \[data-hatter\] \{ display: none; \}/);
  assert.match(css, /\.sensory-friendly \.pm-egyszazalek \{ grid-template-columns: minmax\(0, 1fr\); \}/);
  assert.doesNotMatch(css, /pm-hatter-takaras/, 'the old cover is gone');
});

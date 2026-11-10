// The navy 1% band's faint background photo (Péter 14781, "B2, tengeri falikép"; Marveen 7037). The browser
// run (contrast AA from pixels, soft mode hides it, LCP stays the H1, no overflow) is in the PR.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (f) => fs.readFileSync(f, 'utf8');
const page = read('src/app/page.tsx');
const band = page.slice(page.indexOf('<section className="relative isolate overflow-hidden bg-blue-950'), page.indexOf('</section>', page.indexOf('bg-blue-950 text-white pm-sotet">')));

test('a decorative layer: aria-hidden, empty alt, behind the content', () => {
  assert.match(band, /<div data-hatter aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">/);
  assert.match(band, /<Image src="\/images\/galeria\/tengeri-falikep\.webp" alt="" fill sizes="100vw"/);
  assert.ok(fs.existsSync('public/images/galeria/tengeri-falikep.webp'));
});

test('never competes for the LCP: no priority, no eager loading', () => {
  const img = band.slice(band.indexOf('<Image'), band.indexOf('/>', band.indexOf('<Image')));
  assert.doesNotMatch(img, /priority|loading=|fetchPriority|preload/);
});

test('the navy cover as in the mockup, and soft mode removes the layer', () => {
  const css = read('src/app/globals.css');
  assert.match(css, /\.pm-hatter-takaras \{\s*background: linear-gradient\(90deg, var\(--color-blue-950\) 0%, var\(--color-blue-950\) 45%, color-mix\(in srgb, var\(--color-blue-950\) 78%, transparent\) 100%\);/);
  assert.match(css, /@media \(max-width: 767\.98px\) \{\s*\.pm-hatter-takaras \{ background: color-mix\(in srgb, var\(--color-blue-950\) 90%, transparent\); \}/);
  assert.match(css, /\.sensory-friendly \[data-hatter\] \{ display: none; \}/);
});

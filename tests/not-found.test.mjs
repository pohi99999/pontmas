// The page for an address that does not exist is the site's own, in Hungarian (T4, Péter 16967).
import test from 'node:test';
import assert from 'node:assert/strict';
import { src } from './helpers/load.mjs';
import { renderHtml, visibleText } from './helpers/render.mjs';

const html = await renderHtml('app/not-found.tsx');
const text = visibleText(html);

test('it says in Hungarian that the page is not found, with one main heading', () => {
  assert.ok(text.includes('Ezt az oldalt nem találjuk'), text.slice(0, 200));
  assert.ok(text.includes('az oldal nem található'));
  assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1);
  assert.ok(!/this page could not be found/i.test(text), 'the framework\'s English default');
  // the footer's headings are third-level: without a second-level one here the page would skip a level
  assert.equal((html.match(/<h2[ >]/g) ?? []).length, 1);
});

test('it leads on: to the home page, to the help page and to the contact page', () => {
  const links = [...html.matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => m[1]);
  for (const href of ['/', '/segitseg', '/kapcsolat']) assert.ok(links.includes(href), `no link to ${href}: ${links.join(', ')}`);
});

test('the phone number is the foundation\'s one, from foundation.ts', async () => {
  const { FOUNDATION, PHONE_HREF } = await src('lib/foundation.ts');
  assert.ok(text.includes(FOUNDATION.phone));
  assert.ok(html.includes(`href="${PHONE_HREF}"`));
});

test('its title is its own', async () => {
  const { metadata } = await src('app/not-found.tsx');
  assert.equal(metadata.title, 'Az oldal nem található | PontMás Alapítvány');
});

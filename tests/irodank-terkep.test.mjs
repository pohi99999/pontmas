import test from 'node:test';
import assert from 'node:assert/strict';
import { renderHtml, visibleText } from './helpers/render.mjs';

// Irodánk: a route link to the foundation's Google profile under the address (Edina 2026-11-17 13:51, Péter 16703).
// The exact URL was opened on 2026-11-17 and showed the verified profile; a link only, never an embedded map.
const MAPS = 'https://www.google.com/maps/search/?api=1&query=PontM%C3%A1s+Vas+Megyei+Autista+Gyermekek%C3%A9rt+Alap%C3%ADtv%C3%A1ny+Szombathely+Sug%C3%A1r+%C3%BAt+9';

test('Irodánk links the address to the foundation\'s Google Maps profile, in a new tab, with an accessible name', async () => {
  const html = await renderHtml('app/irodank/page.tsx');
  const links = [...html.matchAll(/<a [^>]*href="([^"]*google\.com\/maps[^"]*)"[^>]*>([\s\S]*?)<\/a>/g)];
  assert.equal(links.length, 1, 'exactly one Maps link');
  const [tag, href, inner] = links[0];
  assert.equal(href.replaceAll('&amp;', '&'), MAPS);
  assert.match(tag, /target="_blank"/);
  assert.match(tag, /rel="noopener noreferrer"/);
  const name = visibleText(inner).replace(/\s+/g, ' ').trim();
  assert.ok(name.includes('Útvonal a Google Térképen'), name);
  assert.ok(name.includes('(új lapon nyílik)'), name);
  // it sits with the address
  assert.ok(html.indexOf('Szombathely, Sugár út 9. 3. emelet') < html.indexOf(links[0][0]));
});

test('Irodánk embeds no map: no iframe and no Maps embed URL', async () => {
  const html = await renderHtml('app/irodank/page.tsx');
  assert.ok(!/<iframe/i.test(html));
  assert.ok(!/maps\/embed|output=embed/.test(html));
});

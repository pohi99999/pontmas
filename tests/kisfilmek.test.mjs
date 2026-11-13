import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { renderHtml, visibleText } from './helpers/render.mjs';
import { KISFILMEK, SZULOI_SOROZAT, SZULOI_SOROZAT_LISTA, YOUTUBE_CSATORNA, lejatszoUrl } from '../src/content/kisfilmek.ts';
import { CONTENT_SECURITY_POLICY } from '../src/lib/securityHeaders.ts';

// /kisfilmek (Edina 2026-11-13 15:45, Péter 15469): the three films of the SZÜLŐ2025 series, in order, with
// Edina's text word for word, and no request to YouTube before the visitor presses play.
const read = (p) => fs.readFileSync(path.resolve(p), 'utf8');

test('the three films, in order, with their YouTube ids and titles; the playlist and the channel', () => {
  assert.deepEqual(KISFILMEK.map((f) => f.youtubeId), ['aCihJ-XHJQ4', 'jaZbHRAE0vI', 'hqIW0lrcB30']);
  assert.deepEqual(KISFILMEK.map((f) => f.cim.slice(0, 8)), ['1. rész:', '2. rész:', '3. rész:']);
  assert.equal(SZULOI_SOROZAT_LISTA, 'https://www.youtube.com/playlist?list=PLREtV1vomjYE');
  assert.equal(YOUTUBE_CSATORNA, 'https://www.youtube.com/@PontM%C3%A1sVasMegyeiAutistaGyermek');
  // Edina's own playlists link is her personal feed, it must not be on the site
  for (const s of [read('src/content/kisfilmek.ts'), read('src/app/kisfilmek/page.tsx')]) assert.ok(!s.includes('feed/playlists'));
});

test('the page carries Edina\'s text word for word: the grant, its number, the aim, the parts, the advantage', async () => {
  const shown = visibleText(await renderHtml('app/kisfilmek/page.tsx'));
  assert.ok(shown.includes('"Szülősegítő szolgáltatások támogatása 2025" (SZÜLŐ2025)'));
  assert.ok(shown.includes('„Kezdeti segítség nyújtása az autizmussal élők szüleinek, nevelőinek” címmel, SZÜLŐ2025-B-4764 számon támogatásban részesült.'));
  for (const p of [SZULOI_SOROZAT.palyazat, SZULOI_SOROZAT.cel, SZULOI_SOROZAT.tartalom, SZULOI_SOROZAT.elony, ...SZULOI_SOROZAT.reszek])
    assert.ok(shown.includes(p), p.slice(0, 40));
  // the films in their order
  const at = KISFILMEK.map((f) => shown.indexOf(f.cim));
  assert.ok(at.every((i) => i >= 0) && at[0] < at[1] && at[1] < at[2], String(at));
});

test('before a click the page holds no player and nothing from YouTube but the two plain links', async () => {
  const html = await renderHtml('app/kisfilmek/page.tsx');
  assert.ok(!/<iframe/i.test(html), 'no iframe before a click');
  for (const bad of ['youtube-nocookie.com/embed', 'youtube.com/embed', 'ytimg.com', 'googlevideo'])
    assert.ok(!html.includes(bad), bad);
  for (const f of KISFILMEK) assert.ok(html.includes(`aria-label="Lejátszás: ${f.cim}"`), f.youtubeId);
  for (const href of [SZULOI_SOROZAT_LISTA, YOUTUBE_CSATORNA]) {
    const a = html.match(new RegExp(`<a[^>]*href="${href.replace(/[.?]/g, '\\$&')}"[^>]*>`))?.[0];
    assert.ok(a && a.includes('rel="noopener noreferrer"') && a.includes('target="_blank"'), href);
  }
  // the player comes only from the state the click sets, from the privacy-enhanced domain
  const c = read('src/components/content/Kisfilm.tsx');
  assert.match(c, /\{fut \? \(\s*<iframe/);
  assert.equal(lejatszoUrl('aCihJ-XHJQ4'), 'https://www.youtube-nocookie.com/embed/aCihJ-XHJQ4?autoplay=1&rel=0');
});

test('Kisfilmek is in the main menu (desktop and mobile share one list) and in the footer', async () => {
  const h = read('src/components/layout/Header.tsx');
  assert.ok(h.includes("{ label: 'Kisfilmek', href: '/kisfilmek' }"));
  assert.equal((h.match(/navItems\.map\(/g) || []).length, 2, 'both menus are drawn from navItems');
  assert.match(await renderHtml('components/layout/Footer.tsx'), /<a [^>]*href="\/kisfilmek"[^>]*>Kisfilmek<\/a>/);
});

test('the CSP lets only the privacy-enhanced YouTube player be framed', () => {
  const frame = CONTENT_SECURITY_POLICY.split('; ').find((d) => d.startsWith('frame-src'));
  assert.equal(frame, 'frame-src https://www.youtube-nocookie.com');
});

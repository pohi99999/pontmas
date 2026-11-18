// The photo in the sphere of a subpage's header (L2, Lumen's plan of 2026-11-18, Péter 16967).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { src } from './helpers/load.mjs';
import { renderHtml } from './helpers/render.mjs';

const { FEJLEC_FOTO, published } = await src('content/fejlecFotok.ts');
const { CAMP_PHOTOS, WORK_PHOTOS, COMMUNITY_PHOTOS } = await src('components/content/Gallery.tsx');
const WITH_PHOTO = ['/segitseg', '/hirek', '/tamogatas', '/kisfilmek', '/autizmus', '/programok'];
const WITH_MARK = ['/rolunk', '/rolunk-irtak', '/dokumentumok', '/kapcsolat', '/irodank'];
const HOME_HERO = '/images/galeria/tabor-korjatek.webp';
const inHtml = (p) => encodeURIComponent(p);

test('six pages have a header photo, each a different one, as Lumen assigned them', () => {
  assert.deepEqual(Object.keys(FEJLEC_FOTO).sort(), [...WITH_PHOTO].sort());
  const used = Object.values(FEJLEC_FOTO).map((f) => f.src);
  assert.equal(new Set(used).size, used.length, 'a photo is used on two pages');
  assert.equal(FEJLEC_FOTO['/autizmus'].src, '/images/galeria/noveny-lenyomatok.webp');
  assert.equal(FEJLEC_FOTO['/programok'].src, '/images/galeria/bogrefestes.webp');
});

test('every header photo is one already published in a gallery, with that gallery\'s caption as its text, and the file exists', () => {
  const published = [...CAMP_PHOTOS, ...WORK_PHOTOS];
  for (const [page, foto] of Object.entries(FEJLEC_FOTO)) {
    const photo = published.find((p) => p.src === foto.src);
    assert.ok(photo, `${page}: ${foto.src} is not in a gallery`);
    assert.equal(foto.alt, photo.caption, `${page}: the text is the gallery's caption`);
    assert.ok(fs.existsSync(path.join('public', foto.src)), `${foto.src} is not in public/`);
  }
});

test('no header repeats the home page: not the hero photo, and none of the community photos of its band', () => {
  const used = Object.values(FEJLEC_FOTO).map((f) => f.src);
  assert.ok(!used.includes(HOME_HERO));
  for (const p of COMMUNITY_PHOTOS) assert.ok(!used.includes(p.src), `${p.src} is a community photo`);
});

test('the six pages show their photo in the header, hidden from a screen reader; the other five keep the mark', async () => {
  for (const page of WITH_PHOTO) {
    const html = await renderHtml(`app${page}/page.tsx`);
    const header = html.slice(0, html.indexOf('</section>'));
    assert.ok(header.includes(inHtml(FEJLEC_FOTO[page].src)) || header.includes(FEJLEC_FOTO[page].src), `${page}: the photo is not in its header`);
    assert.match(header, /<div class="absolute right-0 -top-3 [^"]*" aria-hidden="true">/, `${page}: the photo window is decorative`);
  }
  for (const page of WITH_MARK) {
    const html = await renderHtml(`app${page}/page.tsx`);
    const header = html.slice(0, html.indexOf('</section>'));
    assert.ok(!header.includes('galeria'), `${page}: a photo in the header`);
    assert.match(header, /<div class="absolute right-0 top-1\/2 hidden [^"]*lg:block">/, `${page}: the mark, from 1024 px`);
  }
});

test('a photo that is not in a gallery cannot be named', () => {
  assert.deepEqual(published('bogrefestes'), { src: '/images/galeria/bogrefestes.webp', alt: 'Bögrefestés a táborban' });
  // a file that exists in public/ but is in no gallery: the community cover is not in the two lists
  assert.throws(() => published('nincs-ilyen-kep'), /not a photo of the site's galleries/);
  assert.throws(() => published('kozosseg-felvonulas'), /not a photo of the site's galleries/);
});

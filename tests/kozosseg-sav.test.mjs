// The home page's "A közösségünk képekben" band (L3, Lumen's plan of 2026-11-18, Péter 16967).
import test from 'node:test';
import assert from 'node:assert/strict';
import { src } from './helpers/load.mjs';
import { renderHtml, visibleText } from './helpers/render.mjs';

const { COMMUNITY_PHOTOS, CommunityBand } = await src('components/content/Gallery.tsx');
const { renderToStaticMarkup } = await import('react-dom/server');
const { createElement } = await import('react');
const band = renderToStaticMarkup(createElement(CommunityBand));

test('the band shows three different photos, each one already published on /rolunk with the same caption and alt text', async () => {
  const figures = [...band.matchAll(/<figure[\s\S]*?<\/figure>/g)].map((m) => m[0]);
  assert.equal(figures.length, 3);
  const about = await renderHtml('app/rolunk/page.tsx');
  const seen = new Set();
  for (const figure of figures) {
    const photo = COMMUNITY_PHOTOS.find((p) => figure.includes(encodeURIComponent(p.src)) || figure.includes(p.src));
    assert.ok(photo, `a photo that is not one of the community photos: ${figure.slice(0, 200)}`);
    assert.ok(!seen.has(photo.src), `${photo.src} is shown twice`);
    seen.add(photo.src);
    assert.ok(visibleText(figure).includes(photo.caption), `caption of ${photo.src}`);
    assert.ok(figure.includes(`alt="${photo.alt.replace(/"/g, '&quot;')}"`), `alt of ${photo.src}`);
    assert.ok(visibleText(about).includes(photo.caption), `${photo.src} is not on /rolunk`);
    assert.match(figure, /loading="lazy"/, 'the photos are below the first screen and load lazily');
  }
});

test('it has a heading of its own and leads to the gallery on /rolunk', () => {
  assert.match(band, /<h2 id="kozosseg-cim"[^>]*>A közösségünk képekben<\/h2>/);
  assert.match(band, /aria-labelledby="kozosseg-cim"/);
  assert.match(band, /<a [^>]*href="\/rolunk"[^>]*>További képek a Rólunk oldalon/);
});

test('the home page shows the band once, before the donation band', async () => {
  const home = await renderHtml('app/page.tsx');
  assert.equal(home.split('id="kozosseg-cim"').length - 1, 1);
  assert.ok(home.indexOf('id="kozosseg-cim"') < home.indexOf('Forrás: NAV'), 'the band comes before the 1% band');
});

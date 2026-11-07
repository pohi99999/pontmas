// The /programok and /rolunk photos (Péter 13933 and the 2026-11-07 decision). This is a public repo and the
// subject is children's programmes: only the approved files may be here, whole where approved, without metadata,
// and the texts stay free of names, years, headcounts and diagnoses.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { src } from './helpers/load.mjs';

const { renderToStaticMarkup } = await import('react-dom/server');
const { createElement: h } = await import('react');
const { CAMP_PHOTOS, WORK_PHOTOS, COMMUNITY_COVER, COMMUNITY_PHOTOS, default: Gallery, CommunityGallery } = await src('components/content/Gallery.tsx');

const IMAGES = path.resolve('public/images');
const PHOTOS = [...CAMP_PHOTOS, ...WORK_PHOTOS, COMMUNITY_COVER, ...COMMUNITY_PHOTOS];
const APPROVED = [
  'bogrefestes', 'kezzel-keszult-szivek', 'kozosseg-felvonulas', 'kozosseg-kek-feny', 'kozosseg-osszeallitas',
  'kozosseg-regisztracio', 'noveny-lenyomatok', 'tabor-kepkartyak-a-falon', 'tabor-korjatek',
  'tabor-pihenes-babzsakon', 'tabor-rajzolt-arcok', 'tabor-tal-folott', 'tabor-vaszontaska-az-asztalnal',
  'tengeri-falikep',
].map((name) => `galeria/${name}.webp`);
// width / height of the source files: these photos are shown whole, so the ratio must survive
const WHOLE = {
  'tabor-kepkartyak-a-falon': 1536 / 2048, 'tabor-korjatek': 1536 / 2048, 'tabor-tal-folott': 1536 / 2048,
  'tabor-pihenes-babzsakon': 2048 / 1152, 'tabor-rajzolt-arcok': 2048 / 1536, 'tabor-vaszontaska-az-asztalnal': 2048 / 1536,
  'kozosseg-felvonulas': 2048 / 1363, 'kozosseg-kek-feny': 2048 / 1363, 'kozosseg-regisztracio': 1269 / 1904,
  'kozosseg-osszeallitas': 1672 / 941,
};
const file = (photo) => path.join('public', photo.src);

function chunks(buf) {
  assert.equal(buf.toString('latin1', 0, 4), 'RIFF');
  assert.equal(buf.toString('latin1', 8, 12), 'WEBP');
  const found = [];
  for (let i = 12; i < buf.length;) {
    const size = buf.readUInt32LE(i + 4);
    found.push(buf.toString('latin1', i, i + 4));
    i += 8 + size + (size & 1);
  }
  return found;
}

test('public/images holds the approved photos and nothing else', () => {
  const images = fs.readdirSync(IMAGES, { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile() && !e.name.endsWith('.txt'))
    .map((e) => path.relative(IMAGES, path.join(e.parentPath, e.name)))
    .sort();
  assert.deepEqual(images, APPROVED);
  assert.deepEqual(PHOTOS.map((p) => p.src.replace('/images/', '')).sort(), APPROVED);
});

test('each photo is a plain lossy WebP: no EXIF, XMP or colour profile, small, and its size is declared right', () => {
  for (const photo of PHOTOS) {
    const buf = fs.readFileSync(file(photo));
    assert.deepEqual(chunks(buf), ['VP8 '], photo.src);
    const limit = photo === COMMUNITY_COVER ? 250 : 150;
    assert.ok(buf.length <= limit * 1024, `${photo.src}: ${buf.length} bytes`);
    // the VP8 frame header: chunk data starts at 20, then 3 bytes frame tag and 3 bytes start code
    assert.equal(buf.readUInt16LE(26) & 0x3fff, photo.width, photo.src);
    assert.equal(buf.readUInt16LE(28) & 0x3fff, photo.height, photo.src);
  }
});

test('the uncropped photos keep the ratio of their source', () => {
  for (const [name, ratio] of Object.entries(WHOLE)) {
    const photo = PHOTOS.find((p) => p.src.endsWith(`/${name}.webp`));
    assert.ok(Math.abs(photo.width / photo.height - ratio) < 0.005, name);
  }
});

test('the texts have no name, year, headcount or diagnosis, and only the two press photos credit the photographer', () => {
  // \b is ASCII-only in JS and never matches around "Á", so the names are bounded by Unicode letters
  const FORBIDDEN = /autiz|autist|spektrum|diagn|(?<!\p{L})(Áron|Andris|Viki|Zsolt)(?!\p{L})|\b(19|20)\d{2}\b|\d+\s*(fő|gyerek|család)/iu;
  const section = fs.readFileSync(path.resolve('src/components/content/Gallery.tsx'), 'utf8').match(/title="[^"]*"|subtitle="[^"]*"/g);
  assert.equal(section.length, 6);
  for (const text of [...PHOTOS.flatMap((p) => [p.alt, p.caption]), ...section]) assert.doesNotMatch(text, FORBIDDEN);
  const credited = PHOTOS.filter((p) => p.caption.includes('Fotó: Nagy Jácint')).map((p) => p.src.match(/([^/]+)\.webp/)[1]).sort();
  assert.deepEqual(credited, ['kozosseg-felvonulas', 'kozosseg-kek-feny']);
  for (const photo of PHOTOS) assert.ok(!photo.alt.includes('Jácint'));
});

test('rendered: section headings only, every photo a figure with a real alt text and its own caption, below the fold', () => {
  for (const [component, photos, headings] of [[Gallery, [...CAMP_PHOTOS, ...WORK_PHOTOS], 2], [CommunityGallery, [COMMUNITY_COVER, ...COMMUNITY_PHOTOS], 1]]) {
    const html = renderToStaticMarkup(h(component));
    assert.equal((html.match(/<h2/g) ?? []).length, headings);
    assert.equal((html.match(/<figure/g) ?? []).length, photos.length);
    assert.equal((html.match(/<figcaption/g) ?? []).length, photos.length);
    assert.equal((html.match(/loading="lazy"/g) ?? []).length, photos.length);
    assert.ok(!html.includes('fetchPriority'));
    const alts = [...html.matchAll(/ alt="([^"]*)"/g)].map((m) => m[1]);
    assert.equal(new Set(alts).size, photos.length);
    for (const alt of alts) assert.ok(alt.length > 40, alt);
    for (const photo of photos) assert.notEqual(photo.alt, photo.caption);
  }
});

test('/programok shows the gallery after the programs, /rolunk after the milestones', () => {
  const programok = fs.readFileSync(path.resolve('src/app/programok/page.tsx'), 'utf8');
  const [filter, gallery, institutions] = ['<ProgramFilter', '<Gallery />', 'Támogatott intézmények'].map((s) => programok.indexOf(s));
  assert.ok(filter > 0 && filter < gallery && gallery < institutions);
  const rolunk = fs.readFileSync(path.resolve('src/app/rolunk/page.tsx'), 'utf8');
  const [milestones, community, cta] = ['Főbb mérföldköveink', '<CommunityGallery />', '<CtaBand'].map((s) => rolunk.indexOf(s));
  assert.ok(milestones > 0 && milestones < community && community < cta);
});

// The /programok photos (Péter 13933, 2026-11-07). This is a public repo and the subject is children's
// programmes: only the approved crops may be here, without metadata, and the texts stay free of names,
// years, headcounts and diagnoses.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { src } from './helpers/load.mjs';

const { renderToStaticMarkup } = await import('react-dom/server');
const { createElement: h } = await import('react');
const { WORK_PHOTOS, default: Gallery } = await src('components/content/Gallery.tsx');

const IMAGES = path.resolve('public/images');
const APPROVED = ['galeria/bogrefestes.webp', 'galeria/kezzel-keszult-szivek.webp', 'galeria/noveny-lenyomatok.webp', 'galeria/tengeri-falikep.webp'];
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
  assert.deepEqual(WORK_PHOTOS.map((p) => p.src.replace('/images/', '')).sort(), APPROVED);
});

test('each photo is a plain lossy WebP: no EXIF, XMP or colour profile, small, and its size is declared right', () => {
  for (const photo of WORK_PHOTOS) {
    const buf = fs.readFileSync(file(photo));
    assert.deepEqual(chunks(buf), ['VP8 '], photo.src);
    assert.ok(buf.length <= 100 * 1024, `${photo.src}: ${buf.length} bytes`);
    // the VP8 frame header: chunk data starts at 20, then 3 bytes frame tag and 3 bytes start code
    assert.equal(buf.readUInt16LE(26) & 0x3fff, photo.width, photo.src);
    assert.equal(buf.readUInt16LE(28) & 0x3fff, photo.height, photo.src);
  }
});

test('the texts have no name, year, headcount or diagnosis', () => {
  const FORBIDDEN = /autiz|autist|spektrum|diagn|\bÁron\b|\bAndris\b|\b(19|20)\d{2}\b|\d+\s*(fő|gyerek|család)/i;
  const section = fs.readFileSync(path.resolve('src/components/content/Gallery.tsx'), 'utf8').match(/title="[^"]*"|subtitle="[^"]*"/g);
  assert.equal(section.length, 2);
  for (const text of [...WORK_PHOTOS.flatMap((p) => [p.alt, p.caption]), ...section]) assert.doesNotMatch(text, FORBIDDEN);
});

test('rendered: one heading, every photo a figure with a real alt text and its own caption, below the fold', () => {
  const html = renderToStaticMarkup(h(Gallery));
  assert.equal((html.match(/<h2/g) ?? []).length, 1);
  assert.equal((html.match(/<figure/g) ?? []).length, WORK_PHOTOS.length);
  assert.equal((html.match(/<figcaption/g) ?? []).length, WORK_PHOTOS.length);
  assert.equal((html.match(/loading="lazy"/g) ?? []).length, WORK_PHOTOS.length);
  assert.ok(!html.includes('fetchPriority'));
  const alts = [...html.matchAll(/ alt="([^"]*)"/g)].map((m) => m[1]);
  assert.equal(new Set(alts).size, WORK_PHOTOS.length);
  for (const alt of alts) assert.ok(alt.length > 40, alt);
  for (const photo of WORK_PHOTOS) assert.notEqual(photo.alt, photo.caption);
});

test('/programok shows the gallery after the programs, before the supported institutions', () => {
  const page = fs.readFileSync(path.resolve('src/app/programok/page.tsx'), 'utf8');
  const [filter, gallery, institutions] = ['<ProgramFilter', '<Gallery />', 'Támogatott intézmények'].map((s) => page.indexOf(s));
  assert.ok(filter > 0 && filter < gallery && gallery < institutions);
});

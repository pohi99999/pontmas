// /rolunk: the foundation's own voice, the parents' thoughts and the people (Péter 14682, Marveen 6928).
// The guard that matters: every "Amiért dolgozunk" sentence is already on the site, word for word, in the
// file it names, so no new claim can slip in.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { AMIERT_DOLGOZUNK, SZULOI_GONDOLATOK } from '../src/content/hangunk.ts';
import { CSAPAT, lathatoCsapat } from '../src/content/csapat.ts';

const read = (f) => fs.readFileSync(f, 'utf8');

test('every "Amiért dolgozunk" sentence is word for word in the file it names (no new claim)', () => {
  assert.ok(AMIERT_DOLGOZUNK.length >= 3);
  for (const m of AMIERT_DOLGOZUNK) {
    const file = m.forras.split(' ')[0];
    assert.ok(read(file).includes(m.szoveg), `${file}: ${m.szoveg}`);
    assert.doesNotMatch(m.szoveg, /[„”"]/, 'no quotation marks: the foundation speaks, nobody is quoted');
  }
});

test('the block has no parent framing, no names, no quotation marks', () => {
  const c = read('src/components/content/Hangunk.tsx');
  const block = c.slice(c.indexOf('export function AmiertDolgozunk'), c.indexOf('export function SzuloiGondolatok'));
  assert.match(block, />Amiért dolgozunk</);
  assert.doesNotMatch(block, /családoktól|szülő|blockquote|„/);
});

test('the parents\' thoughts render nothing until real ones are in, and each needs a consent', () => {
  assert.deepEqual([...SZULOI_GONDOLATOK], []);
  const c = read('src/components/content/Hangunk.tsx');
  assert.match(c, /if \(!SZULOI_GONDOLATOK\.length\) return null;/);
  assert.match(read('src/content/hangunk.ts'), /hozzajarulas: string/);
});

test('the people: roles from a source, nobody shown without a published portrait', () => {
  const edit = CSAPAT.find((t) => t.nev === 'Pohánka Edit');
  assert.ok(read('src/app/rolunk/page.tsx').includes('A kuratórium elnöke <strong>Pohánka Edit</strong>'));
  assert.match(edit.szerep, /kuratórium elnöke/);
  assert.equal(CSAPAT.find((t) => t.nev === 'Rumi Edina').szerep, 'Alapítványi munkatárs');
  for (const t of CSAPAT) assert.ok(t.forras.length > 10, t.nev);
  assert.deepEqual([...lathatoCsapat(CSAPAT)], []); // today: no portrait is put up
  assert.equal(lathatoCsapat([{ nev: 'X', szerep: 'y', forras: 'z', publikus: true }]).length, 0, 'no photo, no card');
  assert.equal(lathatoCsapat([{ nev: 'X', szerep: 'y', forras: 'z', publikus: false, foto: '/a.webp' }]).length, 0, 'not published, no card');
  assert.equal(lathatoCsapat([{ nev: 'X', szerep: 'y', forras: 'z', publikus: true, foto: '/a.webp' }]).length, 1);
});

test('placed on /rolunk', () => {
  const p = read('src/app/rolunk/page.tsx');
  assert.match(p, /<AmiertDolgozunk \/>\s*<SzuloiGondolatok \/>/);
  assert.match(p, /<CsapatSor \/>/);
});

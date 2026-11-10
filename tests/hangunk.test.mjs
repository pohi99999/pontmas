// /rolunk: the foundation's own voice, the parents' thoughts and the people (Péter 14682, Marveen 6928).
// The guard that matters: every "Amiért dolgozunk" sentence is already on the site, word for word, in the
// file it names, so no new claim can slip in.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { AMIERT_DOLGOZUNK, SZULOI_GONDOLATOK } from '../src/content/hangunk.ts';
import { CSAPAT, lathatoCsapat, monogram } from '../src/content/csapat.ts';

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

test('the people: roles from a source, the two portraits up, a card without a photo shows the initials', () => {
  const edit = CSAPAT.find((t) => t.nev === 'Pohánka Edit');
  const edina = CSAPAT.find((t) => t.nev === 'Rumi Edina');
  assert.ok(read('src/app/rolunk/page.tsx').includes('A kuratórium elnöke <strong>Pohánka Edit</strong>'));
  assert.match(edit.szerep, /kuratórium elnöke/);
  assert.equal(edina.szerep, 'Alapítványi munkatárs');
  for (const t of CSAPAT) assert.ok(t.forras.length > 10, t.nev);
  // Péter 14680: these two portraits go up now; the files exist, 4:5
  assert.deepEqual(lathatoCsapat(CSAPAT).map((t) => t.nev), ['Pohánka Edit', 'Rumi Edina']);
  for (const t of [edit, edina]) {
    const buf = fs.readFileSync('public' + t.foto);
    assert.equal(buf.toString('ascii', 8, 12), 'WEBP', t.foto);
  }
  // published without a photo: shown, with initials; not published: hidden
  assert.equal(lathatoCsapat([{ nev: 'X Y', szerep: 'y', forras: 'z', publikus: true }]).length, 1);
  assert.equal(lathatoCsapat([{ nev: 'X Y', szerep: 'y', forras: 'z', publikus: false, foto: '/a.webp' }]).length, 0);
  assert.equal(monogram('Pohánka Edit'), 'PE');
  assert.equal(monogram('Újvári Ödön'), 'ÚÖ');
  const c = read('src/components/content/Hangunk.tsx');
  assert.match(c, /t\.foto \? \([\s\S]*<Image[\s\S]*\) : \([\s\S]*monogram\(t\.nev\)/);
});

test('placed on /rolunk', () => {
  const p = read('src/app/rolunk/page.tsx');
  assert.match(p, /<AmiertDolgozunk \/>\s*<SzuloiGondolatok \/>/);
  assert.match(p, /<CsapatSor \/>/);
});

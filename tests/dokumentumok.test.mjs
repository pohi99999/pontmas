import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { renderHtml, visibleText } from './helpers/render.mjs';
import { src } from './helpers/load.mjs';

// /dokumentumok (Edina's files, 2026-11-13; Péter 15490/15492/15500; Marveen 7367-7372): the reports and the
// privacy policy are downloadable, every date and amount comes from the PDFs, the unsourced claims are gone.
const { DOKUMENTUMOK, TAMOGATASOK, meretSzoveg } = await src('content/dokumentumok.ts');
const html = await renderHtml('app/dokumentumok/page.tsx');
const shown = visibleText(html);
const pub = (p) => path.resolve('public' + p);

test('the five PDFs are in public/dokumentumok, real PDFs, each offered for download with its true size', () => {
  const files = DOKUMENTUMOK.filter((d) => d.file).map((d) => d.file);
  assert.deepEqual(files.sort(), [
    '/dokumentumok/pontmas-adatvedelmi-szabalyzat-2024.pdf',
    '/dokumentumok/pontmas-alapito-okirat.pdf',
    '/dokumentumok/pontmas-beszamolo-2024.pdf',
    '/dokumentumok/pontmas-beszamolo-2025.pdf',
    '/dokumentumok/pontmas-szakmai-beszamolo-2023.pdf',
  ]);
  for (const f of files) {
    const buf = fs.readFileSync(pub(f));
    assert.equal(buf.subarray(0, 5).toString(), '%PDF-', f);
    assert.match(html, new RegExp(`<a href="${f}" download=""[^>]*>`), f);
    assert.ok(shown.includes(`Letöltés (PDF, ${meretSzoveg(buf.length)})`), f);
  }
  assert.equal(meretSzoveg(1900398), '1,8 MB');
  assert.equal(meretSzoveg(221313), '216 KB');
});

test('the founding deed is the redacted copy Edina approved (11-14): image-only pages, no text layer to leak', () => {
  const deed = DOKUMENTUMOK.find((d) => d.title.startsWith('Alapító okirat'));
  assert.equal(deed.file, '/dokumentumok/pontmas-alapito-okirat.pdf');
  const buf = fs.readFileSync(pub(deed.file));
  const raw = buf.toString('latin1');
  assert.equal((raw.match(/\/Font/g) || []).length, 0, 'a text layer would carry the covered data');
  assert.equal((raw.match(/\/Subtype\s*\/Image/g) || []).length, 8);
  assert.ok(!shown.includes('Hamarosan elérhető'));
});

test('the SZÜLŐ2025 grant carries the project title Edina confirmed (11-14), not the report\'s misprint', () => {
  assert.ok(shown.includes('„Kezdeti segítség nyújtása az autizmussal élők szüleinek, nevelőinek”'));
  assert.ok(!shown.includes('autizmussal élő szülőknek'));
});

test('dates and amounts as the PDFs give them', () => {
  for (const t of [
    'Hatályos: 2024. szeptember 13-tól',
    'Érkezett a bírósághoz: 2026. augusztus 5.',
    'Érkezett a bírósághoz: 2025. június 27.',
    'Kelt: 2024. június 24.',
    'SZÜLŐ2025-B-4764', '481 800 Ft vissza nem térítendő támogatás', 'Slachta Margit Nemzeti Szociálpolitikai Intézet',
    '22 gyógypedagógusa', '1.320.000 Ft', '800.000 Ft a Szombathely Megyei Jogú Város Önkormányzati Támogatási Rendszeréből',
    'Megvalósítás: 2024. április, május és november', '715.000 Ft', 'Megvalósítás: 2023. október és november',
    // the 2026 municipal grant, from contract 41410-2/2025 (Edina 2026-11-14)
    '200.000 Ft egyszeri támogatás', 'az alapítvány 2026. évi működéséhez', '328/2025. (XII.11.) Kgy.', '41410-2/2025',
    'Elszámolás: 2027. január 31-ig', 'Támogató: Szombathely Megyei Jogú Város Önkormányzata',
  ]) assert.ok(shown.includes(t), t);
  assert.match(html, /<a href="\/kisfilmek"[^>]*>Eredmény: a háromrészes kisfilmsorozat<\/a>/);
  // every grant names its source; a linked source is a PDF on the site. The 2026 municipal grant's source is the
  // contract, which stays off the site (bank account number, signatures), so it is named without a link.
  for (const g of TAMOGATASOK) {
    const f = g.details.find((d) => d.text.startsWith('Forrás:'));
    assert.ok(f, g.title);
    if (f.href) assert.ok(f.href.endsWith('.pdf') && fs.existsSync(pub(f.href)), g.title);
  }
  assert.equal(TAMOGATASOK.filter((g) => !g.details.find((d) => d.text.startsWith('Forrás:')).href).length, 1);
});

test('the unsourced or contradicted claims are gone', () => {
  for (const bad of [
    'Városi Civil Alap', 'Szülőklub Fejlesztés', 'Több tucat',
    '800.000 Ft támogatási összeg', '715.000 Ft (100%-os támogatás)', '13 gyógypedagógusának',
    'Hatályos: 2024. január 1-től', 'Elfogadva: 2024. május', 'Elfogadva: 2023. május', '2022. évi',
    'akkreditált', 'maradéktalanul eleget teszünk',
    '11600006', // the contract's bank account number stays off the site
  ]) assert.ok(!shown.includes(bad), bad);
});

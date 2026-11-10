// Review 2026-11-10 (Marveen 6913, Péter GO 14675): Hungarian orthography in the interface texts and a
// serif fallback for the heading font. These guards fail when the old spelling or the sans fallback comes back.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const read = (f) => readFileSync(join(ROOT, f), 'utf8');
const walk = (dir) => readdirSync(join(ROOT, dir)).flatMap((n) => {
  const p = join(dir, n);
  return statSync(join(ROOT, p)).isDirectory() ? walk(p) : /\.tsx?$/.test(n) ? [p] : [];
});

// Kept on purpose: the official grant title, the editor's seed content (the foundation's own texts) and
// the editor code, where "&" is TypeScript.
const KEEP = ['Városi Civil Alap – Családi Nap & Szülőklub Fejlesztés'];
const SKIP_FILES = new Set(['src/content/seed.ts', 'src/components/editor/EditorApp.tsx']);

test('no "&" between words in a visible text of the site', () => {
  const hits = [];
  for (const f of walk('src')) {
    if (SKIP_FILES.has(f)) continue;
    read(f).split('\n').forEach((line, i) => {
      const code = line.replace(/\{\/\*.*?\*\/\}|\/\/.*$/g, '');
      if (/^\s*(\*|\/\*)/.test(code)) return;
      for (const m of code.matchAll(/["'>`]([^"'<>`{}]*[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű] & [A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű][^"'<>`{}]*)["'<`]/g)) {
        if (!KEEP.includes(m[1].trim())) hits.push(`${f}:${i + 1}: ${m[1].trim()}`);
      }
    });
  }
  assert.deepEqual(hits, []);
});

test('headings and labels in sentence case (a sample of the fixed ones)', () => {
  const expect = {
    'src/components/content/ProgramFilter.tsx': ["'Kiemelt események'", "'Nyári táborok'", "'Szülőklub és családok'"],
    'src/app/programok/page.tsx': ['Programjaink és rendezvényeink', 'Események és kezdeményezések'],
    'src/app/autizmus/page.tsx': ['A spektrum fő területei', 'Gyakran ismételt kérdések (FAQ)'],
    'src/app/dokumentumok/page.tsx': ['Hivatalos iratok és éves beszámolók'],
    'src/components/layout/Footer.tsx': ['Programok és események', 'Adatvédelem és kapcsolat'],
    'src/app/tamogatas/page.tsx': ['Támogatási központ'],
  };
  for (const [f, words] of Object.entries(expect)) for (const w of words) assert.ok(read(f).includes(w), `${f}: ${w}`);
  for (const old of ['Kiemelt Események', 'Nyári Táborok', 'Programjaink és Rendezvényeink', 'A Spektrum Fő Területei', 'Gyakori Kérdések']) {
    for (const f of walk('src')) if (!SKIP_FILES.has(f)) assert.ok(!read(f).includes(old), `${f}: ${old}`);
  }
});

test('the heading font falls back to a metric-matched serif, not Arial', () => {
  const layout = read('src/app/layout.tsx');
  assert.match(layout, /display: "optional"/); // the LCP decision stays
  assert.match(layout, /adjustFontFallback: "Times New Roman"/);
});

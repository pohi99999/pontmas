// After the i18n extraction (card c017f163) the visible texts of the public site live in
// messages/<locale>.json. A Hungarian text typed straight into a public page or component would show
// in Hungarian on /en and /de too, so this fails on one.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ACCENT = /[áéíóöőúüűÁÉÍÓÖŐÚÜŰ]/;
// Not visible site text, or Hungarian on purpose:
const SKIP = [
  'src/components/editor/', // the editor is Hungarian only
  'src/app/[locale]/adatkezeles/page.tsx', // the legal drafts stay Hungarian in every language (LegalLanguageNote)
  'src/app/[locale]/impresszum/page.tsx',
  'src/components/legal/LegalParts.tsx', // the review markers and the reviewer's source list belong to the Hungarian draft
];
const ALLOWED = ['PontMás']; // the brand name (the wordmark's alt text)

function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? files(p) : /\.tsx$/.test(e.name) ? [p] : [];
  });
}

export function hardcodedTexts(source) {
  const hits = [];
  // block comments ({/* … */} and /* … */) may span lines: blank them out, keeping the line numbers
  const blanked = source.replace(/\{?\/\*[\s\S]*?\*\/\}?/g, (c) => c.replace(/[^\n]/g, ' '));
  blanked.split('\n').forEach((line, i) => {
    const code = line.replace(/\{\/\*.*?\*\/\}|\/\/.*$/g, '');
    if (/^\s*(\*|\/\*)/.test(code)) return; // block comment lines
    for (const m of code.matchAll(/>([^<>{}]+)<|"([^"]*)"|'([^']*)'|`([^`]*)`|^\s*([^<>{}=;()]+)$/g)) {
      const text = (m[1] ?? m[2] ?? m[3] ?? m[4] ?? m[5] ?? '').trim();
      if (text && ACCENT.test(text) && !ALLOWED.includes(text)) hits.push(`${i + 1}: ${text}`);
    }
  });
  return hits;
}

test('no visible Hungarian text is hardcoded in a public page or component', () => {
  const hits = [];
  for (const f of [...files(path.resolve('src/app/[locale]')), ...files(path.resolve('src/components'))]) {
    const rel = path.relative(process.cwd(), f);
    if (SKIP.some((s) => rel.startsWith(s))) continue;
    for (const h of hardcodedTexts(fs.readFileSync(f, 'utf8'))) hits.push(`${rel}:${h}`);
  }
  assert.deepEqual(hits, []);
});

test('the guard is not vacuous: it finds a hardcoded text, and ignores comments and the brand name', () => {
  assert.deepEqual(hardcodedTexts('<h2 className="x">Rólunk írták</h2>'), ['1: Rólunk írták']);
  assert.deepEqual(hardcodedTexts('  title="Kapcsolatfelvétel"'), ['1: Kapcsolatfelvétel']);
  assert.deepEqual(hardcodedTexts('            Támogatás és adó 1%'), ['1: Támogatás és adó 1%']);
  assert.deepEqual(hardcodedTexts('// a megjegyzés magyar lehet\n{/* ez is */}\n{/* több\n   soros „Támogatás” */}\n<Image alt="PontMás" />'), []);
  assert.deepEqual(hardcodedTexts('{/* x */}\n<p>Hírek</p>'), ['2: Hírek']);
});

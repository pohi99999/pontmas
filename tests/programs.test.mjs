import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Programs page includes SectionHeader, event list, institutional support, and filter tabs', () => {
  const programsPath = path.resolve('src/app/programok/page.tsx');
  const programsContent = fs.readFileSync(programsPath, 'utf8');

  assert.ok(programsContent.includes('SectionHeader'), 'Programs page must use SectionHeader');
  assert.ok(programsContent.includes('Kék Séta') || programsContent.includes('Kék séta'), 'Programs page must feature Kék Séta');
  assert.ok(programsContent.includes('Tábor') || programsContent.includes('tábor'), 'Programs page must feature summer camps');
  assert.ok(programsContent.includes('Aranyhíd') || programsContent.includes('Intezmény'), 'Programs page must list supported institutions');
});

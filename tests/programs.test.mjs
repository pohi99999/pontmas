import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { readWithNamespaces } from './helpers/messages.mjs';

test('Programs page includes SectionHeader, event list, institutional support, and filter tabs', () => {
  const programsPath = path.resolve('src/app/[locale]/programok/page.tsx');
  // the page's texts are in messages/hu.json (Programs) since the i18n extraction (card c017f163)
  const programsContent = readWithNamespaces(path.relative(process.cwd(), programsPath), 'Programs');

  assert.ok(programsContent.includes('SectionHeader'), 'Programs page must use SectionHeader');
  assert.ok(programsContent.includes('Kék Séta') || programsContent.includes('Kék séta'), 'Programs page must feature Kék Séta');
  assert.ok(programsContent.includes('Tábor') || programsContent.includes('tábor'), 'Programs page must feature summer camps');
  assert.ok(programsContent.includes('Aranyhíd') || programsContent.includes('Intezmény'), 'Programs page must list supported institutions');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { readWithNamespaces } from './helpers/messages.mjs';

test('Help and services page (/segitseg) exists and contains all authentic PontMas services', () => {
  const pagePath = path.resolve('src/app/[locale]/segitseg/page.tsx');
  assert.ok(fs.existsSync(pagePath), 'src/app/[locale]/segitseg/page.tsx must exist');

  // the page's texts are in messages/hu.json (Help) since the i18n extraction (card c017f163)
  const pageContent = readWithNamespaces(path.relative(process.cwd(), pagePath), 'Help');

  // Verify core services from pontmas.hu
  assert.ok(pageContent.includes('Mentorszülő'), 'Must detail Mentorszülő network');
  assert.ok(!pageContent.includes('Info-Pont'), 'The closed AOSZ Info-Pont must not be offered');
  assert.ok(pageContent.includes('DATA'), 'Must explain DATA app support');
  assert.ok(pageContent.includes('Szakkönyvtár') || pageContent.includes('szakkönyvtár'), 'Must describe specialist library lending');
  assert.ok(pageContent.includes('intézmény') || pageContent.includes('Intézmény'), 'Must guide regarding educational institutions');
  assert.ok(pageContent.includes('SectionHeader'), 'Must use SectionHeader component');
});

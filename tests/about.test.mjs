import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { readWithNamespaces } from './helpers/messages.mjs';

test('About page includes history, leadership info, values, and SectionHeader', () => {
  const aboutPath = path.resolve('src/app/[locale]/rolunk/page.tsx');
  // the page's texts are in messages/hu.json (About) since the i18n extraction (card c017f163)
  const aboutContent = readWithNamespaces(path.relative(process.cwd(), aboutPath), 'About');

  assert.ok(aboutContent.includes('SectionHeader'), 'About page must use SectionHeader');
  assert.ok(aboutContent.includes('Pohánka Edit'), 'About page must present leadership (Pohánka Edit)');
  assert.ok(aboutContent.includes('AOSZ'), 'About page must detail AOSZ partnership');
  assert.ok(aboutContent.includes('2015'), 'About page must mention founding year 2015');
});

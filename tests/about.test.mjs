import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('About page includes history, leadership info, values, and SectionHeader', () => {
  const aboutPath = path.resolve('src/app/rolunk/page.tsx');
  const aboutContent = fs.readFileSync(aboutPath, 'utf8');

  assert.ok(aboutContent.includes('SectionHeader'), 'About page must use SectionHeader');
  assert.ok(aboutContent.includes('Pohánka Edit'), 'About page must present leadership (Pohánka Edit)');
  assert.ok(aboutContent.includes('AOSZ'), 'About page must detail AOSZ partnership');
  assert.ok(aboutContent.includes('2015'), 'About page must mention founding year 2015');
});

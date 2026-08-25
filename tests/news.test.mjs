import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('News and updates page (/hirek) exists and contains authentic PontMas news', () => {
  const pagePath = path.resolve('src/app/hirek/page.tsx');
  assert.ok(fs.existsSync(pagePath), 'src/app/hirek/page.tsx must exist');

  const pageContent = fs.readFileSync(pagePath, 'utf8');

  // Verify core news items from pontmas.hu
  assert.ok(pageContent.includes('Szülőklub') || pageContent.includes('SZÜLŐKLUB'), 'Must detail Parent Club events');
  assert.ok(pageContent.includes('Bárdosi Emőke') || pageContent.includes('Aranyhíd'), 'Must feature authentic speakers/partners');
  assert.ok(pageContent.includes('Skanzen') || pageContent.includes('Családi nap'), 'Must detail Family Day events');
  assert.ok(pageContent.includes('Önkéntes') || pageContent.includes('önkéntes'), 'Must include volunteer call');
  assert.ok(pageContent.includes('SectionHeader'), 'Must use SectionHeader component');
});

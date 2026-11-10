import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { readWithNamespaces } from './helpers/messages.mjs';

test('Media and press coverage page (/rolunk-irtak) exists and contains authentic articles', () => {
  const pagePath = path.resolve('src/app/[locale]/rolunk-irtak/page.tsx');
  assert.ok(fs.existsSync(pagePath), 'src/app/[locale]/rolunk-irtak/page.tsx must exist');

  // the page's texts are in messages/hu.json (Press) since the i18n extraction (card c017f163)
  const pageContent = readWithNamespaces(path.relative(process.cwd(), pagePath), 'Press');

  // Verify press features and testimonials
  assert.ok(pageContent.includes('Rólunk írták') || pageContent.includes('Sajtómegjelenések'), 'Must have main title');
  assert.ok(pageContent.includes('Köszönetnyilvánítás') || pageContent.includes('köszönet'), 'Must contain testimonials');
  assert.ok(pageContent.includes('Sajtó') || pageContent.includes('Média'), 'Must contain press mentions');
  assert.ok(pageContent.includes('SectionHeader'), 'Must use SectionHeader component');
});

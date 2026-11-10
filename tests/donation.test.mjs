import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { renderHtml, visibleText } from './helpers/render.mjs';

test('Donation page includes SectionHeader, CopyButton for 1% and bank details, and CSR guide', async () => {
  const donationPath = path.resolve('src/app/[locale]/tamogatas/page.tsx');
  const donationContent = fs.readFileSync(donationPath, 'utf8');

  assert.ok(donationContent.includes('SectionHeader'), 'Donation page must use SectionHeader');
  assert.ok(donationContent.includes('CopyButton'), 'Donation page must use CopyButton component');
  // what the visitor reads, not how the source spells it: the numbers come from src/lib/foundation.ts
  const shown = visibleText(await renderHtml('app/[locale]/tamogatas/page.tsx'));
  assert.ok(shown.includes('18654996-1-18'), 'Donation page must feature tax number');
  assert.ok(shown.includes('11600006-00000000-75701521'), 'Donation page must feature bank account');
  assert.ok(donationContent.includes('CSR') || donationContent.includes('Vállalat'), 'Donation page must include corporate support information');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Donation page includes SectionHeader, CopyButton for 1% and bank details, and CSR guide', () => {
  const donationPath = path.resolve('src/app/tamogatas/page.tsx');
  const donationContent = fs.readFileSync(donationPath, 'utf8');

  assert.ok(donationContent.includes('SectionHeader'), 'Donation page must use SectionHeader');
  assert.ok(donationContent.includes('CopyButton'), 'Donation page must use CopyButton component');
  assert.ok(donationContent.includes('18654996-1-18'), 'Donation page must feature tax number');
  assert.ok(donationContent.includes('11600006-00000000-75701521'), 'Donation page must feature bank account');
  assert.ok(donationContent.includes('CSR') || donationContent.includes('Vállalat'), 'Donation page must include corporate support information');
});

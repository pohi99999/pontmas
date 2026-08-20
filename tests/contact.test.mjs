import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Contact page includes SectionHeader, AOSZ Info-Pont details, and ContactForm', () => {
  const contactPath = path.resolve('src/app/kapcsolat/page.tsx');
  const contactContent = fs.readFileSync(contactPath, 'utf8');

  assert.ok(contactContent.includes('SectionHeader'), 'Contact page must use SectionHeader');
  assert.ok(contactContent.includes('AOSZ Info-Pont'), 'Contact page must feature AOSZ Info-Pont');
  assert.ok(contactContent.includes('Szombathely'), 'Contact page must contain Szombathely address');
  assert.ok(contactContent.includes('ContactForm'), 'Contact page must embed ContactForm');
  assert.ok(contactContent.includes('info@pontmas.hu'), 'Contact page must list email address');
});

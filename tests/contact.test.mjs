import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { renderHtml, visibleText } from './helpers/render.mjs';

test('Contact page includes SectionHeader, the contact person, and ContactForm', async () => {
  const contactPath = path.resolve('src/app/[locale]/kapcsolat/page.tsx');
  const contactContent = fs.readFileSync(contactPath, 'utf8');

  assert.ok(contactContent.includes('SectionHeader'), 'Contact page must use SectionHeader');
  // The AOSZ Info-Pont closed (Rumi Edina, 2026-11-03): the contact is her phone, not the office.
  assert.ok(!contactContent.includes('Info-Pont'), 'Contact page must not feature the closed AOSZ Info-Pont');
  const html = await renderHtml('app/[locale]/kapcsolat/page.tsx');
  assert.ok(visibleText(html).includes('Rumi Edina') && html.includes('href="tel:+36209698715"'), 'Contact page must list the contact person and phone');
  assert.ok(visibleText(html).includes('9700 Szombathely'), 'Contact page must contain Szombathely address');
  assert.ok(contactContent.includes('ContactForm'), 'Contact page must embed ContactForm');
  // No mailbox behind info@pontmas.hu yet (no MX), and the two Gmail addresses must not be published.
  assert.ok(!contactContent.includes('info@pontmas.hu'), 'Contact page must not list info@pontmas.hu');
});

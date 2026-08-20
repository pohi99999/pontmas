import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Autism page includes SectionHeader, spectrum traits, facts vs myths, and parent guide', () => {
  const autismPath = path.resolve('src/app/autizmus/page.tsx');
  const autismContent = fs.readFileSync(autismPath, 'utf8');

  assert.ok(autismContent.includes('SectionHeader'), 'Autism page must use SectionHeader');
  assert.ok(autismContent.includes('Szenzoros'), 'Autism page must discuss sensory processing');
  assert.ok(autismContent.includes('Tények és Tévhitek') || autismContent.includes('Tévhit'), 'Autism page must feature facts and myths');
  assert.ok(autismContent.includes('tanacsok') || autismContent.includes('Szülői'), 'Autism page must include advice for parents');
  assert.ok(autismContent.includes('FAQ') || autismContent.includes('Gyakori kérdések'), 'Autism page must include FAQs');
});

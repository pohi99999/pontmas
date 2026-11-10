import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { renderHtml, visibleText } from './helpers/render.mjs';

test('Home page features full-featured hero, stats, pillars, 1% callout, and AOSZ affiliation', async () => {
  const homePath = path.resolve('src/app/[locale]/page.tsx');
  const homeContent = fs.readFileSync(homePath, 'utf8');

  assert.ok(homeContent.includes('SectionHeader'), 'Home page must use SectionHeader');
  assert.ok(homeContent.includes('FeatureCard'), 'Home page must use FeatureCard');
  assert.ok(homeContent.includes('CopyButton'), 'Home page must include 1% CopyButton');
  // what the visitor reads: the texts are in messages/hu.json since the i18n extraction (card c017f163)
  const shown = visibleText(await renderHtml('app/[locale]/page.tsx'));
  assert.ok(shown.includes('18654996-1-18'), 'Home page must feature tax number');
  assert.ok(shown.includes('AOSZ'), 'Home page must reference AOSZ affiliation');
});

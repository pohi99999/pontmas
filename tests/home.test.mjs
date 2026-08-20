import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Home page features full-featured hero, stats, pillars, 1% callout, and AOSZ affiliation', () => {
  const homePath = path.resolve('src/app/page.tsx');
  const homeContent = fs.readFileSync(homePath, 'utf8');

  assert.ok(homeContent.includes('SectionHeader'), 'Home page must use SectionHeader');
  assert.ok(homeContent.includes('FeatureCard'), 'Home page must use FeatureCard');
  assert.ok(homeContent.includes('CopyButton'), 'Home page must include 1% CopyButton');
  assert.ok(homeContent.includes('18654996-1-18'), 'Home page must feature tax number');
  assert.ok(homeContent.includes('AOSZ'), 'Home page must reference AOSZ affiliation');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Audit: All main routes and layout contain semantic structure and metadata', () => {
  const routes = [
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'src/app/rolunk/page.tsx',
    'src/app/autizmus/page.tsx',
    'src/app/programok/page.tsx',
    'src/app/tamogatas/page.tsx',
    'src/app/kapcsolat/page.tsx',
    'src/app/dokumentumok/page.tsx',
  ];

  for (const route of routes) {
    const fullPath = path.resolve(route);
    assert.ok(fs.existsSync(fullPath), `Route file ${route} must exist`);
    const content = fs.readFileSync(fullPath, 'utf8');
    assert.ok(content.length > 100, `Route file ${route} must have substantial content`);
  }
});

test('Audit: Accessibility & SEO prerequisites in Layout', () => {
  const layoutPath = path.resolve('src/app/layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');

  assert.ok(layoutContent.includes('lang="hu"'), 'Root HTML must specify lang="hu"');
  assert.ok(layoutContent.includes('schema.org'), 'Layout must provide JSON-LD schema.org metadata');
  assert.ok(layoutContent.includes('SensoryProvider'), 'Layout must wrap app in SensoryProvider');
});

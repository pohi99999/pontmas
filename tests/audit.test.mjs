import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Audit: All main routes and layout contain semantic structure and metadata', () => {
  const routes = [
    'src/app/[locale]/layout.tsx',
    'src/components/layout/SiteShell.tsx',
    'src/app/[locale]/page.tsx',
    'src/app/[locale]/rolunk/page.tsx',
    'src/app/[locale]/autizmus/page.tsx',
    'src/app/[locale]/programok/page.tsx',
    'src/app/[locale]/tamogatas/page.tsx',
    'src/app/[locale]/kapcsolat/page.tsx',
    'src/app/[locale]/dokumentumok/page.tsx',
    'src/app/[locale]/segitseg/page.tsx',
    'src/app/[locale]/rolunk-irtak/page.tsx',
    'src/app/[locale]/hirek/page.tsx',
  ];

  for (const route of routes) {
    const fullPath = path.resolve(route);
    assert.ok(fs.existsSync(fullPath), `Route file ${route} must exist`);
    const content = fs.readFileSync(fullPath, 'utf8');
    assert.ok(content.length > 100, `Route file ${route} must have substantial content`);
  }
});

test('Audit: Accessibility & SEO prerequisites in Layout', () => {
  // the page frame moved to SiteShell when the pages moved under [locale] (card c017f163); <html lang>
  // is the page's language now, measured on the rendered pages in tests/i18n.test.mjs
  const layoutPath = path.resolve('src/components/layout/SiteShell.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');

  assert.ok(layoutContent.includes('<html lang={lang}'), 'Root HTML must specify the page language');
  // the schema.org block itself is built in src/lib/foundation.ts (tests/foundation.test.mjs)
  assert.ok(layoutContent.includes('foundationJsonLd()') && layoutContent.includes('application/ld+json'), 'Layout must provide JSON-LD schema.org metadata');
  assert.ok(layoutContent.includes('SensoryProvider'), 'Layout must wrap app in SensoryProvider');
});

// sitemap.xml and robots.txt (card c017f163).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { src } from './helpers/load.mjs';

const site = await src('lib/site.ts');
const { LEGAL_DRAFT } = await src('lib/legal.ts');
const { PUBLISHED_LOCALES } = await src('i18n/routing.ts');
const sitemap = (await src('app/sitemap.ts')).default;
const robots = (await src('app/robots.ts')).default;

// The real list of pages, from the file system: every page.tsx under src/app outside the editor.
function pagesOnDisk(dir = path.resolve('src/app'), base = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (!e.isDirectory()) return e.name === 'page.tsx' ? [base || '/'] : [];
    if (e.name === 'api' || e.name === 'szerkeszto' || e.name.startsWith('_')) return [];
    // the language segment is not part of the address: /[locale]/autizmus is served as /autizmus
    return pagesOnDisk(path.join(dir, e.name), e.name === '[locale]' ? base : `${base}/${e.name}`);
  });
}

test('PUBLIC_PATHS is exactly the pages on disk (a new page cannot be left out of the sitemap)', () => {
  assert.deepEqual([...site.PUBLIC_PATHS].sort(), pagesOnDisk().sort());
});

test('the sitemap lists every public page once, absolute, on the site address, without the drafts', () => {
  const urls = sitemap().map((e) => e.url);
  assert.equal(new Set(urls).size, urls.length, 'no duplicates');
  for (const u of urls) assert.ok(u.startsWith(`${site.SITE_URL}/`), u);
  const paths = urls.map((u) => u.slice(site.SITE_URL.length).replace(/^\/$/, '/'));
  const pages = site.PUBLIC_PATHS.filter((p) => !(LEGAL_DRAFT && ['/adatkezeles', '/impresszum'].includes(p)));
  // every page in every published language (Hungarian unprefixed, the others under /en, /de)
  const expected = PUBLISHED_LOCALES.flatMap((l) => pages.map((p) => site.localizedPath(p, l)));
  assert.deepEqual(paths.sort(), [...expected].sort());
  const bare = paths.map((p) => p.replace(/^\/(en|de)(?=\/|$)/, '') || '/');
  for (const p of ['/szerkeszto', '/szerkeszto/belepes']) assert.ok(!bare.includes(p), `${p} is not listed`);
  if (LEGAL_DRAFT) for (const p of ['/adatkezeles', '/impresszum']) assert.ok(!bare.includes(p), `draft ${p} is not listed in any language`);
  assert.ok(sitemap().every((e) => !('lastModified' in e)), 'no build-date lastModified');
});

test('robots.txt keeps crawlers out of the editor and the API, and points to the sitemap', () => {
  const r = robots();
  assert.deepEqual(r.rules, { userAgent: '*', allow: '/', disallow: ['/szerkeszto', '/api/'] });
  assert.equal(r.sitemap, `${site.SITE_URL}/sitemap.xml`);
});

test('SITE_URL: pontmas.hu by default, overridable without a trailing slash', async () => {
  assert.equal(site.SITE_URL, process.env.SITE_URL ? process.env.SITE_URL.replace(/\/+$/, '') : 'https://pontmas.hu');
  const { execFileSync } = await import('node:child_process');
  const probe = `import('${path.resolve('tests/helpers/load.mjs')}').then(async ({ src }) => console.log((await src('lib/site.ts')).SITE_URL))`;
  const out = execFileSync(process.execPath, ['--input-type=module', '-e', probe], { env: { ...process.env, SITE_URL: 'https://pontmas.vercel.app/' }, encoding: 'utf8' });
  assert.equal(out.trim().split('\n').pop(), 'https://pontmas.vercel.app');
});

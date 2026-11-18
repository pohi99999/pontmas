// sitemap.xml and robots.txt (T3, Péter 16967 and 16977): built from the site's address and two lists.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { src } from './helpers/load.mjs';

const { SITE_URL, pageUrl } = await src('lib/site.ts');
const { PUBLIC_PATHS, PRIVATE_PREFIXES } = await src('lib/sitePages.ts');
const sitemap = (await src('app/sitemap.ts')).default;
const robots = (await src('app/robots.ts')).default;

// The real list of pages, from the file system: every page.tsx under src/app outside the editor and the API.
function pagesOnDisk(dir = path.resolve('src/app'), base = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (!e.isDirectory()) return e.name === 'page.tsx' ? [base || '/'] : [];
    if (e.name === 'api' || e.name === 'szerkeszto' || e.name.startsWith('_')) return [];
    return pagesOnDisk(path.join(dir, e.name), `${base}/${e.name}`);
  });
}

test('the list of public pages is exactly the pages on disk: a new page cannot be left out of the sitemap', () => {
  assert.ok(pagesOnDisk().length >= 12, 'the scan found too few pages');
  assert.deepEqual([...PUBLIC_PATHS].sort(), pagesOnDisk().sort());
});

test('the sitemap lists every public page once, with the address its canonical link names, and nothing private', () => {
  const urls = sitemap().map((e) => e.url);
  assert.equal(new Set(urls).size, urls.length, 'no duplicates');
  assert.deepEqual(urls, PUBLIC_PATHS.map((p) => pageUrl(p)));
  for (const u of urls) assert.ok(u === SITE_URL || u.startsWith(`${SITE_URL}/`), u);
  for (const u of urls) for (const prefix of PRIVATE_PREFIXES) assert.ok(!u.slice(SITE_URL.length).startsWith(prefix.replace(/\/$/, '')), `${u} is private`);
  assert.ok(sitemap().every((e) => !('lastModified' in e)), 'no build-date lastModified');
});

test('robots.txt lets everything be crawled but the editor and the API, and names the sitemap on the site address', () => {
  const r = robots();
  assert.deepEqual(r.rules, { userAgent: '*', allow: '/', disallow: ['/szerkeszto', '/api/'] });
  assert.equal(r.sitemap, `${SITE_URL}/sitemap.xml`);
});

test('the editor and the API are real folders: the rule cannot silently point at nothing', () => {
  assert.ok(fs.existsSync(path.resolve('src/app/szerkeszto')), 'src/app/szerkeszto');
  assert.ok(fs.existsSync(path.resolve('src/app/api')), 'src/app/api');
});

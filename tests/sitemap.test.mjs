// sitemap.xml and robots.txt (T3, Péter 16967 and 16977): built from the site's address and two lists.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { src } from './helpers/load.mjs';

const { SITE_URL, pageUrl } = await src('lib/site.ts');
const { PUBLIC_PATHS, PRIVATE_PREFIXES, DRAFT_PATHS } = await src('lib/sitePages.ts');
const { LEGAL_DRAFT } = await src('lib/legal.ts');
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
  assert.ok(pagesOnDisk().length >= 14, 'the scan found too few pages');
  assert.deepEqual([...PUBLIC_PATHS].sort(), pagesOnDisk().sort());
});

test('the sitemap lists every public page once, with the address its canonical link names, and nothing private', () => {
  const urls = sitemap().map((e) => e.url);
  assert.equal(new Set(urls).size, urls.length, 'no duplicates');
  assert.deepEqual(urls, PUBLIC_PATHS.filter((p) => !DRAFT_PATHS.includes(p)).map((p) => pageUrl(p)));
  for (const u of urls) assert.ok(u === SITE_URL || u.startsWith(`${SITE_URL}/`), u);
  for (const u of urls) for (const prefix of PRIVATE_PREFIXES) assert.ok(!u.slice(SITE_URL.length).startsWith(prefix.replace(/\/$/, '')), `${u} is private`);
  assert.ok(sitemap().every((e) => !('lastModified' in e)), 'no build-date lastModified');
});

test('a draft page is not listed: the legal pages say noindex while they are drafts, and the sitemap does not ask for the opposite', async () => {
  assert.equal(LEGAL_DRAFT, true, 'the drafts were approved: this test and DRAFT_PATHS are for the time before that');
  assert.deepEqual([...DRAFT_PATHS], ['/adatkezeles', '/impresszum']);
  const urls = sitemap().map((e) => e.url);
  assert.equal(urls.length, PUBLIC_PATHS.length - 2);
  for (const page of DRAFT_PATHS) {
    assert.ok(!urls.includes(pageUrl(page)), `${page} is listed`);
    const { metadata } = await src(`app${page}/page.tsx`);
    assert.deepEqual(metadata.robots, { index: false, follow: false }, `${page} says noindex`);
  }
  // and nothing else says noindex among the listed ones
  for (const page of PUBLIC_PATHS.filter((p) => !DRAFT_PATHS.includes(p) && p !== '/')) {
    const dir = page.slice(1);
    const own = (await src(`app/${dir}/page.tsx`)).metadata;
    const meta = own ?? (fs.existsSync(path.resolve('src/app', dir, 'layout.tsx')) ? (await src(`app/${dir}/layout.tsx`)).metadata : undefined);
    assert.equal(meta?.robots, undefined, `${page} is listed and says something about robots`);
  }
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

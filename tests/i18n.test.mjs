// The language skeleton (card c017f163): routing, the proxy, per-page canonical and hreflang, the
// sitemap, the message files, and that an unpublished language is never served.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { src } from './helpers/load.mjs';
import { renderElement } from './helpers/render.mjs';

const { routing, LOCALES, PUBLISHED_LOCALES, isPublished } = await src('i18n/routing.ts');
const { pageLocale } = await src('i18n/page.ts');
const site = await src('lib/site.ts');
const sitemap = (await src('app/sitemap.ts')).default;
const { config: proxyConfig } = await src('proxy.ts');
const { createElement: h } = await import('react');

const URL = site.SITE_URL;

test('routing: Hungarian at the root, en and de under a prefix, no redirect by browser language', () => {
  assert.deepEqual([...LOCALES], ['hu', 'en', 'de']);
  assert.equal(routing.defaultLocale, 'hu');
  assert.equal(routing.localePrefix, 'as-needed');
  assert.equal(routing.localeDetection, false);
  for (const l of PUBLISHED_LOCALES) assert.ok(LOCALES.includes(l));
  assert.ok(PUBLISHED_LOCALES.includes('hu'));
});

test('an unpublished language is never served: its pages answer 404', async () => {
  for (const l of LOCALES) {
    if (isPublished(l)) assert.equal(await pageLocale(Promise.resolve({ locale: l })), l);
    else await assert.rejects(() => pageLocale(Promise.resolve({ locale: l })), /NEXT_NOT_FOUND/, l);
  }
  await assert.rejects(() => pageLocale(Promise.resolve({ locale: 'fr' })), /NEXT_NOT_FOUND/);
});

test('paths: Hungarian unchanged, the others prefixed; hreflang lists only published languages and x-default', () => {
  assert.equal(site.localizedPath('/', 'hu'), '/');
  assert.equal(site.localizedPath('/autizmus', 'hu'), '/autizmus');
  assert.equal(site.localizedPath('/', 'en'), '/en');
  assert.equal(site.localizedPath('/autizmus', 'de'), '/de/autizmus');
  const links = site.hreflangLinks('/autizmus');
  assert.deepEqual(Object.keys(links).sort(), [...PUBLISHED_LOCALES, 'x-default'].sort());
  assert.equal(links['x-default'], `${URL}/autizmus`);
  assert.equal(links.hu, `${URL}/autizmus`);
});

// Every page under [locale], found on disk, with the address it is served at.
function localePages(dir = path.resolve('src/app/[locale]'), base = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? localePages(path.join(dir, e.name), `${base}/${e.name}`) : e.name === 'page.tsx' ? [[base || '/', path.join(dir, e.name)]] : []);
}

test('every page sets its own canonical address and hreflang (an inherited "/" canonical is a bug)', async () => {
  const pages = localePages();
  assert.ok(pages.length >= 12);
  for (const [route, file] of pages) {
    const rel = path.relative(path.resolve('src'), file);
    const folder = path.dirname(rel);
    // a client page gets its metadata from the layout next to it
    const mod = (await src(rel)).generateMetadata ? await src(rel) : await src(path.join(folder, 'layout.tsx'));
    assert.equal(typeof mod.generateMetadata, 'function', `${route} has generateMetadata`);
    for (const l of PUBLISHED_LOCALES) {
      const meta = await mod.generateMetadata({ params: Promise.resolve({ locale: l }) });
      assert.equal(meta.alternates?.canonical, URL + (site.localizedPath(route, l) === '/' ? '/' : site.localizedPath(route, l)), `${route} (${l}) canonical`);
      assert.deepEqual(meta.alternates.languages, site.hreflangLinks(route), `${route} hreflang`);
    }
  }
});

test('the [locale] layout sets no canonical of its own (it would be inherited by every page)', async () => {
  const meta = await (await src('app/[locale]/layout.tsx')).generateMetadata({ params: Promise.resolve({ locale: 'hu' }) });
  assert.equal(meta.alternates, undefined);
  assert.equal(meta.openGraph.locale, 'hu_HU');
});

test('the proxy leaves the API, the editor and every file alone, and handles the pages', () => {
  const re = new RegExp(`^${proxyConfig.matcher[0]}$`);
  for (const p of ['/', '/autizmus', '/en', '/de/rolunk', '/kapcsolat']) assert.ok(re.test(p), `${p} goes through the proxy`);
  for (const p of ['/api/chat', '/api/kapcsolat', '/szerkeszto', '/szerkeszto/belepes', '/sitemap.xml', '/robots.txt', '/icon.png', '/_next/static/x.js', '/brand/pontmas-jel.svg'])
    assert.ok(!re.test(p), `${p} is not touched`);
});

test('sitemap: every indexed page in every published language, each with its hreflang links', () => {
  const entries = sitemap();
  assert.equal(entries.length, site.indexedPaths().length * PUBLISHED_LOCALES.length);
  for (const e of entries) assert.ok(e.alternates?.languages?.['x-default'], e.url);
  const urls = entries.map((e) => e.url);
  for (const l of LOCALES.filter((x) => !PUBLISHED_LOCALES.includes(x))) assert.ok(!urls.some((u) => u.startsWith(`${URL}/${l}`)), `no ${l} page listed`);
});

test('message files: the three languages have exactly the same keys', () => {
  const keys = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? keys(v, `${p}${k}.`) : [`${p}${k}`])).sort();
  const hu = keys(JSON.parse(fs.readFileSync(path.resolve('messages/hu.json'), 'utf8')));
  assert.ok(hu.length > 0);
  for (const l of ['en', 'de']) assert.deepEqual(keys(JSON.parse(fs.readFileSync(path.resolve(`messages/${l}.json`), 'utf8'))), hu, l);
});

test('<html lang> is the page language', async () => {
  const SiteShell = (await src('components/layout/SiteShell.tsx')).default;
  const hu = JSON.parse(fs.readFileSync(path.resolve('messages/hu.json'), 'utf8'));
  for (const lang of ['hu', 'en', 'de']) {
    const html = renderElement(h(SiteShell, { lang, messages: hu }, h('p', null, 'x')));
    assert.match(html, new RegExp(`^<html lang="${lang}"`), lang);
  }
});

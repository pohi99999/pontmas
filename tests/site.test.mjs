// The site's own address comes from one place, src/lib/site.ts (Péter 16977, 2026-11-18), and every
// public page states its own canonical link and og:url through it.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { src } from './helpers/load.mjs';

const { DEFAULT_SITE_URL, SITE_URL, siteUrlFrom, pageUrl, pageMetadata, openGraphFor, SHARE_IMAGE } = await src('lib/site.ts');
const { foundationJsonLd } = await src('lib/foundation.ts');

const APP = path.resolve('src/app');
/** Every public page on disk: a page.tsx outside the editor and the API. '/' for the root. */
const publicPages = () => {
  const out = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (dir === APP && (e.name === 'api' || e.name === 'szerkeszto')) continue;
        walk(full);
      } else if (e.name === 'page.tsx') {
        out.push('/' + path.relative(APP, dir).split(path.sep).join('/'));
      }
    }
  };
  walk(APP);
  return out.map((p) => (p === '/' ? '/' : p)).sort();
};

test('the address is today\'s unless the setting names another, and a mistyped setting stops the build', () => {
  assert.equal(DEFAULT_SITE_URL, 'https://pontmas.vercel.app');
  for (const unset of [undefined, null, '', '   ']) assert.equal(siteUrlFrom(unset), DEFAULT_SITE_URL);
  assert.equal(siteUrlFrom('https://pontmas.hu'), 'https://pontmas.hu');
  assert.equal(siteUrlFrom(' https://pontmas.hu/ '), 'https://pontmas.hu');
  assert.equal(siteUrlFrom('https://www.pontmas.hu'), 'https://www.pontmas.hu');
  for (const bad of ['pontmas.hu', 'http://pontmas.hu', 'https://pontmas.hu/hu', 'https://pontmas.hu/?a=1', 'https://pontmas.hu/#x', 'https://user:pw@pontmas.hu', 'nem cím']) {
    assert.throws(() => siteUrlFrom(bad), /NEXT_PUBLIC_SITE_URL/, `"${bad}" must be refused`);
  }
});

test('a page\'s address is the site\'s address and its path, with no trailing slash', () => {
  assert.equal(pageUrl('/', 'https://pontmas.hu'), 'https://pontmas.hu');
  assert.equal(pageUrl('/hirek', 'https://pontmas.hu'), 'https://pontmas.hu/hirek');
  assert.equal(pageUrl('/hirek/', 'https://pontmas.hu'), 'https://pontmas.hu/hirek');
  assert.equal(pageUrl('/hirek'), `${SITE_URL}/hirek`);
  for (const bad of ['hirek', '/hirek?x=1', '/hirek#a', '']) assert.throws(() => pageUrl(bad), /page path/);
});

test('the Open Graph block is whole on every page: Next.js does not merge it with the layout\'s', () => {
  const og = openGraphFor('/hirek', { title: 'Cím', description: 'Leírás' });
  assert.deepEqual(og, { title: 'Cím', description: 'Leírás', url: `${SITE_URL}/hirek`, siteName: 'PontMás Alapítvány', locale: 'hu_HU', type: 'website' });
  assert.deepEqual(openGraphFor('/', { title: 'Cím', description: 'Leírás', image: true }).images, [SHARE_IMAGE]);
  // a page with no texts of its own keeps the layout's, with the share image the layout's block had
  const plain = pageMetadata('/rolunk');
  assert.equal(plain.alternates.canonical, `${SITE_URL}/rolunk`);
  assert.deepEqual(plain.openGraph.images, [SHARE_IMAGE]);
  assert.equal(plain.title, undefined);
  // the file the share image names exists, and is the size it says
  assert.ok(fs.existsSync(path.join(APP, 'opengraph-image.png')), 'src/app/opengraph-image.png');
  assert.equal(fs.readFileSync(path.join(APP, 'opengraph-image.alt.txt'), 'utf8').trim(), SHARE_IMAGE.alt);
  const png = fs.readFileSync(path.join(APP, 'opengraph-image.png'));
  assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [SHARE_IMAGE.width, SHARE_IMAGE.height]);
});

test('every public page on disk states its own canonical link and og:url, and they are its own address', async () => {
  const pages = publicPages();
  assert.ok(pages.length >= 12, `only ${pages.length} pages found: the scan is broken`);
  for (const page of pages) {
    const dir = page === '/' ? '' : page.slice(1) + '/';
    // a client page cannot export metadata: its layout in the same folder carries it
    const own = (await src(`app/${dir}page.tsx`)).metadata;
    const fromLayout = dir !== '' && fs.existsSync(path.join(APP, dir, 'layout.tsx')) ? (await src(`app/${dir}layout.tsx`)).metadata : undefined;
    const metadata = own ?? fromLayout;
    assert.ok(metadata, `${page}: no metadata in the page or in a layout beside it`);
    assert.equal(metadata.alternates?.canonical, pageUrl(page), `${page}: canonical`);
    assert.equal(metadata.openGraph?.url, pageUrl(page), `${page}: og:url`);
    assert.equal(metadata.openGraph?.siteName, 'PontMás Alapítvány', `${page}: the Open Graph block is not whole`);
    assert.ok(metadata.openGraph?.title && metadata.openGraph?.description, `${page}: share title and description`);
  }
});

test('the root layout names no address of its own (a page would inherit it), and hands the site address to the JSON-LD block', () => {
  // read as text: the layout imports next/font, which node cannot load outside a build
  const layout = fs.readFileSync(path.join(APP, 'layout.tsx'), 'utf8');
  const block = layout.slice(layout.indexOf('export const metadata'), layout.indexOf('export default function'));
  assert.ok(block.includes('metadataBase: new URL(SITE_URL)'), 'metadataBase');
  assert.ok(!/\balternates\b|\bcanonical\b|\burl:/.test(block), 'the layout\'s metadata names an address');
  assert.ok(layout.includes('foundationJsonLd(SITE_URL)'), 'the JSON-LD block gets SITE_URL');
  assert.equal(foundationJsonLd('https://pontmas.hu').url, 'https://pontmas.hu');
});

test('no other file under src/ spells an address of the site: a change cannot miss one', () => {
  const files = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(path.join(dir, e.name)) : /\.(ts|tsx|css|json)$/.test(e.name) ? [path.join(dir, e.name)] : []);
  const offenders = files(path.resolve('src'))
    .filter((f) => path.relative(path.resolve('src'), f) !== path.join('lib', 'site.ts'))
    .filter((f) => /https?:\/\/(www\.)?pontmas\.(hu|vercel\.app)/.test(fs.readFileSync(f, 'utf8')))
    .map((f) => path.relative(process.cwd(), f));
  assert.deepEqual(offenders, []);
});

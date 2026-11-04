// The editor, part 1: the content model, the seed and the public pages (2026-11-04).
// - The seed is main's items, verbatim; with an empty, missing or failing store the two public
//   pages render exactly main's item texts.
// - The model has no field for the bank account, tax number, registration number, address or
//   phone, and an image is shown only with the child photo declaration.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { src } from './helpers/load.mjs';
import { MAIN_NEWS, MAIN_PROGRAMS } from './fixtures/main-items.mjs';
import { htmlText, imageFor, inOrder } from './helpers/fixtures.mjs';

const { renderToStaticMarkup } = await import('react-dom/server');
const { createElement: h } = await import('react');
const seed = await src('content/seed.ts');
const types = await src('content/types.ts');
const pub = await src('content/public.ts');
const { validateContent } = await src('content/validate.ts');
const { MemoryContentStore } = await src('content/store.ts');
const cards = await src('components/content/ContentCards.tsx');

const NEW_KEYS = ['id', 'publishedAt', 'hidden'];
const strip = (items) => items.map((it) => Object.fromEntries(Object.entries(it).filter(([k]) => !NEW_KEYS.includes(k))));

async function renderPage(p) {
  const saved = [process.env.BLOB_READ_WRITE_TOKEN, process.env.BLOB_CONTENT_READ_WRITE_TOKEN];
  delete process.env.BLOB_READ_WRITE_TOKEN; // no store configured: the page must show the seed
  delete process.env.BLOB_CONTENT_READ_WRITE_TOKEN;
  try {
    const mod = await src(p);
    return renderToStaticMarkup(await mod.default());
  } finally {
    if (saved[0] !== undefined) process.env.BLOB_READ_WRITE_TOKEN = saved[0];
    if (saved[1] !== undefined) process.env.BLOB_CONTENT_READ_WRITE_TOKEN = saved[1];
  }
}

test('seed: the items of main, verbatim, plus only id, publishedAt and hidden', () => {
  assert.deepEqual(strip(seed.SEED_NEWS), MAIN_NEWS);
  assert.deepEqual(strip(seed.SEED_PROGRAMS), MAIN_PROGRAMS);
  for (const it of [...seed.SEED_NEWS, ...seed.SEED_PROGRAMS]) {
    assert.equal(it.hidden, false);
    assert.match(it.publishedAt, /^\d{4}-\d{2}-\d{2}$/);
  }
  const v = validateContent(seed.SEED_CONTENT);
  assert.ok(v.ok, JSON.stringify(v.errors));
  assert.deepEqual(v.value, seed.SEED_CONTENT, 'the seed passes validation unchanged');
});

test('/hirek with no store renders exactly the item texts of main', async () => {
  const html = await renderPage('app/hirek/page.tsx');
  const text = htmlText(html);
  const [first, ...rest] = MAIN_NEWS;
  inOrder(assert, text, [first.date, first.title, first.location, first.speaker, first.description, ...first.highlights, first.actionText]);
  assert.ok(html.includes(`href="${first.actionHref}"`) && html.includes(`href="${first.googleFormHref}"`));
  inOrder(assert, text, rest.flatMap((n) => [n.badge, n.date, n.title, n.description, ...n.highlights, n.actionText]));
  for (const n of rest) assert.ok(html.includes(`href="${n.actionHref}"`), n.actionHref);
  assert.equal((html.match(/<article/g) ?? []).length, rest.length, 'one card per item after the banner');
  assert.ok(!html.includes('<img'), 'no image on main');
});

test('/programok with no store renders exactly the item texts of main', async () => {
  const html = await renderPage('app/programok/page.tsx');
  const text = htmlText(html);
  inOrder(assert, text, MAIN_PROGRAMS.flatMap((p) => [p.badge, p.title, p.date, p.location, p.description, ...p.highlights]));
  assert.equal((html.match(/Érdeklődés &amp; Részletek/g) ?? []).length, MAIN_PROGRAMS.length);
  for (const label of ['Összes program', 'Kiemelt Események', 'Nyári Táborok', 'Szülőklub &amp; Családok']) assert.ok(html.includes(label), label);
});

test('fallback: empty, failing or invalid store content means the seed', async () => {
  const empty = new MemoryContentStore();
  assert.deepEqual(await pub.readContentSafely(() => empty.read()), { content: seed.SEED_CONTENT, source: 'seed' });
  const failing = new MemoryContentStore({ failing: true });
  assert.deepEqual(await pub.readContentSafely(() => failing.read()), { content: seed.SEED_CONTENT, source: 'seed' });
  const broken = { ...seed.SEED_CONTENT, news: [{ title: '<script>' }] };
  assert.equal((await pub.readContentSafely(async () => broken)).source, 'seed');
  const good = await pub.readContentSafely(async () => ({ ...seed.SEED_CONTENT, news: seed.SEED_NEWS.slice(1) }));
  assert.equal(good.source, 'store');
  assert.equal(good.content.news.length, MAIN_NEWS.length - 1);
});

test('the banner is the first visible featured item; hidden items are not shown', () => {
  const news = seed.SEED_NEWS.map((n) => ({ ...n }));
  let s = pub.splitNews(news);
  assert.equal(s.featured.id, news[0].id);
  assert.deepEqual(s.rest.map((n) => n.id), news.slice(1).map((n) => n.id));
  news[0].hidden = true;
  s = pub.splitNews(news);
  assert.equal(s.featured, null);
  assert.equal(s.rest.length, 3);
  const progs = seed.SEED_PROGRAMS.map((p, i) => ({ ...p, hidden: i === 1 }));
  assert.deepEqual(pub.visiblePrograms(progs).map((p) => p.id), progs.filter((_, i) => i !== 1).map((p) => p.id));
});

test('NOT editable, ever: the model has no bank, tax, registration, address or phone field', () => {
  const forbidden = /bank|szaml|számla|account|iban|ado|adó|tax|nyilvantart|nyilvántart|regist|cegjegyz|cím$|^cim|address|street|zip|irsz|phone|telefon|tel$|legal|jogi|privacy|adatved|adatvéd/i;
  const all = [...types.CONTENT_FIELDS, ...types.NEWS_FIELDS, ...types.PROGRAM_FIELDS, ...types.IMAGE_FIELDS, ...types.DECLARATION_FIELDS];
  for (const k of all) assert.ok(!forbidden.test(k), `forbidden field in the model: ${k}`);
  // and the validator refuses such a key anywhere in the content
  for (const key of ['bankAccount', 'taxNumber', 'registrationNumber', 'address', 'phone']) {
    const top = validateContent({ ...seed.SEED_CONTENT, [key]: 'x' });
    assert.equal(top.ok, false, key);
    const inItem = validateContent({ ...seed.SEED_CONTENT, news: [{ ...seed.SEED_NEWS[0], [key]: 'x' }] });
    assert.equal(inItem.ok, false, key);
    assert.ok(inItem.errors.some((e) => e.path.endsWith(key)));
  }
});

test('the protected data stays in the code and is not part of the editable seed', () => {
  const donation = fs.readFileSync(path.resolve('src/app/tamogatas/page.tsx'), 'utf8');
  const account = donation.match(/\d{8}-\d{8}(?:-\d{8})?/)?.[0];
  const tax = donation.match(/\d{8}-\d-\d{2}/)?.[0];
  assert.ok(account && tax, 'the donation page still holds the account and the tax number');
  const seedJson = JSON.stringify(seed.SEED_CONTENT);
  assert.ok(!seedJson.includes(account) && !seedJson.includes(tax));
  assert.ok(!seedJson.includes('+36 20'), 'no phone number in the editable content');
});

test('an image renders only with the child photo declaration, as a plain lazy <img>', () => {
  const draft = { ...seed.SEED_NEWS[1], image: imageFor(null, { declared: false }) };
  const declared = { ...seed.SEED_NEWS[1], image: imageFor(null) };
  const foreign = { ...declared, image: { ...declared.image, url: 'https://example.org/media/abcdefghijklmnopqrstuv.jpg' } };
  for (const C of [cards.NewsCard, cards.NewsFeaturedCard]) {
    assert.ok(!renderToStaticMarkup(h(C, { item: draft })).includes('<img'), 'draft image not rendered');
    assert.ok(!renderToStaticMarkup(h(C, { item: foreign })).includes('<img'), 'image from elsewhere not rendered');
    const html = renderToStaticMarkup(h(C, { item: declared }));
    assert.ok(html.includes(`src="${declared.image.url}"`) && html.includes('loading="lazy"') && html.includes('width="800"') && html.includes('height="600"'));
    assert.ok(html.includes('alt="Közös kézműves foglalkozás"'));
  }
  const prog = { ...seed.SEED_PROGRAMS[0], image: imageFor(null, { declared: false }) };
  assert.ok(!renderToStaticMarkup(h(cards.ProgramCard, { program: prog })).includes('<img'));
  assert.ok(renderToStaticMarkup(h(cards.ProgramCard, { program: { ...prog, image: imageFor(null) } })).includes('<img'));
  assert.equal(pub.publicImage(draft.image), null);
});

test('stored content with an undeclared image: the site keeps the stored content and just hides that image', () => {
  const stored = { ...seed.SEED_CONTENT, updatedAt: '2026-11-04T09:00:00.000Z', news: [{ ...seed.SEED_NEWS[0], title: 'Tárolt cím', image: imageFor(null, { declared: false }) }, ...seed.SEED_NEWS.slice(1)] };
  const picked = pub.pickContent(stored);
  assert.equal(picked.source, 'store', 'not the seed');
  assert.equal(picked.content.news[0].title, 'Tárolt cím');
  assert.equal(pub.publicImage(picked.content.news[0].image), null);
  assert.ok(!renderToStaticMarkup(h(cards.NewsFeaturedCard, { item: picked.content.news[0] })).includes('<img'));
});

test('the pages read through the store with the cache tag; /programok is a server page with a client filter', () => {
  const hirek = fs.readFileSync(path.resolve('src/app/hirek/page.tsx'), 'utf8');
  const programok = fs.readFileSync(path.resolve('src/app/programok/page.tsx'), 'utf8');
  for (const s of [hirek, programok]) assert.ok(s.includes('await getPublicContent()'));
  assert.ok(!programok.includes('"use client"') && !programok.includes("'use client'"));
  assert.ok(fs.readFileSync(path.resolve('src/components/content/ProgramFilter.tsx'), 'utf8').startsWith('"use client"'));
  const pc = fs.readFileSync(path.resolve('src/content/publicContent.ts'), 'utf8');
  assert.match(pc, /tags: \[CONTENT_TAG\]/);
  assert.ok(!/from ['"]next\/image['"]/.test(fs.readFileSync(path.resolve('src/components/content/ContentCards.tsx'), 'utf8')));
});

test('the editor is noindex and in no menu', () => {
  const page = fs.readFileSync(path.resolve('src/app/szerkeszto/page.tsx'), 'utf8');
  assert.match(page, /robots: \{ index: false, follow: false \}/);
  const cfg = fs.readFileSync(path.resolve('next.config.ts'), 'utf8');
  assert.match(cfg, /source: "\/szerkeszto\/:path\*", headers: EDITOR_HEADERS/);
  for (const f of ['src/components/layout/Header.tsx', 'src/components/layout/Footer.tsx']) {
    assert.ok(!fs.readFileSync(path.resolve(f), 'utf8').includes('/szerkeszto'), f);
  }
  assert.ok(!fs.existsSync(path.resolve('src/app/sitemap.ts')) || !fs.readFileSync(path.resolve('src/app/sitemap.ts'), 'utf8').includes('szerkeszto'));
});

test('CSP: images also from the Blob store, nothing else changed (the exact string)', async () => {
  const { CONTENT_SECURITY_POLICY, EDITOR_HEADERS } = await src('lib/securityHeaders.ts');
  assert.equal(
    CONTENT_SECURITY_POLICY,
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https://*.public.blob.vercel-storage.com; font-src 'self'; connect-src 'self'; " +
      "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  );
  assert.deepEqual(EDITOR_HEADERS, [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]);
});

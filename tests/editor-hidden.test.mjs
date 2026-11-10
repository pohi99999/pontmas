// The editor, part 6: hidden items (2026-11-05). A new item starts hidden, so the first save publishes
// nothing; publishing is a separate, deliberate step. These tests walk the code path from the editor's
// save route through the store to the public page's list and card, with MemoryContentStore for Vercel
// Blob and a recording fetch for Resend. The real pages take the same two functions (see the last test).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { src } from './helpers/load.mjs';
import { EDITOR, NOW, SITE, fakeMailer, htmlText, makeEnv } from './helpers/fixtures.mjs';

import { renderElement as renderToStaticMarkup } from './helpers/render.mjs';
const { createElement: h } = await import('react');
const api = await src('lib/editorApi.ts');
const auth = await src('lib/editorAuth.ts');
const { MemoryContentStore } = await src('content/store.ts');
const { SEED_CONTENT, SEED_NEWS, SEED_PROGRAMS } = await src('content/seed.ts');
const pub = await src('content/public.ts');
const cards = await src('components/content/ContentCards.tsx');
const items = await src('content/newItems.ts');
const { validateNewsItem, validateProgramItem } = await src('content/validate.ts');

function setup() {
  let clock = NOW;
  const deps = {
    env: makeEnv(),
    store: new MemoryContentStore({ now: () => new Date((clock += 1000)) }),
    fetchFn: fakeMailer().fn,
    now: () => new Date(clock),
    limiters: api.createEditorLimiters(),
    usedTokens: new Map(),
    revalidate() {},
    defer: () => {},
    log: () => {},
  };
  const cookie = `${auth.SESSION_COOKIE}=${auth.createSessionValue(EDITOR, deps.env.EDITOR_SESSION_SECRET, clock)}`;
  const put = async (base, content) => {
    const req = new Request(`${SITE}/api/szerkeszto/tartalom`, {
      method: 'PUT',
      headers: { host: new URL(SITE).host, origin: SITE, cookie, 'content-type': 'application/json' },
      body: JSON.stringify({ base, content }),
    });
    const res = await api.handleContentPut(req, deps);
    return { status: res.status, body: await res.json() };
  };
  return { deps, put };
}

/** What the public /hirek shows for the stored content: the same functions and cards as the page. */
async function publicNewsHtml(store) {
  const { content, source } = await pub.readContentSafely(() => store.read());
  const { featured, rest } = pub.splitNews(content.news);
  const html = [
    featured ? renderToStaticMarkup(h(cards.NewsFeaturedCard, { item: featured })) : '',
    ...rest.map((item) => renderToStaticMarkup(h(cards.NewsCard, { item }))),
  ].join('\n');
  return { html, source };
}

/** What the public /programok shows for the stored content. */
async function publicProgramsHtml(store) {
  const { content } = await pub.readContentSafely(() => store.read());
  return pub.visiblePrograms(content.programs).map((program) => renderToStaticMarkup(h(cards.ProgramCard, { program }))).join('\n');
}

const filledNews = (over = {}) => ({
  ...items.blankNews(), badge: 'Teszt', title: 'Új teszt hír', date: '2026. november 5.', description: 'A teszt hír leírása.', ...over,
});
const filledProgram = (over = {}) => ({
  ...items.blankProgram(), badge: 'Teszt', title: 'Új teszt program', date: '2026. november 5.', location: 'Szombathely',
  description: 'A teszt program leírása.', highlights: ['Egy pont'], ...over,
});

test('a new item starts hidden, and a filled one passes validation that way', () => {
  assert.equal(items.blankNews().hidden, true);
  assert.equal(items.blankProgram().hidden, true);
  const n = validateNewsItem(filledNews());
  assert.ok(n.ok, JSON.stringify(n.errors));
  assert.equal(n.value.hidden, true);
  const p = validateProgramItem(filledProgram());
  assert.ok(p.ok, JSON.stringify(p.errors));
  assert.equal(p.value.hidden, true);
});

test('a hidden news item is saved but not public; publishing shows it; hiding takes it down again', async () => {
  const { deps, put } = setup();
  const item = filledNews();
  let r = await put(null, { ...SEED_CONTENT, news: [item, ...SEED_NEWS] });
  assert.equal(r.status, 200, JSON.stringify(r.body));
  assert.equal(deps.store.content.news[0].hidden, true, 'stored as hidden');
  assert.equal(deps.store.content.news[0].title, 'Új teszt hír', 'and it is really stored');
  let view = await publicNewsHtml(deps.store);
  assert.equal(view.source, 'store', 'the public side reads the stored content, not the seed');
  assert.ok(!view.html.includes('Új teszt hír'), 'hidden: not public');

  r = await put(r.body.base, { ...SEED_CONTENT, news: [{ ...item, hidden: false }, ...SEED_NEWS] });
  assert.equal(r.status, 200);
  view = await publicNewsHtml(deps.store);
  assert.ok(view.html.includes('Új teszt hír') && view.html.includes('A teszt hír leírása.'), 'published: public');

  r = await put(r.body.base, { ...SEED_CONTENT, news: [{ ...item, hidden: true }, ...SEED_NEWS] });
  assert.equal(r.status, 200);
  assert.ok(!(await publicNewsHtml(deps.store)).html.includes('Új teszt hír'), 'hidden again: gone');
});

test('the same for a program', async () => {
  const { deps, put } = setup();
  const item = filledProgram();
  let r = await put(null, { ...SEED_CONTENT, programs: [item, ...SEED_PROGRAMS] });
  assert.equal(r.status, 200, JSON.stringify(r.body));
  assert.equal(deps.store.content.programs[0].hidden, true);
  assert.ok(!(await publicProgramsHtml(deps.store)).includes('Új teszt program'), 'hidden: not public');
  r = await put(r.body.base, { ...SEED_CONTENT, programs: [{ ...item, hidden: false }, ...SEED_PROGRAMS] });
  assert.equal(r.status, 200);
  assert.ok((await publicProgramsHtml(deps.store)).includes('Új teszt program'), 'published: public');
});

test('the existing 4 news items and 4 programs are unchanged, whatever happens to a hidden item', async () => {
  const { deps, put } = setup();
  const before = { news: (await publicNewsHtml(deps.store)).html, programs: await publicProgramsHtml(deps.store) };
  assert.equal(SEED_NEWS.length, 4);
  assert.equal(SEED_PROGRAMS.length, 4);
  assert.ok(SEED_NEWS.every((n) => n.hidden === false) && SEED_PROGRAMS.every((p) => p.hidden === false), 'all of them are public');
  for (const n of SEED_NEWS) assert.ok(htmlText(before.news).includes(n.title), n.title);
  for (const p of SEED_PROGRAMS) assert.ok(htmlText(before.programs).includes(p.title), p.title);
  const r = await put(null, { ...SEED_CONTENT, news: [filledNews(), ...SEED_NEWS], programs: [filledProgram(), ...SEED_PROGRAMS] });
  assert.equal(r.status, 200, JSON.stringify(r.body));
  assert.equal((await publicNewsHtml(deps.store)).html, before.news, 'the public news are byte for byte the same');
  assert.equal(await publicProgramsHtml(deps.store), before.programs, 'the public programs are byte for byte the same');
  // an item that exists keeps its own state: saving it does not hide it
  const stored = deps.store.content;
  assert.deepEqual(stored.news.slice(1).map((n) => n.hidden), SEED_NEWS.map(() => false));
  assert.deepEqual(stored.programs.slice(1).map((p) => p.hidden), SEED_PROGRAMS.map(() => false));
});

test('the wording says what happens: the Save button and the message follow the toggle', () => {
  assert.equal(items.saveButtonText(true), 'Mentés rejtve');
  assert.equal(items.saveButtonText(false), 'Mentés és közzététel');
  assert.match(items.savedMessage(true), /nem látszik/);
  assert.doesNotMatch(items.savedMessage(true), /megjelent/, 'a hidden save must not claim it went public');
  assert.match(items.savedMessage(false), /megjelent/);
});

test('the form is wired to the hidden field, and the public pages use the functions tested here', () => {
  const ui = fs.readFileSync(path.resolve('src/components/editor/EditorApp.tsx'), 'utf8');
  assert.match(ui, /checked=\{item\.hidden\} onChange=\{\(e\) => update\(\{ hidden: e\.target\.checked \}\)\}/, 'the toggle edits the hidden field');
  assert.ok(ui.includes('saveButtonText(item.hidden)'), 'the Save button follows it');
  assert.ok(ui.includes('savedMessage(editing.item.hidden)'), 'the message follows it');
  assert.ok(!ui.includes("'Mentve, a honlapon is megjelent.'"), 'no fixed "it went public" message');
  const hirek = fs.readFileSync(path.resolve('src/app/[locale]/hirek/page.tsx'), 'utf8');
  const programok = fs.readFileSync(path.resolve('src/app/[locale]/programok/page.tsx'), 'utf8');
  assert.ok(hirek.includes('splitNews(content.news)'));
  assert.ok(programok.includes('visiblePrograms(content.programs)'));
});

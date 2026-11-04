// The editor, part 2: every validation rule, with an accepted and a refused case (2026-11-04).
// The same validator runs in the browser and on the server; the server's verdict is final.
import test from 'node:test';
import assert from 'node:assert/strict';
import { src } from './helpers/load.mjs';
import { imageFor } from './helpers/fixtures.mjs';

const { validateContent, validateNewsItem, validateProgramItem, isAllowedLink, isRealDate } = await src('content/validate.ts');
const { SEED_CONTENT, SEED_NEWS, SEED_PROGRAMS } = await src('content/seed.ts');

const news = (patch) => validateNewsItem({ ...SEED_NEWS[1], ...patch });
const prog = (patch) => validateProgramItem({ ...SEED_PROGRAMS[0], ...patch });
const ok = (r, msg) => assert.equal(r.ok, true, `${msg}: ${JSON.stringify(r.errors)}`);
const bad = (r, msg) => assert.equal(r.ok, false, msg);

test('length limits: title 160, description 2000, location and speaker 200, list items 200', () => {
  ok(news({ title: 'x'.repeat(160) }), 'title 160');
  bad(news({ title: 'x'.repeat(161) }), 'title 161');
  ok(news({ description: 'x'.repeat(2000) }), 'description 2000');
  bad(news({ description: 'x'.repeat(2001) }), 'description 2001');
  ok(news({ location: 'x'.repeat(200), speaker: 'y'.repeat(200) }), 'location/speaker 200');
  bad(news({ location: 'x'.repeat(201) }), 'location 201');
  bad(news({ speaker: 'x'.repeat(201) }), 'speaker 201');
  bad(prog({ location: 'x'.repeat(201) }), 'program location 201');
  ok(news({ highlights: ['x'.repeat(200)] }), 'item 200');
  bad(news({ highlights: ['x'.repeat(201)] }), 'item 201');
  bad(prog({ title: 'x'.repeat(161) }), 'program title 161');
  bad(prog({ description: 'x'.repeat(2001) }), 'program description 2001');
});

test('at most 8 list items, none empty', () => {
  ok(news({ highlights: Array(8).fill('pont') }), '8 items');
  bad(news({ highlights: Array(9).fill('pont') }), '9 items');
  bad(prog({ highlights: Array(9).fill('pont') }), '9 program items');
  bad(news({ highlights: ['pont', '  '] }), 'empty item');
  bad(news({ highlights: 'nem lista' }), 'not a list');
});

test('plain text only: no markup, no control characters; the description may have line breaks', () => {
  bad(news({ title: '<b>Hír</b>' }), 'html tag');
  bad(news({ description: 'Szöveg <script>alert(1)</script>' }), 'script tag');
  bad(news({ description: 'Szöveg <!-- megjegyzés -->' }), 'comment');
  bad(news({ title: 'Cím\nmásodik sor' }), 'newline in title');
  bad(news({ title: 'Cím\u0007' }), 'control char');
  bad(news({ title: 42 }), 'not a string');
  ok(news({ description: 'Első bekezdés.\n\nMásodik bekezdés.' }), 'paragraphs');
  ok(news({ title: 'Kicsi < nagy, 3 > 2 & minden rendben' }), 'comparison signs and & are text');
  ok(news({ title: '**nem félkövér**, csak szöveg' }), 'markdown-looking text is just text');
});

test('links: only https:// or a path starting with "/"', () => {
  for (const good of ['https://forms.gle/abc', '/kapcsolat?topic=szulo', '/programok']) {
    assert.ok(isAllowedLink(good), good);
    ok(news({ actionHref: good }), good);
  }
  for (const evil of ['http://pelda.hu', 'javascript:alert(1)', '//evil.example/x', '/\\evil.example', 'kapcsolat', 'https://', 'https://user:pw@pelda.hu', 'data:text/html,x', 'https://pelda.hu/a b']) {
    assert.equal(isAllowedLink(evil), false, evil);
    bad(news({ actionHref: evil }), evil);
  }
  bad(news({ googleFormHref: '/belso' }), 'form link must be https');
  ok(news({ googleFormHref: 'https://forms.gle/1' }), 'https form link');
  bad(news({ actionText: 'Gomb', actionHref: '' }), 'text without link');
  ok(news({ actionText: '', actionHref: '' }), 'no button at all');
});

test('publishedAt must be a real date', () => {
  for (const d of ['2024-02-29', '2026-11-04']) { assert.ok(isRealDate(d), d); ok(news({ publishedAt: d }), d); }
  for (const d of ['2023-02-29', '2024-13-01', '2024-04-31', '2024-1-1', 'tegnap', '', '2024-10-26T10:00:00Z']) {
    assert.equal(isRealDate(d), false, d);
    bad(news({ publishedAt: d }), d);
  }
});

test('at most 100 news items and 50 programs; ids unique', () => {
  const many = (base, n, prefix) => Array.from({ length: n }, (_, i) => ({ ...base, id: `${prefix}-${i}` }));
  ok(validateContent({ ...SEED_CONTENT, news: many(SEED_NEWS[1], 100, 'h') }), '100 news');
  bad(validateContent({ ...SEED_CONTENT, news: many(SEED_NEWS[1], 101, 'h') }), '101 news');
  ok(validateContent({ ...SEED_CONTENT, programs: many(SEED_PROGRAMS[0], 50, 'p') }), '50 programs');
  bad(validateContent({ ...SEED_CONTENT, programs: many(SEED_PROGRAMS[0], 51, 'p') }), '51 programs');
  bad(validateContent({ ...SEED_CONTENT, news: [SEED_NEWS[0], SEED_NEWS[0]] }), 'duplicate id');
  bad(news({ id: 'Nagy Betű' }), 'bad id');
});

test('required fields, kinds and categories', () => {
  bad(news({ title: '' }), 'empty title');
  bad(news({ description: '   ' }), 'blank description');
  bad(news({ hidden: 'nem' }), 'hidden not boolean');
  bad(news({ featured: undefined }), 'featured missing');
  bad(prog({ category: 'party' }), 'unknown category');
  ok(prog({ category: 'camp' }), 'camp');
  bad(validateContent({ ...SEED_CONTENT, version: 2 }), 'unknown version');
  bad(validateContent(null), 'null');
  bad(validateContent({ ...SEED_CONTENT, news: 'x' }), 'news not a list');
});

test('images: only from our store under media/, with alt text and a size up to 1600 px', () => {
  const img = imageFor(null);
  ok(news({ image: img }), 'declared image');
  // the declaration is mandatory: an image without it is refused, there is no "draft" any more
  const undeclared = imageFor(null, { declared: false });
  const r = news({ image: undeclared });
  bad(r, 'image without the declaration');
  assert.ok(r.errors.some((e) => e.path === 'item.image.childPhotoDeclaration'), JSON.stringify(r.errors));
  bad(prog({ image: undeclared }), 'program image without the declaration');
  bad(validateContent({ ...SEED_CONTENT, news: [{ ...SEED_NEWS[0], image: undeclared }, ...SEED_NEWS.slice(1)] }), 'content with an undeclared image');
  // only the public READ is lenient (an undeclared image never shows, and must not blank the site)
  ok(validateNewsItem({ ...SEED_NEWS[1], image: undeclared }, { requireDeclaration: false }), 'lenient news');
  ok(validateContent({ ...SEED_CONTENT, news: [{ ...SEED_NEWS[0], image: undeclared }, ...SEED_NEWS.slice(1)] }, { requireDeclaration: false }), 'lenient content');
  bad(validateNewsItem({ ...SEED_NEWS[1], image: undeclared }, { requireDeclaration: true }), 'explicit strict');
  bad(news({ image: { ...img, url: 'https://evil.example/media/abcdefghijklmnopqrstuvwx.jpg' } }), 'foreign host');
  bad(news({ image: { ...img, url: img.url.replace('/media/', '/content/') } }), 'outside media/');
  bad(news({ image: { ...img, url: img.url.replace('.jpg', '.svg') } }), 'svg');
  bad(news({ image: { ...img, alt: '' } }), 'no alt');
  bad(news({ image: { ...img, width: 1601 } }), 'too wide');
  bad(news({ image: { ...img, height: 0 } }), 'zero height');
  bad(news({ image: { ...img, exif: { gps: '47N' } } }), 'unknown image key');
  bad(news({ image: { ...img, childPhotoDeclaration: { declaredBy: 'x', at: 'tegnap' } } }), 'bad declaration time');
});

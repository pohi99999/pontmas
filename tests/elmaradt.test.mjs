import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { renderHtml, visibleText } from './helpers/render.mjs';
import { src } from './helpers/load.mjs';

// Edina's "Elmaradt anyagok" (2026-11-13 16:12; Péter 15487): the 2024-10-26 parent club is over with no new
// date; a new "Irodánk" page; the registration number is 18-01-0000323.
const read = (p) => fs.readFileSync(path.resolve(p), 'utf8');
const { SEED_NEWS } = await src('content/seed.ts');
const { splitNews, publicNews, LEZARULT_ESEMENYEK } = await src('content/public.ts');
const { NewsCard } = await src('components/content/ContentCards.tsx');
const { createElement: h } = await import('react');
const { renderToStaticMarkup } = await import('react-dom/server');

const OKT26 = 'szuloklub-2024-10-26';

test('the 2024-10-26 parent club is among the earlier items, with no banner and no registration', () => {
  assert.ok(LEZARULT_ESEMENYEK.has(OKT26));
  const { featured, rest } = splitNews(SEED_NEWS);
  assert.notEqual(featured?.id, OKT26, 'it is not the banner any more');
  const item = rest.find((n) => n.id === OKT26);
  assert.ok(item, 'it is still shown, among the other items');
  assert.equal(item.actionHref, '');
  assert.equal(item.googleFormHref, undefined);
  const card = renderToStaticMarkup(h(NewsCard, { item }));
  for (const bad of ['Regisztráció', 'forms.gle', '/kapcsolat?topic=szulo', 'Google-űrlap']) assert.ok(!card.includes(bad), bad);
  assert.ok(card.includes('2024. október 26.'), 'the date stays');
  // Marveen 7374: marked as past, no invitation sentences; the text only from the 2024 report (point 3)
  assert.ok(card.includes('Lezárult esemény'));
  for (const bad of ['Meghívó', 'soron következő', 'regisztrációhoz kötött', 'szeretettel meghívja', 'Kiemelt']) assert.ok(!card.includes(bad), bad);
  for (const good of ['A 2024 őszén megtartott két szülőklub egyike', 'Sugár út 9.', 'Bárdosi Emőke', 'Önálló szabadidős tevékenységek tervezése, tanítása']) assert.ok(card.includes(good), good);
});

test('the editor cannot bring it back: featured and a registration link in the store still render as an earlier item', () => {
  const stored = { ...SEED_NEWS[0], id: OKT26, featured: true, actionText: 'Regisztráció a Szülőklubra', actionHref: '/kapcsolat?topic=szulo', googleFormHref: 'https://forms.gle/x' };
  const { featured, rest } = splitNews([stored]);
  assert.equal(featured, null);
  assert.deepEqual([rest[0].featured, rest[0].actionHref, rest[0].googleFormHref], [false, '', undefined]);
  // the editor's preview shows the same as the site
  assert.match(read('src/components/editor/EditorApp.tsx'), /publicNews\(news\)\.featured \? <NewsFeaturedCard item=\{publicNews\(news\)\} \/> : <NewsCard item=\{publicNews\(news\)\} \/>/);
});

test('every other item is untouched: a later invitation can still be the banner, with its buttons', () => {
  const later = { ...SEED_NEWS[0], id: 'szuloklub-2027-01-01', featured: true };
  assert.equal(publicNews(later), later);
  assert.equal(splitNews([later]).featured, later);
  for (const n of SEED_NEWS.filter((x) => x.id !== OKT26)) assert.equal(publicNews(n), n, n.id);
});

test('the registration number is 18-01-0000323 everywhere; 18-01-0001850 is nowhere in src', async () => {
  const files = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(path.join(dir, e.name)) : [path.join(dir, e.name)]);
  for (const f of files(path.resolve('src'))) {
    if (!/\.(tsx?|mjs|json|md|css)$/.test(f)) continue;
    assert.ok(!read(f).includes('18-01-0001850'), path.relative(process.cwd(), f));
  }
  assert.ok(visibleText(await renderHtml('app/dokumentumok/page.tsx')).includes('Nyilvántartási szám: 18-01-0000323'));
});

test('Irodánk: Edina\'s text, the address, the hours of her text, the phone; no e-mail address', async () => {
  const html = await renderHtml('app/irodank/page.tsx');
  const shown = visibleText(html);
  for (const t of [
    'AZ AOSZ Info-pont a régi formájában és névvel szeptembertől már nem elérhető, de nem hagyunk magatokra benneteket!',
    'A régi helyünkön (Szombathely, Sugár út 9. 3. emelet) ismét van személyes ügyfélfogadás, Rumi Edina várja a családokat a személyes megkeresésekkel.',
    'Szeretnénk bővíteni szolgáltatásainkat, erről hamarosan be is fogunk számolni.',
    'Ügyfélfogadás:', 'Kedd: 9.00-13.00', 'Péntek: 9.00-12.00',
    'Telefonos egyeztetés alapján természetesen más időpontot is tudunk találni!',
    'Elérhetőségünk:', 'Telefon: +36 20 969 8715', 'Szombathely, Sugár út 9. 3. emelet',
  ]) assert.ok(shown.includes(t), t);
  assert.ok(html.includes('href="tel:+36209698715"'));
  // the poster's "9-től 13 óráig" for Friday is not on the page until Edina settles it; no e-mail at all
  assert.ok(!shown.includes('Péntek: 9.00-13.00'));
  assert.ok(!/@|mailto:/.test(html), 'no e-mail address');
});

test('Irodánk is in the main menu (desktop and mobile share the list) and in the footer', async () => {
  const hd = read('src/components/layout/Header.tsx');
  assert.ok(hd.includes("{ label: 'Irodánk', href: '/irodank' }"));
  assert.equal((hd.match(/navItems\.map\(/g) || []).length, 2);
  assert.match(await renderHtml('components/layout/Footer.tsx'), /<a [^>]*href="\/irodank"[^>]*>Irodánk<\/a>/);
});

test('Irodánk shows Edina\'s approved portrait with her name and role, from the same place as /rolunk (Edina 11-14 14:33)', async () => {
  const html = await renderHtml('app/irodank/page.tsx');
  const { CSAPAT } = await src('content/csapat.ts');
  const edina = CSAPAT.find((t) => t.nev === 'Rumi Edina');
  assert.equal(edina.foto, '/csapat/rumi-edina.webp');
  assert.equal(fs.readFileSync(path.resolve('public' + edina.foto)).toString('ascii', 8, 12), 'WEBP');
  const fig = html.match(/<figure[\s\S]*?<\/figure>/);
  assert.ok(fig, 'no figure on /irodank');
  assert.match(fig[0], /<img[^>]*alt="Rumi Edina"[^>]*src="[^"]*rumi-edina\.webp/);
  const shown = visibleText(fig[0]);
  assert.ok(shown.includes('Rumi Edina') && shown.includes(edina.szerep), shown);
});


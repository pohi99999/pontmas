// The foundation's fixed facts come from one file, src/lib/foundation.ts (card c017f163).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { FOUNDATION, ADDRESS_LINE, PHONE_HREF, foundationJsonLd } from '../src/lib/foundation.ts';
import { renderHtml, visibleText } from './helpers/render.mjs';

test('the facts are the published ones', () => {
  assert.equal(FOUNDATION.name, 'PontMás Vas Megyei Autista Gyermekekért Alapítvány');
  assert.equal(FOUNDATION.taxNumber, '18654996-1-18');
  assert.equal(FOUNDATION.registrationNumber, '18-01-0001850');
  assert.equal(FOUNDATION.bankName, 'Erste Bank');
  assert.equal(FOUNDATION.bankAccount, '11600006-00000000-75701521');
  assert.equal(ADDRESS_LINE, '9700 Szombathely, Váci M. utca 12. 3./15.');
  assert.equal(FOUNDATION.contactPerson, 'Rumi Edina');
  assert.equal(FOUNDATION.phone, '+36 20 969 8715');
  assert.equal(PHONE_HREF, 'tel:+36209698715');
});

test('the JSON-LD block is the one the layout carried before, field for field', () => {
  assert.deepEqual(foundationJsonLd(), {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'PontMás Vas Megyei Autista Gyermekekért Alapítvány',
    url: 'https://pontmas.hu',
    telephone: '+36 20 969 8715',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Váci M. utca 12. 3./15.',
      addressLocality: 'Szombathely',
      postalCode: '9700',
      addressCountry: 'HU',
    },
  });
});

// One source: no other file under src/ may hold a copy, so a change cannot miss one.
const files = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? files(path.join(dir, e.name)) : /\.(tsx?|mjs|json|md)$/.test(e.name) ? [path.join(dir, e.name)] : []);
const COPIES = [
  ['tax number', /18654996-1-18/],
  ['bank account', /11600006-00000000-75701521/],
  ['registration number', /18-01-0001850/],
  ['phone', /\+36\s?20\s?969\s?8715|36209698715/],
  ['street', /Váci M\. utca 12/],
];

test('no file under src/ other than src/lib/foundation.ts holds a copy of a fact', () => {
  const own = path.resolve('src/lib/foundation.ts');
  for (const f of files(path.resolve('src'))) {
    if (f === own) continue;
    // generated from the rendered pages, which read foundation.ts; tests/chat-knowledge.test.mjs keeps it in step
    if (f.endsWith('.generated.ts')) continue;
    const s = fs.readFileSync(f, 'utf8');
    for (const [what, re] of COPIES) assert.ok(!re.test(s), `${path.relative(process.cwd(), f)} holds a copy of the ${what}`);
  }
});

test('the guard above catches a copy (it is not vacuous)', () => {
  for (const [what, re] of COPIES) {
    const sample = { 'tax number': 'Adószám: 18654996-1-18', 'bank account': '11600006-00000000-75701521',
      'registration number': 'Nyilvántartási szám: 18-01-0001850', phone: 'hívjon: +36 20 969 8715', street: 'Váci M. utca 12. 3./15.' }[what];
    assert.ok(re.test(sample), what);
  }
  assert.ok(/\+36\s?20\s?969\s?8715|36209698715/.test('tel:+36209698715'));
});

test('every page that showed a fact still shows it, as the visitor reads it', async () => {
  const expect = {
    'app/page.tsx': [FOUNDATION.name, '18654996-1-18', '11600006-00000000-75701521', 'Bankszámlaszám (Erste Bank)'],
    'app/tamogatas/page.tsx': ['18654996-1-18 (PontMás Alapítvány)', FOUNDATION.name, '11600006-00000000-75701521', 'Bankszámlaszám (Erste Bank)'],
    'app/rolunk/page.tsx': ['18654996-1-18', '9700 Szombathely, Váci M. utca 12. 3./15.'],
    'app/kapcsolat/page.tsx': ['9700 Szombathely, Váci M. utca 12. 3./15.', 'Rumi Edina', '+36 20 969 8715'],
    // /autizmus: the phone is in a FAQ answer, rendered only when the visitor opens it
    'app/segitseg/page.tsx': ['Hívja Rumi Edinát a +36 20 969 8715 számon'],
    'app/dokumentumok/page.tsx': ['Nyilvántartási szám: 18-01-0001850', 'telefonon (+36 20 969 8715)'],
    'components/layout/Footer.tsx': [`${FOUNDATION.name}. 2015 óta`, '9700 Szombathely', 'Rumi Edina, +36 20 969 8715', '18654996-1-18',
      'Bankszámlaszám (Erste Bank):', '11600006-00000000-75701521', `${FOUNDATION.name}. Minden jog fenntartva.`],
  };
  for (const [p, wanted] of Object.entries(expect)) {
    const html = await renderHtml(p);
    const shown = visibleText(html);
    for (const w of wanted) assert.ok(shown.includes(w), `${p} shows "${w}"`);
  }
  // the phone links dial the number
  for (const p of ['app/kapcsolat/page.tsx', 'components/layout/Footer.tsx'])
    assert.ok((await renderHtml(p)).includes('href="tel:+36209698715"'), `${p} links the phone`);
});

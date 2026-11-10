// The language switcher (review 2026-11-10, Marveen 6913, Péter GO 14675; agreed with Kenshin): compact
// "HU ▾" in the desktop header, full names at the top of the phone menu, only when more than one language
// is published. The browser run (both ways: hidden with one language, working with three) is in the PR.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { LANGUAGE_NAMES, switcherLocales } from '../src/lib/nyelvek.ts';

const read = (f) => fs.readFileSync(f, 'utf8');

test('the switcher offers nothing while only one language is published', () => {
  assert.deepEqual(switcherLocales(['hu']), []);
  assert.deepEqual(switcherLocales([]), []);
  assert.deepEqual(switcherLocales(['hu', 'en']), ['hu', 'en']);
  assert.deepEqual(switcherLocales(['hu', 'en', 'de']), ['hu', 'en', 'de']);
});

test('each language in its own name, a short code for the compact button, no flags', () => {
  assert.deepEqual(LANGUAGE_NAMES, { hu: { name: 'Magyar', code: 'HU' }, en: { name: 'English', code: 'EN' }, de: { name: 'Deutsch', code: 'DE' } });
  const c = read('src/components/layout/LanguageSwitcher.tsx');
  // no flag images or emoji (regional indicator letters)
  assert.doesNotMatch(c, /[\u{1F1E6}-\u{1F1FF}]|flag\.(svg|png)/u);
  // every option says its language and keeps the page
  assert.match(c, /href=\{pathname\}\s+locale=\{l\}\s+lang=\{l\}\s+hrefLang=\{l\}/);
  assert.match(c, /aria-current=\{l === locale \? 'true' : undefined\}/);
  // 44 px targets
  assert.equal((c.match(/h-11/g) || []).length, 2);
});

test('placed in the desktop header and at the top of the phone menu; the label is a message', () => {
  const h = read('src/components/layout/Header.tsx');
  assert.match(h, /<LanguageSwitcher \/>\s*\{\/\* Sensory Toggle \*\/\}/);
  assert.match(h, /<LanguageMenuList onPick=\{\(\) => setIsMobileMenuOpen\(false\)\} \/>/);
  for (const l of ['hu', 'en', 'de']) assert.equal(JSON.parse(read(`messages/${l}.json`)).Header.language, 'Nyelv', l);
});

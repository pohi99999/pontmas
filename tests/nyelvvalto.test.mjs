// The language switcher (review 2026-11-10, Marveen 6913, Péter GO 14675; agreed with Kenshin): compact
// "HU ▾" in the desktop header, full names at the top of the phone menu, only when more than one language
// is published. The browser run (both ways: hidden with one language, working with three) is in the PR.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { LANGUAGE_CODES, switcherLocales } from '../src/lib/nyelvek.ts';

const read = (f) => fs.readFileSync(f, 'utf8');

test('the switcher offers nothing while only one language is published', () => {
  assert.deepEqual(switcherLocales(['hu']), []);
  assert.deepEqual(switcherLocales([]), []);
  assert.deepEqual(switcherLocales(['hu', 'en']), ['hu', 'en']);
  assert.deepEqual(switcherLocales(['hu', 'en', 'de']), ['hu', 'en', 'de']);
});

test('each language in its own name, a short code for the compact button, no flags', () => {
  assert.deepEqual(LANGUAGE_CODES, { hu: 'HU', en: 'EN', de: 'DE' });
  // the names are the same autonyms in every language (messages, Kenshin #39)
  for (const l of ['hu', 'en', 'de']) assert.deepEqual(JSON.parse(read(`messages/${l}.json`)).LanguageSwitcher.names, { hu: 'Magyar', en: 'English', de: 'Deutsch' }, l);
  const c = read('src/components/layout/LanguageSwitcher.tsx');
  // no flag images or emoji (regional indicator letters)
  assert.doesNotMatch(c, /[\u{1F1E6}-\u{1F1FF}]|flag\.(svg|png)/u);
  // every option says its language and keeps the page
  assert.match(c, /href=\{pathname\}\s+locale=\{l\}\s+lang=\{l\}\s+hrefLang=\{l\}/);
  assert.match(c, /aria-current=\{l === locale \? 'true' : undefined\}/);
  // 44 px targets
  assert.equal((c.match(/h-11/g) || []).length, 2);
});

test('placed in the desktop header and in the phone menu; the texts are the LanguageSwitcher messages', () => {
  const h = read('src/components/layout/Header.tsx');
  assert.match(h, /<LanguageSwitcher \/>\s*\{\/\* Sensory Toggle \*\/\}/);
  assert.match(h, /<LanguageMenuList onPick=\{\(\) => setIsMobileMenuOpen\(false\)\} \/>/);
  const c = read('src/components/layout/LanguageSwitcher.tsx');
  assert.equal((c.match(/useTranslations\('LanguageSwitcher'\)/g) || []).length, 2);
  // the button names the action and the current language: "Nyelv választása. Jelenlegi nyelv: Magyar"
  assert.match(c, /aria-label=\{`\$\{t\('label'\)\}\. \$\{t\('current', \{ language: t\(`names\.\$\{locale\}`\) \}\)\}`\}/);
  for (const l of ['hu', 'en', 'de']) {
    const m = JSON.parse(read(`messages/${l}.json`)).LanguageSwitcher;
    assert.ok(m.label && m.current.includes('{language}'), l);
  }
});

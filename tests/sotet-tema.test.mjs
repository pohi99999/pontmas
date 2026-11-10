// The dark theme (review 2026-11-10, Marveen 6913, Péter GO 14675). The rendered colours are measured in a
// real browser by tests/a11y-contrast.mjs in both schemes; these guards keep the parts that make it work.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { THEME_KEY, THEME_SCRIPT, resolveTheme } from '../src/lib/theme.ts';

const read = (f) => fs.readFileSync(f, 'utf8');

test('the theme: the stored choice wins, otherwise the device setting', () => {
  assert.equal(resolveTheme('dark', false), 'dark');
  assert.equal(resolveTheme('light', true), 'light');
  assert.equal(resolveTheme(null, true), 'dark');
  assert.equal(resolveTheme(null, false), 'light');
  assert.equal(resolveTheme('garbage', true), 'dark');
});

test('the inline script sets the class and the colour scheme before the first paint', () => {
  const run = (stored, prefersDark) => {
    const classes = new Set();
    const root = { classList: { toggle: (c, on) => (on ? classes.add(c) : classes.delete(c)) }, style: {} };
    const ctx = {
      localStorage: { getItem: (k) => (k === THEME_KEY ? stored : null) },
      window: { matchMedia: () => ({ matches: prefersDark }) },
      document: { documentElement: root },
    };
    vm.runInNewContext(THEME_SCRIPT, ctx);
    return { dark: classes.has('dark'), scheme: root.style.colorScheme };
  };
  assert.deepEqual(run(null, true), { dark: true, scheme: 'dark' });
  assert.deepEqual(run(null, false), { dark: false, scheme: 'light' });
  assert.deepEqual(run('light', true), { dark: false, scheme: 'light' });
  assert.deepEqual(run('dark', false), { dark: true, scheme: 'dark' });
});

test('the page declares its own dark theme, so browsers do not darken it on their own', () => {
  const layout = read('src/app/layout.tsx');
  assert.match(layout, /<meta name="color-scheme" content="light dark" \/>/);
  assert.match(layout, /dangerouslySetInnerHTML=\{\{ __html: THEME_SCRIPT \}\}/);
  const css = read('src/app/globals.css');
  assert.match(css, /@custom-variant dark \(&:where\(\.dark, \.dark \*\)\);/);
  assert.match(css, /:root\.dark \{\s*color-scheme: dark;/);
  // the parts that are dark in the light theme too keep their palette
  assert.match(css, /\.dark \.pm-sotet \{/);
  for (const f of ['src/components/layout/Footer.tsx', 'src/app/page.tsx', 'src/app/tamogatas/page.tsx']) assert.match(read(f), /pm-sotet/, f);
});

test('the logo has a light-ink version for the dark theme, the sphere and ribbon unchanged', () => {
  for (const n of ['jel', 'felirat']) {
    const light = read(`public/brand/pontmas-${n}.svg`), dark = read(`public/brand/pontmas-${n}-sotet.svg`);
    assert.ok(!dark.includes('#19171a') && dark.includes('#ece9e2'), n);
    // only the ink colour differs (and the comment)
    const strip = (s) => s.replace(/<!--[\s\S]*?-->/g, '').replace(/#19171a|#ece9e2/g, 'INK');
    assert.equal(strip(dark), strip(light), n);
  }
  const header = read('src/components/layout/Header.tsx');
  assert.match(header, /pontmas-jel-sotet\.svg/);
  assert.match(header, /pontmas-felirat-sotet\.svg/);
  assert.match(read('src/components/brand/PontJel.tsx'), /fill="currentColor"/);
});

test('the soft mode button has its label at every width and is never a black button', () => {
  const header = read('src/components/layout/Header.tsx');
  assert.doesNotMatch(header, /sr-only 2xl:not-sr-only">Lágy mód/);
  assert.equal((header.match(/<span>(\{isSensoryFriendly \? 'Lágy mód: be' : 'Lágy mód'\}|Lágy mód)<\/span>/g) || []).length, 2);
  assert.doesNotMatch(header, /isSensoryFriendly\s*\?\s*'bg-slate-800/);
  assert.match(header, /<ThemeToggleButton \/>/);
  assert.match(header, /<ThemeToggleRow \/>/);
});

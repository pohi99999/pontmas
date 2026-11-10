// The dark theme (review 2026-11-10, Marveen 6913, Péter GO 14675). The rendered colours are measured in a
// real browser by tests/a11y-contrast.mjs in both schemes; these guards keep the parts that make it work.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { THEME_KEY, THEME_SCRIPT, resolveTheme } from '../src/lib/theme.ts';
import { renderHtml } from './helpers/render.mjs';
import { src } from './helpers/load.mjs';

const HU = JSON.parse(fs.readFileSync('messages/hu.json', 'utf8'));

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

test('the page declares its own dark theme, so browsers do not darken it on their own', async () => {
  // Since the pages moved under [locale] (card c017f163) the frame is SiteShell, measured rendered: the theme
  // script is the body's first element (parser-blocking, so it runs before the first paint), and every root
  // layout exports colorScheme, which Next renders as <meta name="color-scheme" content="light dark">.
  const html = await renderHtml('components/layout/SiteShell.tsx', { lang: 'hu', messages: HU, children: 'x' });
  const body = html.slice(html.indexOf('<body'));
  assert.ok(body.slice(body.indexOf('>') + 1).startsWith(`<script>${THEME_SCRIPT}</script>`), 'theme script first in <body>');
  for (const f of ['app/[locale]/layout.tsx', 'app/szerkeszto/layout.tsx', 'app/global-not-found.tsx']) {
    assert.equal((await src(f)).viewport?.colorScheme, 'light dark', f);
  }
  assert.match(read('src/app/global-not-found.tsx'), /__html: THEME_SCRIPT/);
  const css = read('src/app/globals.css');
  assert.match(css, /@custom-variant dark \(&:where\(\.dark, \.dark \*\)\);/);
  assert.match(css, /:root\.dark \{\s*color-scheme: dark;/);
  // the parts that are dark in the light theme too keep their palette
  assert.match(css, /\.dark \.pm-sotet \{/);
  for (const f of ['src/components/layout/Footer.tsx', 'src/app/[locale]/page.tsx', 'src/app/[locale]/tamogatas/page.tsx']) assert.match(read(f), /pm-sotet/, f);
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

test('the soft mode button has its label at every width and is never a black button', async () => {
  const header = read('src/components/layout/Header.tsx');
  // measured on the rendered header (the texts come from messages/<locale>.json since card c017f163)
  const html = await renderHtml('components/layout/Header.tsx');
  // the desktop label is visible text, not screen-reader-only
  assert.ok(html.includes('<span>Lágy mód</span>'), 'desktop label');
  assert.doesNotMatch(html, /sr-only[^"]*">Lágy mód/);
  assert.equal(HU.Header.sensoryOn, 'Lágy mód: be');
  // the small-screen button: the label is always there, on two lines below 400 px (Ellenőr, 320-360 px)
  assert.equal((html.match(/<span class="leading-\[1\.1\] text-left">Lágy <br class="min-\[400px\]:hidden"\/>mód<\/span>/g) || []).length, 1);
  // ... and in every language the label has that one line break
  for (const l of ['hu', 'en', 'de']) {
    const short = JSON.parse(fs.readFileSync(`messages/${l}.json`, 'utf8')).Header.sensoryShort;
    assert.equal((short.match(/<br><\/br>/g) || []).length, 1, l);
  }
  assert.doesNotMatch(header, /isSensoryFriendly\s*\?\s*'bg-slate-800/);
  assert.match(header, /<ThemeToggleButton \/>/);
  assert.match(header, /<ThemeToggleRow \/>/);
});

test('the light wordmark keeps a white edge in the light theme only (forced darkening, Ellenőr 11-10)', () => {
  const header = read('src/components/layout/Header.tsx');
  const css = read('src/app/globals.css');
  assert.match(header, /src="\/brand\/pontmas-felirat\.svg"[\s\S]{0,200}className="pm-halo [^"]*dark:hidden"/);
  assert.match(css, /html:not\(\.dark\) \.pm-halo \{\s*filter: drop-shadow\(0 0 1px #fff\) drop-shadow\(0 0 1px #fff\);/);
});

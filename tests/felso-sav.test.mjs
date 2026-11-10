// The display bar above the header (Péter 14726, Marveen 7007). The browser checks (shown only from 1360 px,
// one line, logo-menu gap >= 16 px, tab order, only the main row sticky) are in tests/a11y-contrast.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (f) => fs.readFileSync(f, 'utf8');
const header = read('src/components/layout/Header.tsx');

test('the bar sits before the sticky header, is not sticky itself, and shows only from 1360 px', () => {
  const bar = header.indexOf('<div data-felso-sav'), sticky = header.indexOf('<header ref={headerRef} className="sticky');
  assert.ok(bar > 0 && sticky > bar, 'the bar comes before the header, as its sibling');
  const barTag = header.slice(bar, header.indexOf('>', bar));
  assert.match(barTag, /hidden min-\[1360px\]:block/);
  assert.doesNotMatch(barTag, /sticky|fixed/);
});

test('the theme and the soft-mode buttons are in the bar, not in the header row', () => {
  const bar = header.slice(header.indexOf('<div data-felso-sav'), header.indexOf('<header ref={headerRef}'));
  const row = header.slice(header.indexOf('<header ref={headerRef}'));
  assert.match(bar, /<ThemeToggleButton \/>/);
  assert.match(bar, /'Lágy mód: be' : 'Lágy mód'/);
  assert.doesNotMatch(row, /<ThemeToggleButton \/>/);
  // the phone keeps its own soft-mode button and the theme row in the menu
  assert.match(row, /<ThemeToggleRow \/>/);
});

test('the theme button says its state in words, like the soft mode, and the words are its name', () => {
  const t = read('src/components/ui/ThemeToggle.tsx');
  const btn = t.slice(t.indexOf('export function ThemeToggleButton'), t.indexOf('export function ThemeToggleRow'));
  assert.match(btn, /\{dark \? 'Sötét téma: be' : 'Sötét téma'\}/);
  assert.match(btn, /aria-pressed=\{dark\}/);
  assert.doesNotMatch(btn, /aria-label=/, 'no aria-label that could drift from the visible label');
});

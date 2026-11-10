// The phone header's theme switch (Péter 14743, 14746; Marveen 7022): next to the menu button, below 1360 px.
// The browser run (tap -> light, kept after a reload, Enter -> dark, also in soft mode; no overlap with the logo
// from 320 to 1359 px) is in the PR; tests/a11y-contrast.mjs checks the overlap at 320/360/375/768.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (f) => fs.readFileSync(f, 'utf8');

test('the switch sits in the phone controls, right before the menu button', () => {
  const h = read('src/components/layout/Header.tsx');
  const mobile = h.slice(h.indexOf('{/* Mobile controls'), h.indexOf('aria-controls="fo-menu"'));
  assert.match(mobile, /min-\[1360px\]:hidden/);
  assert.match(mobile, /<ThemeToggleIcon \/>\s*<button\s+ref=\{menuButtonRef\}/);
});

test('a 44 px target with a steady name and its state in aria-pressed', () => {
  const t = read('src/components/ui/ThemeToggle.tsx');
  const btn = t.slice(t.indexOf('export function ThemeToggleIcon'), t.indexOf('export function ThemeToggleRow'));
  assert.match(btn, /aria-label="Sötét téma"/);
  assert.match(btn, /aria-pressed=\{dark\}/);
  assert.match(btn, /h-11 w-11/);
  assert.match(btn, /onClick=\{toggle\}/, 'the same toggle as the menu row: it stores the choice');
});

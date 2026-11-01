import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Guards for the 2026-11-01 fix pack: none of these may come back unnoticed.

const read = (p) => fs.readFileSync(path.resolve(p), 'utf8');
const srcFiles = (dir) => fs.readdirSync(path.resolve(dir), { recursive: true })
  .filter((f) => /\.(tsx?|css)$/.test(f))
  .map((f) => path.join(dir, f));

test('no made-up phone number and no unsourced bank name anywhere in the site source', () => {
  for (const f of srcFiles('src')) {
    const s = read(f);
    assert.ok(!s.includes('36301234567'), `${f}: placeholder phone number`);
    assert.ok(!/\bCIB\b/.test(s), `${f}: bank name without a source`);
  }
});

test('documents do not promise a download that does not exist', () => {
  assert.ok(!fs.existsSync(path.resolve('src/components/ui/DocDownloadButton.tsx')));
  for (const f of srcFiles('src')) assert.ok(!/\balert\(/.test(read(f)), `${f}: alert() as a fake action`);
});

test('one light theme: no dark-mode override of the page colours', () => {
  const css = read('src/app/globals.css');
  assert.ok(!/@media\s*\(prefers-color-scheme:\s*dark/.test(css), 'dark override is back');
  assert.ok(/color-scheme:\s*light/.test(css), 'color-scheme: light is missing');
});

test('the operating system reduced-motion preference is honoured', () => {
  assert.ok(/@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(read('src/app/globals.css')));
});

test('copyable numbers wrap instead of being cut with an ellipsis', () => {
  const s = read('src/components/ui/CopyButton.tsx');
  assert.ok(!/\btruncate\b/.test(s), 'the account number would be shown cut off');
});

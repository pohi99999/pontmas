import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('globals.css defines autism-friendly calm theme tokens and sensory mode', () => {
  const cssPath = path.resolve('src/app/globals.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');

  // Verify theme tokens and sensory variables
  assert.ok(cssContent.includes('--color-primary'), 'Must define --color-primary');
  assert.ok(cssContent.includes('--color-primary-dark'), 'Must define --color-primary-dark');
  assert.ok(cssContent.includes('--color-calm-blue'), 'Must define --color-calm-blue');
  assert.ok(cssContent.includes('.sensory-friendly'), 'Must define .sensory-friendly');
  assert.ok(cssContent.includes('focus-visible'), 'Must define enhanced focus-visible styling');
});

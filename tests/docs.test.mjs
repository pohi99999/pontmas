import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Documentation and project guidelines are comprehensive and up-to-date', () => {
  const readmePath = path.resolve('README.md');
  const readmeContent = fs.readFileSync(readmePath, 'utf8');

  assert.ok(readmeContent.includes('PontMás'), 'README must describe PontMás Foundation');
  assert.ok(readmeContent.includes('Design rendszer') || readmeContent.includes('Akadálymentesség') || readmeContent.includes('akadálymentes'), 'README must describe accessibility & design system');
  assert.ok(readmeContent.includes('npm test'), 'README must mention test command');
});

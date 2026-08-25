import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Accessibility context provides sensory, contrast, font-size and reading ruler states', () => {
  const contextPath = path.resolve('src/context/SensoryContext.tsx');
  const contextContent = fs.readFileSync(contextPath, 'utf8');

  assert.ok(contextContent.includes('isSensoryFriendly'), 'Context must support isSensoryFriendly');
  assert.ok(contextContent.includes('highContrast'), 'Context must support highContrast');
  assert.ok(contextContent.includes('fontSize'), 'Context must support fontSize scaling');
  assert.ok(contextContent.includes('readingRuler'), 'Context must support readingRuler');
  assert.ok(contextContent.includes('reducedMotion'), 'Context must support reducedMotion');
});

test('AccessibilityToolbar component provides interactive sensory & a11y controls', () => {
  const toolbarPath = path.resolve('src/components/ui/AccessibilityToolbar.tsx');
  assert.ok(fs.existsSync(toolbarPath), 'AccessibilityToolbar.tsx must exist');
  
  const toolbarContent = fs.readFileSync(toolbarPath, 'utf8');
  assert.ok(toolbarContent.includes('Akadálymentesítés') || toolbarContent.includes('Szenzoros'), 'Toolbar must have Hungarian labels');
  assert.ok(toolbarContent.includes('aria-label') || toolbarContent.includes('aria-expanded'), 'Toolbar must have ARIA labels');
});

test('ReadingRuler component is available for visual focus guidance', () => {
  const rulerPath = path.resolve('src/components/ui/ReadingRuler.tsx');
  assert.ok(fs.existsSync(rulerPath), 'ReadingRuler.tsx must exist');
});

test('globals.css includes styles for high contrast, enlarged fonts and reduced motion', () => {
  const cssPath = path.resolve('src/app/globals.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');

  assert.ok(cssContent.includes('.contrast-high'), 'Must define .contrast-high');
  assert.ok(cssContent.includes('.font-large'), 'Must define .font-large');
  assert.ok(cssContent.includes('.font-larger'), 'Must define .font-larger');
});

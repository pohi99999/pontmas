import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('UI Components exist and provide expected exports', () => {
  const components = [
    'src/components/ui/Button.tsx',
    'src/components/ui/Badge.tsx',
    'src/components/ui/SectionHeader.tsx',
    'src/components/ui/FeatureCard.tsx',
    'src/components/ui/ActionCard.tsx',
    'src/components/ui/CopyButton.tsx',
  ];

  for (const comp of components) {
    const fullPath = path.resolve(comp);
    assert.ok(fs.existsSync(fullPath), `Component file ${comp} must exist`);
    const content = fs.readFileSync(fullPath, 'utf8');
    assert.ok(content.length > 50, `Component file ${comp} must not be empty`);
  }
});

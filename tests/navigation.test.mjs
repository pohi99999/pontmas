import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { renderHtml, visibleText } from './helpers/render.mjs';

test('Header component supports accessible mobile menu and sensory toggle', () => {
  const headerPath = path.resolve('src/components/layout/Header.tsx');
  const headerContent = fs.readFileSync(headerPath, 'utf8');

  assert.ok(headerContent.includes('aria-expanded'), 'Header mobile button must have aria-expanded');
  assert.ok(headerContent.includes('isOpen') || headerContent.includes('isMobileMenuOpen'), 'Header must track mobile menu open state');
  assert.ok(headerContent.includes('/tamogatas'), 'Header must have quick donation link');
  assert.ok(headerContent.includes('/segitseg'), 'Header must link to /segitseg');
  assert.ok(headerContent.includes('/rolunk-irtak'), 'Header must link to /rolunk-irtak');
  assert.ok(headerContent.includes('/hirek'), 'Header must link to /hirek');
  assert.ok(headerContent.includes('toggleSensoryMode'), 'Header must have sensory mode toggle');
});

test('Footer component contains essential NGO legal details and quick links', async () => {
  const footerPath = path.resolve('src/components/layout/Footer.tsx');
  const footerContent = fs.readFileSync(footerPath, 'utf8');

  const shown = visibleText(await renderHtml('components/layout/Footer.tsx'));
  assert.ok(shown.includes('18654996-1-18'), 'Footer must contain tax number');
  assert.ok(shown.includes('11600006-00000000-75701521'), 'Footer must contain bank account');
  assert.ok(shown.includes('9700 Szombathely'), 'Footer must contain city');
  assert.ok(footerContent.includes('/dokumentumok'), 'Footer must link to documents');
});

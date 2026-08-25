import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

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

test('Footer component contains essential NGO legal details and quick links', () => {
  const footerPath = path.resolve('src/components/layout/Footer.tsx');
  const footerContent = fs.readFileSync(footerPath, 'utf8');

  assert.ok(footerContent.includes('18654996-1-18'), 'Footer must contain tax number');
  assert.ok(footerContent.includes('11600006-00000000-75701521'), 'Footer must contain bank account');
  assert.ok(footerContent.includes('Szombathely'), 'Footer must contain city');
  assert.ok(footerContent.includes('/dokumentumok'), 'Footer must link to documents');
});

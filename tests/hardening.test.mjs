// Response headers and the JSON-LD block (hardening, 2026-10-30). The headers module is what
// next.config.ts serves on every route; the JSON-LD helper keeps a "</script>" in any value from
// ending the inline script tag.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { SECURITY_HEADERS, CONTENT_SECURITY_POLICY } from '../src/lib/securityHeaders.ts';
import { jsonLdScript } from '../src/lib/jsonLd.ts';

const header = (key) => SECURITY_HEADERS.find((h) => h.key === key)?.value;

test('Hardening: every expected header is set', () => {
  assert.match(header('Strict-Transport-Security'), /^max-age=\d{8,}; includeSubDomains$/);
  assert.equal(header('X-Frame-Options'), 'DENY');
  assert.equal(header('X-Content-Type-Options'), 'nosniff');
  assert.equal(header('Referrer-Policy'), 'strict-origin-when-cross-origin');
  assert.match(header('Permissions-Policy'), /camera=\(\).*microphone=\(\).*geolocation=\(\)/);
});

test('Hardening: the CSP is report-only, so it cannot break a page', () => {
  assert.equal(header('Content-Security-Policy'), undefined);
  assert.equal(header('Content-Security-Policy-Report-Only'), CONTENT_SECURITY_POLICY);
  for (const d of ["frame-ancestors 'none'", "connect-src 'self'", "form-action 'self'", "object-src 'none'"]) {
    assert.ok(CONTENT_SECURITY_POLICY.includes(d), d);
  }
});

test('Hardening: next.config.ts serves the headers on every route', () => {
  const src = fs.readFileSync(path.resolve('next.config.ts'), 'utf8');
  assert.match(src, /source: "\/:path\*", headers: SECURITY_HEADERS/);
});

test('Hardening: JSON-LD cannot close its script tag, and reads back the same', () => {
  const data = { name: 'A </script><script>alert(1)</script> & B', line: 'x\u2028y' };
  const out = jsonLdScript(data);
  assert.ok(!out.includes('<') && !out.includes('>') && !out.includes('&'), out);
  assert.deepEqual(JSON.parse(out), data);
});

test('Hardening: the layout writes its JSON-LD through the helper', () => {
  const src = fs.readFileSync(path.resolve('src/app/layout.tsx'), 'utf8');
  assert.match(src, /__html: jsonLdScript\(jsonLd\)/);
  assert.ok(!src.includes('JSON.stringify(jsonLd)'));
});

// Response headers for every route (next.config.ts headers()). The CSP is Report-Only for now:
// the browser logs what it would block but blocks nothing, so the site keeps working while the
// policy is checked page by page; it can be switched to enforcing once the console is clean.
// 'unsafe-inline' for scripts is needed by Next.js's inline hydration scripts and the JSON-LD block;
// for styles by framer-motion's inline styles.
export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

export const SECURITY_HEADERS: { key: string; value: string }[] = [
  // No preload: that would commit every subdomain of pontmas.hu to HTTPS.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy-Report-Only', value: CONTENT_SECURITY_POLICY },
];

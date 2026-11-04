// Login of the content editor, as pure functions (node:crypto only) so node:test can run them.
//
// No password. The editor asks for a link; if the address is on the EDITOR_EMAILS allow-list, a
// signed link valid for 15 minutes is mailed. Opening it shows a single "Belépés" button (mail
// scanners open links but do not press buttons), which exchanges the token for a signed session
// cookie valid for 12 hours. Both are HMAC-SHA256 with EDITOR_SESSION_SECRET; with a secret shorter
// than 32 characters the login is switched off (the routes answer 503).
import { createHmac, timingSafeEqual } from 'node:crypto';

export const LOGIN_TOKEN_TTL_MS = 15 * 60_000;
export const SESSION_TTL_MS = 12 * 60 * 60_000;
export const MIN_SECRET_LENGTH = 32;
export const SESSION_COOKIE = 'pm_szerkeszto';

const EMAIL_RE = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]{2,}$/;

export function normalizeEmail(v: unknown): string {
  return typeof v === 'string' ? v.trim().toLowerCase() : '';
}

export function isEmail(v: string): boolean {
  return v.length <= 200 && EMAIL_RE.test(v);
}

/** EDITOR_EMAILS: addresses separated by commas, semicolons or whitespace; case does not matter. */
export function parseAllowList(raw: string | undefined): string[] {
  if (!raw) return [];
  return [...new Set(raw.split(/[\s,;]+/).map(normalizeEmail).filter(isEmail))];
}

export function isAllowed(email: string, allowList: string[]): boolean {
  const e = normalizeEmail(email);
  return !!e && allowList.includes(e);
}

export function secretUsable(secret: string | undefined): secret is string {
  return typeof secret === 'string' && secret.length >= MIN_SECRET_LENGTH;
}

/** Constant-time comparison of two strings of any length (both are hashed to the same size first). */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHmac('sha256', 'cmp').update(a).digest();
  const hb = createHmac('sha256', 'cmp').update(b).digest();
  return timingSafeEqual(ha, hb) && a.length === b.length;
}

type Purpose = 'login' | 'session';
interface Payload {
  p: Purpose;
  e: string;
  x: number;
}

const b64 = (s: string | Buffer) => Buffer.from(s).toString('base64url');
const sign = (secret: string, purpose: Purpose, body: string) => createHmac('sha256', secret).update(`${purpose}.${body}`).digest('base64url');

function issue(purpose: Purpose, email: string, secret: string, now: number, ttl: number): string {
  if (!secretUsable(secret)) throw new Error('secret too short');
  const body = b64(JSON.stringify({ p: purpose, e: normalizeEmail(email), x: now + ttl } satisfies Payload));
  return `${body}.${sign(secret, purpose, body)}`;
}

/** Returns the address the token was issued for, or null (bad signature, expired, wrong kind, not allowed). */
function check(purpose: Purpose, token: unknown, secret: string | undefined, now: number, allowList: string[]): string | null {
  if (!secretUsable(secret) || typeof token !== 'string' || token.length > 1000) return null;
  const parts = token.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  const [body, sig] = parts;
  if (!safeEqual(sig, sign(secret, purpose, body))) return null;
  let payload: Payload;
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as Payload;
  } catch {
    return null;
  }
  if (payload.p !== purpose || typeof payload.e !== 'string' || typeof payload.x !== 'number') return null;
  if (now >= payload.x) return null;
  // the allow-list is checked again: removing an address ends its access
  return isAllowed(payload.e, allowList) ? payload.e : null;
}

export const createLoginToken = (email: string, secret: string, now: number) => issue('login', email, secret, now, LOGIN_TOKEN_TTL_MS);
export const verifyLoginToken = (token: unknown, secret: string | undefined, now: number, allowList: string[]) =>
  check('login', token, secret, now, allowList);

export const createSessionValue = (email: string, secret: string, now: number) => issue('session', email, secret, now, SESSION_TTL_MS);
export const verifySessionValue = (value: unknown, secret: string | undefined, now: number, allowList: string[]) =>
  check('session', value, secret, now, allowList);

/** HttpOnly, Secure, SameSite=Lax, 12 hours. */
export function sessionCookie(value: string): string {
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_TTL_MS / 1000}`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export function readCookie(header: string | null | undefined, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return null;
}

/** The logged-in editor's address from a request's Cookie header, or null. */
export function sessionFromCookieHeader(header: string | null, env: { EDITOR_SESSION_SECRET?: string; EDITOR_EMAILS?: string }, now: number): string | null {
  return verifySessionValue(readCookie(header, SESSION_COOKIE), env.EDITOR_SESSION_SECRET, now, parseAllowList(env.EDITOR_EMAILS));
}

/**
 * A changing request must come from this site: the Origin header has to name the same host the
 * request was sent to, over https (http only for localhost during development).
 */
export function sameOrigin(headers: Headers, requestUrl: string): string | null {
  const origin = headers.get('origin');
  if (!origin) return null;
  let o: URL;
  try {
    o = new URL(origin);
  } catch {
    return null;
  }
  const host = headers.get('x-forwarded-host') ?? headers.get('host') ?? new URL(requestUrl).host;
  const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(o.host);
  if (o.host !== host) return null;
  if (o.protocol !== 'https:' && !(local && o.protocol === 'http:')) return null;
  return o.origin;
}

// The editor's API (routes under src/app/api/szerkeszto/), as plain functions with every outside
// service injected: the store, fetch (Resend), the clock, the cache revalidation and the deferred
// work. The route files only wire in the real ones, so node:test runs all of this with fakes.
//
// Rules for every route that changes something: the Origin header must be this site (403
// otherwise), and there must be a valid session (401 otherwise). Login and its link redemption have
// no session yet, so they check the Origin only.
import { SEED_CONTENT } from '../content/seed';
import { prepareSave } from '../content/save';
import type { ContentStore } from '../content/store';
import { DECLARATION_HEADER, type SiteContent } from '../content/types';
import {
  clearSessionCookie,
  createLoginToken,
  createSessionValue,
  isAllowed,
  isEmail,
  normalizeEmail,
  parseAllowList,
  sameOrigin,
  secretUsable,
  sessionCookie,
  sessionFromCookieHeader,
  verifyLoginToken,
  LOGIN_TOKEN_TTL_MS,
} from './editorAuth';
import { changeMail, loginMail, mailConfigured, sendMail } from './editorMail';
import { checkImage, MAX_UPLOAD_BYTES } from './imageCheck';
import { createRateLimiter, type RateLimiter } from './rateLimit';

export type EditorEnv = {
  EDITOR_EMAILS?: string;
  EDITOR_SESSION_SECRET?: string;
  EDITOR_NOTIFY_TO?: string;
  RESEND_API_KEY?: string;
  CONTACT_FROM?: string;
};

export interface EditorDeps {
  env: EditorEnv;
  store: ContentStore | null;
  fetchFn: typeof fetch;
  now: () => Date;
  limiters: EditorLimiters;
  /** Login tokens already exchanged in this instance (a link works once per instance). */
  usedTokens: Map<string, number>;
  /** Invalidates the cached public content. */
  revalidate: () => void;
  /** Work to finish after the answer is sent (next/server after() in the routes). */
  defer: (task: () => Promise<void>) => void;
  /** Logging; never given an e-mail address. */
  log: (msg: string) => void;
}

export interface EditorLimiters {
  loginIp: RateLimiter;
  loginAddress: RateLimiter;
  upload: RateLimiter;
}

/** Per instance (in memory): 5 login requests per IP per 10 minutes, 3 mails per address per hour. */
export function createEditorLimiters(): EditorLimiters {
  return {
    loginIp: createRateLimiter(10 * 60_000, 5),
    loginAddress: createRateLimiter(60 * 60_000, 3),
    upload: createRateLimiter(60 * 60_000, 30),
  };
}

const MAX_JSON_BYTES = 1024 * 1024;

function json(status: number, body: unknown, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra },
  });
}

const fail = (status: number, error: string, extra?: Record<string, string>) => json(status, { ok: false, error }, extra);

function clientIp(req: Request): string {
  return (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
}

async function readJson(req: Request): Promise<{ ok: true; value: unknown } | { ok: false; res: Response }> {
  const len = Number(req.headers.get('content-length') ?? '0');
  if (len > MAX_JSON_BYTES) return { ok: false, res: fail(413, 'too_large') };
  const text = await req.text();
  if (text.length > MAX_JSON_BYTES) return { ok: false, res: fail(413, 'too_large') };
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, res: fail(400, 'invalid:json') };
  }
}

/** The logged-in editor's address, or null. */
export function currentEditor(req: Request, deps: Pick<EditorDeps, 'env' | 'now'>): string | null {
  return sessionFromCookieHeader(req.headers.get('cookie'), deps.env, deps.now().getTime());
}

type Guard = { ok: true; editor: string } | { ok: false; res: Response };

/** Origin first (403), then the session (401). */
function guardChange(req: Request, deps: EditorDeps): Guard {
  if (!sameOrigin(req.headers, req.url)) return { ok: false, res: fail(403, 'bad_origin') };
  if (!secretUsable(deps.env.EDITOR_SESSION_SECRET)) return { ok: false, res: fail(503, 'login_disabled') };
  const editor = currentEditor(req, deps);
  return editor ? { ok: true, editor } : { ok: false, res: fail(401, 'unauthorized') };
}

function notify(deps: EditorDeps, info: { editor: string; summary: string; at: Date; imageUrl?: string }) {
  const to = deps.env.EDITOR_NOTIFY_TO?.trim();
  if (!to || !mailConfigured(deps.env)) {
    deps.log('[szerkeszto] értesítés kihagyva: nincs beállítva');
    return;
  }
  deps.defer(async () => {
    const sent = await sendMail(changeMail(to, info), deps.env, deps.fetchFn).catch(() => false);
    if (!sent) deps.log('[szerkeszto] az értesítő levél nem ment el');
  });
}

// ---------------------------------------------------------------- login

/** The same answer for every well-formed address, allowed or not; a mail goes only to allowed ones. */
export const LOGIN_ANSWER = { ok: true } as const;

export async function handleLogin(req: Request, deps: EditorDeps): Promise<Response> {
  const origin = sameOrigin(req.headers, req.url);
  if (!origin) return fail(403, 'bad_origin');
  if (deps.limiters.loginIp.hit(clientIp(req), deps.now().getTime())) return fail(429, 'rate_limited');
  const secret = deps.env.EDITOR_SESSION_SECRET;
  if (!secretUsable(secret) || !mailConfigured(deps.env)) return fail(503, 'login_disabled');
  const body = await readJson(req);
  if (!body.ok) return body.res;
  const email = normalizeEmail((body.value as { email?: unknown } | null)?.email);
  if (!isEmail(email)) return fail(400, 'invalid:email');
  const now = deps.now().getTime();
  // counted for every address, so the limit itself reveals nothing either
  if (deps.limiters.loginAddress.hit(email, now)) return json(200, LOGIN_ANSWER);
  if (isAllowed(email, parseAllowList(deps.env.EDITOR_EMAILS))) {
    const link = `${origin}/szerkeszto/belepes#t=${createLoginToken(email, secret, now)}`;
    // sent after the answer, so an allowed address does not answer slower than an unknown one
    deps.defer(async () => {
      const sent = await sendMail(loginMail(email, link), deps.env, deps.fetchFn).catch(() => false);
      if (!sent) deps.log('[szerkeszto] a belépési levél nem ment el');
    });
  }
  return json(200, LOGIN_ANSWER);
}

export async function handleRedeem(req: Request, deps: EditorDeps): Promise<Response> {
  if (!sameOrigin(req.headers, req.url)) return fail(403, 'bad_origin');
  const secret = deps.env.EDITOR_SESSION_SECRET;
  if (!secretUsable(secret)) return fail(503, 'login_disabled');
  if (deps.limiters.loginIp.hit(`redeem:${clientIp(req)}`, deps.now().getTime())) return fail(429, 'rate_limited');
  const body = await readJson(req);
  if (!body.ok) return body.res;
  const token = (body.value as { token?: unknown } | null)?.token;
  const now = deps.now().getTime();
  const email = verifyLoginToken(token, secret, now, parseAllowList(deps.env.EDITOR_EMAILS));
  if (!email || deps.usedTokens.has(token as string)) return fail(400, 'invalid_token');
  for (const [t, exp] of deps.usedTokens) if (exp < now) deps.usedTokens.delete(t);
  deps.usedTokens.set(token as string, now + LOGIN_TOKEN_TTL_MS);
  return json(200, { ok: true }, { 'Set-Cookie': sessionCookie(createSessionValue(email, secret, now)) });
}

export async function handleLogout(req: Request, deps: EditorDeps): Promise<Response> {
  const g = guardChange(req, deps);
  if (!g.ok) return g.res;
  return json(200, { ok: true }, { 'Set-Cookie': clearSessionCookie() });
}

// ---------------------------------------------------------------- content

export async function handleContentGet(req: Request, deps: EditorDeps): Promise<Response> {
  const editor = secretUsable(deps.env.EDITOR_SESSION_SECRET) ? currentEditor(req, deps) : null;
  if (!editor) return fail(401, 'unauthorized');
  if (!deps.store) return json(200, { ok: true, editor, storeConfigured: false, content: SEED_CONTENT, base: null, history: [] });
  try {
    const stored = await deps.store.read();
    const history = await deps.store.listHistory();
    const content = stored ?? SEED_CONTENT;
    return json(200, { ok: true, editor, storeConfigured: true, content, base: stored?.updatedAt ?? null, history });
  } catch {
    // never hand the seed to the editor here: saving it would overwrite the real content
    deps.log('[szerkeszto] a tároló nem olvasható');
    return fail(502, 'store_unavailable');
  }
}

/** Drops images whose file is gone (deleted since that version), so a restore never shows a broken or removed photo. */
async function withExistingImages(content: SiteContent, store: ContentStore): Promise<SiteContent> {
  const check = async <T extends { image?: { url: string } }>(it: T): Promise<T> => {
    if (!it.image) return it;
    if (await store.hasFile(it.image.url).catch(() => false)) return it;
    const copy = { ...it };
    delete copy.image;
    return copy;
  };
  return { ...content, news: await Promise.all(content.news.map(check)), programs: await Promise.all(content.programs.map(check)) };
}

export async function handleContentPut(req: Request, deps: EditorDeps): Promise<Response> {
  const g = guardChange(req, deps);
  if (!g.ok) return g.res;
  const store = deps.store;
  if (!store) return fail(503, 'store_unavailable');
  const body = await readJson(req);
  if (!body.ok) return body.res;
  const b = (body.value ?? {}) as { base?: unknown; content?: unknown; restore?: unknown };

  let prev: SiteContent | null;
  try {
    prev = await store.read();
  } catch {
    return fail(502, 'store_unavailable');
  }
  // somebody else saved since this editor loaded the content
  if ((b.base ?? null) !== (prev?.updatedAt ?? null)) return fail(409, 'conflict');

  let raw: unknown = b.content;
  let prefix = '';
  if (b.restore !== undefined) {
    if (typeof b.restore !== 'string') return fail(400, 'invalid:restore');
    const old = await store.readHistory(b.restore).catch(() => null);
    if (!old) return fail(404, 'version_not_found');
    raw = await withExistingImages(old, store);
    prefix = 'Visszaállítás: ';
  }

  const now = deps.now();
  const prepared = prepareSave(prev ?? SEED_CONTENT, raw, g.editor, now);
  if (!prepared.ok) return json(400, { ok: false, error: 'invalid', errors: prepared.errors });

  const summary = `${prefix}${prepared.summary}`;
  let entry;
  try {
    entry = await store.write(prepared.content, g.editor, summary);
  } catch {
    return fail(502, 'store_unavailable');
  }
  // a photo taken off the site is also taken out of the store
  for (const url of prepared.removedImages) {
    await store.deleteFile(url).catch(() => deps.log('[szerkeszto] egy kép törlése nem sikerült'));
  }
  deps.revalidate();
  notify(deps, { editor: g.editor, summary, at: now });
  const history = await store.listHistory().catch(() => []);
  return json(200, { ok: true, content: { ...prepared.content, updatedAt: entry.at }, base: entry.at, history, summary });
}

// ---------------------------------------------------------------- upload

export async function handleUpload(req: Request, deps: EditorDeps): Promise<Response> {
  const g = guardChange(req, deps);
  if (!g.ok) return g.res;
  const store = deps.store;
  if (!store) return fail(503, 'store_unavailable');
  // no declaration, no file: an image without the child photo declaration is never stored
  if (req.headers.get(DECLARATION_HEADER) !== '1') return fail(400, 'declaration_required');
  if (deps.limiters.upload.hit(g.editor, deps.now().getTime())) return fail(429, 'rate_limited');
  const len = Number(req.headers.get('content-length') ?? '0');
  if (len > MAX_UPLOAD_BYTES) return fail(413, 'too_large');
  const bytes = new Uint8Array(await req.arrayBuffer());
  const check = checkImage(bytes);
  if (!check.ok) return fail(check.status, check.error);
  let file;
  try {
    file = await store.putFile(bytes, check.kind.ext, check.kind.contentType);
  } catch {
    return fail(502, 'store_unavailable');
  }
  notify(deps, { editor: g.editor, summary: '+1 kép feltöltve', at: deps.now(), imageUrl: file.url });
  return json(200, { ok: true, url: file.url, width: check.width, height: check.height });
}

// The chat's shared counters (card c017f163): model calls per day and micro-USD spent per month,
// across every server instance. Upstash Redis over its REST API (the Vercel Marketplace integration
// creates KV_REST_API_*; a hand-made setup UPSTASH_REDIS_REST_*), so no extra package. Preview and
// Production share a store, so every key carries VERCEL_ENV: a preview test never spends the
// production budget.
//
// Fail closed: a store that errors or times out means no model call (handle.ts), never an unlimited one.
import type { ChatConfig } from './config';

export interface Kv {
  get(key: string): Promise<number>;
  /** Adds n and (re)sets the expiry; returns the new value. */
  incrBy(key: string, n: number, ttlSeconds: number): Promise<number>;
}

const TIMEOUT_MS = 2500;

export function upstashKv(url: string, token: string, fetchFn: typeof fetch): Kv {
  async function call(pathname: string, body: unknown): Promise<unknown> {
    const res = await fetchFn(`${url}${pathname}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`kv http ${res.status}`);
    return res.json();
  }
  return {
    async get(key) {
      const r = (await call('', ['GET', key])) as { result?: unknown; error?: string };
      if (r.error) throw new Error('kv error');
      const n = Number(r.result ?? 0);
      if (!Number.isFinite(n)) throw new Error('kv value');
      return n;
    },
    async incrBy(key, n, ttlSeconds) {
      const r = (await call('/pipeline', [['INCRBY', key, String(n)], ['EXPIRE', key, String(ttlSeconds)]])) as { result?: unknown; error?: string }[];
      if (!Array.isArray(r) || r.some((x) => x?.error)) throw new Error('kv error');
      const v = Number(r[0]?.result);
      if (!Number.isFinite(v)) throw new Error('kv value');
      return v;
    },
  };
}

/** Per-instance memory: only with PONTMAS_CHAT_WORKSPACE_LIMIT_CONFIRMED (the Anthropic limit is the hard cap). */
export function memoryKv(now: () => number = Date.now): Kv {
  const m = new Map<string, { v: number; until: number }>();
  const live = (k: string) => {
    const e = m.get(k);
    if (e && e.until <= now()) m.delete(k);
    return m.get(k);
  };
  return {
    async get(k) {
      return live(k)?.v ?? 0;
    },
    async incrBy(k, n, ttl) {
      const v = (live(k)?.v ?? 0) + n;
      m.set(k, { v, until: now() + ttl * 1000 });
      return v;
    },
  };
}

const BUDAPEST = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Budapest', year: 'numeric', month: '2-digit', day: '2-digit' });

/** "2026-11-10" in Budapest: the daily count resets at local midnight, the month on the 1st. */
export function budapestDay(ms: number): string {
  return BUDAPEST.format(ms);
}

export function budgetKeys(scope: string, ms: number) {
  const day = budapestDay(ms);
  return { daily: `pontmas:chat:${scope}:calls:${day}`, monthly: `pontmas:chat:${scope}:usd-micro:${day.slice(0, 7)}` };
}

export const DAY_TTL = 2 * 24 * 3600;
export const MONTH_TTL = 40 * 24 * 3600;

export function kvFor(store: NonNullable<ChatConfig['store']>, fetchFn: typeof fetch, memory: Kv): Kv {
  return store.kind === 'redis' ? upstashKv(store.url, store.token, fetchFn) : memory;
}

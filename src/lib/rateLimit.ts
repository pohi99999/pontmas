// A sliding-window counter in memory, the same pattern as src/app/api/kapcsolat/route.ts.
// It lives in one server instance: enough to stop a script hammering one instance, not a global
// limit (another instance has its own counters).
export interface RateLimiter {
  /** Counts one hit for the key; true when the key is over the limit (the hit is then not counted). */
  hit(key: string, now?: number): boolean;
}

export function createRateLimiter(windowMs: number, max: number): RateLimiter {
  const hits = new Map<string, number[]>();
  return {
    hit(key, now = Date.now()) {
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= max) {
        hits.set(key, recent);
        return true;
      }
      recent.push(now);
      hits.set(key, recent);
      if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
      return false;
    },
  };
}

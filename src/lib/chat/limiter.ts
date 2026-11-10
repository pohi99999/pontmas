// Per-visitor brake of the chat: at most `max` messages per window per IP (the HomolaMentor chat's
// WindowLimiter, src/lib/propertyResearch/limits.ts there). It lives in one server instance's memory:
// a quick stop for one script hammering one instance. The hard limits are the shared daily and monthly
// counters (budget.ts) and the Anthropic workspace limit.
export class WindowLimiter {
  private hits = new Map<string, number[]>();
  constructor(private max: number, private windowMs: number, private now: () => number = Date.now) {}

  /** Counts a hit and returns true when allowed; over the limit nothing is counted. */
  take(key: string): boolean {
    const t = this.now();
    const recent = (this.hits.get(key) ?? []).filter((h) => t - h < this.windowMs);
    if (recent.length >= this.max) {
      this.hits.set(key, recent);
      return false;
    }
    recent.push(t);
    this.hits.set(key, recent);
    if (this.hits.size > 10_000) for (const [k, v] of this.hits) if (!v.some((h) => t - h < this.windowMs)) this.hits.delete(k);
    return true;
  }
}

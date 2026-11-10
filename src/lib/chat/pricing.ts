// Cost of one model call in micro-USD, from the usage the API returns (card c017f163). Prices are
// USD per million tokens, so tokens x price = micro-USD. Source: the Claude API price table in
// Anthropic's claude-api reference, cached 2026-10-06 (Haiku 5.5 up to 100K-token prompts: $0.10 in,
// $0.50 out; cache read 0.1x, 5-minute cache write 1.25x). Not re-measured against the live pricing
// page: check https://platform.claude.com/docs/en/about-claude/pricing before relying on a cap.
//
// A model that is not in this table is refused (config.ts): an unknown price cannot be capped.

export interface Price {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
}

export const PRICES: Record<string, Price> = {
  'claude-haiku-5-5': { input: 0.1, output: 0.5, cacheRead: 0.01, cacheWrite: 0.125 },
  'claude-sonnet-5-5': { input: 2, output: 10, cacheRead: 0.2, cacheWrite: 2.5 },
};

export interface Usage {
  input_tokens?: number | null;
  output_tokens?: number | null;
  cache_read_input_tokens?: number | null;
  cache_creation_input_tokens?: number | null;
}

/** Micro-USD, rounded up: the budget never under-counts. */
export function costMicroUsd(model: string, u: Usage): number {
  const p = PRICES[model];
  if (!p) throw new Error(`no price for ${model}`);
  const n = (v: number | null | undefined) => (typeof v === 'number' && v > 0 ? v : 0);
  return Math.ceil(n(u.input_tokens) * p.input + n(u.output_tokens) * p.output + n(u.cache_read_input_tokens) * p.cacheRead + n(u.cache_creation_input_tokens) * p.cacheWrite);
}

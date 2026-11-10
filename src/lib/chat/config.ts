// When the chat may run, and with what limits (card c017f163). Off unless EVERY condition holds:
// - PONTMAS_CHAT_ENABLED is exactly "true" (the switch; default off);
// - every approval in approvals.ts is given;
// - the key PONTMAS_ANTHROPIC_API_KEY is set (Production only; never the HomolaMentor key);
// - the model has a known price (pricing.ts), so its cost can be capped;
// - a hard monthly cap exists: a shared counter (Upstash Redis, KV_REST_API_* or UPSTASH_REDIS_REST_*),
//   or, if Péter confirmed a spend limit on the Anthropic workspace of the key, the flag
//   PONTMAS_CHAT_WORKSPACE_LIMIT_CONFIRMED=true (then the counters are per-instance memory, and the
//   workspace limit is the hard cap).
import { CHAT_APPROVALS, pendingApprovals } from './approvals';
import { PRICES } from './pricing';

type ChatEnvKey =
  | 'PONTMAS_CHAT_ENABLED' | 'PONTMAS_ANTHROPIC_API_KEY' | 'PONTMAS_CHAT_MODEL' | 'PONTMAS_CHAT_ORIGINS'
  | 'PONTMAS_CHAT_DAILY_CAP' | 'PONTMAS_CHAT_PER_10_MIN' | 'PONTMAS_CHAT_MONTHLY_USD'
  | 'PONTMAS_CHAT_WORKSPACE_LIMIT_CONFIRMED'
  | 'KV_REST_API_URL' | 'KV_REST_API_TOKEN' | 'UPSTASH_REDIS_REST_URL' | 'UPSTASH_REDIS_REST_TOKEN' | 'VERCEL_ENV';

/** The variables the chat reads (process.env fits it). */
export type ChatEnv = { readonly [K in ChatEnvKey]?: string } & { readonly [key: string]: string | undefined };

export const DEFAULT_MODEL = 'claude-haiku-5-5';
export const DEFAULT_ORIGINS = ['https://pontmas.hu', 'https://www.pontmas.hu', 'https://pontmas.vercel.app'];

export interface ChatConfig {
  enabled: boolean;
  /** Why it is off; empty when enabled. Logged as names only. */
  blockers: string[];
  model: string;
  origins: string[];
  dailyCap: number;
  perTenMinutes: number;
  monthlyMicroUsd: number;
  store: { kind: 'redis'; url: string; token: string; scope: string } | { kind: 'memory'; scope: string } | null;
}

function int(raw: string | undefined, fallback: number, min: number): number {
  const n = Number.parseInt(raw ?? '', 10);
  return Number.isFinite(n) && n >= min ? n : fallback;
}

function usd(raw: string | undefined, fallback: number): number {
  const n = Number.parseFloat(raw ?? '');
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export function chatConfig(env: ChatEnv, approvals: Record<string, boolean> = CHAT_APPROVALS): ChatConfig {
  const blockers: string[] = [];
  if (env.PONTMAS_CHAT_ENABLED?.trim() !== 'true') blockers.push('switch_off');
  for (const a of pendingApprovals(approvals)) blockers.push(`approval_pending:${a}`);
  if (!env.PONTMAS_ANTHROPIC_API_KEY?.trim()) blockers.push('no_key');

  const model = env.PONTMAS_CHAT_MODEL?.trim() || DEFAULT_MODEL;
  if (!PRICES[model]) blockers.push('unknown_model');

  const scope = (env.VERCEL_ENV || 'local').trim();
  const url = (env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL || '').trim();
  const token = (env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN || '').trim();
  const store: ChatConfig['store'] = url && token
    ? { kind: 'redis', url: url.replace(/\/+$/, ''), token, scope }
    : env.PONTMAS_CHAT_WORKSPACE_LIMIT_CONFIRMED?.trim() === 'true' ? { kind: 'memory', scope } : null;
  if (!store) blockers.push('no_hard_cap');

  const origins = (env.PONTMAS_CHAT_ORIGINS?.split(',').map((o) => o.trim().replace(/\/+$/, '')).filter(Boolean)) || [];
  return {
    enabled: blockers.length === 0,
    blockers,
    model,
    origins: origins.length ? origins : DEFAULT_ORIGINS,
    dailyCap: int(env.PONTMAS_CHAT_DAILY_CAP, 300, 0),
    perTenMinutes: int(env.PONTMAS_CHAT_PER_10_MIN, 10, 1),
    monthlyMicroUsd: Math.round(usd(env.PONTMAS_CHAT_MONTHLY_USD, 15) * 1_000_000),
    store,
  };
}

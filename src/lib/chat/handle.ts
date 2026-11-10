// The chat endpoint's logic, without Next imports, so node:test runs it with fakes (card c017f163).
// Order of the gates, cheapest and most protective first:
//   Origin -> request shape -> switched on? -> personal data -> per-visitor brake -> daily calls ->
//   monthly spend -> model -> spend recorded.
// The visitor never sees an error page: every refusal is a fixed, friendly answer with the phone
// number (rules.ts FIXED). The log line carries names and numbers only: never the question, the
// answer, the IP or the user agent.
import type { NewsItem, ProgramItem } from '@/content/types';
import { budgetKeys, DAY_TTL, kvFor, MONTH_TTL, type Kv } from './budget';
import { plainText, type ModelCaller, type Turn } from './claude';
import { chatConfig, type ChatEnv } from './config';
import { WindowLimiter } from './limiter';
import { detectPii } from './pii';
import { costMicroUsd } from './pricing';
import { buildSystem } from './prompt';
import { CHAT_LOCALES, FIXED, type ChatLocale } from './rules';

export const MAX_MESSAGE_CHARS = 1000;
/** 12 visitor questions with their answers. */
export const MAX_MESSAGES = 24;

export interface ChatDeps {
  env: ChatEnv;
  now: () => number;
  fetch: typeof fetch;
  /** Builds the model caller; called only after every gate passed. */
  caller: (apiKey: string, model: string) => ModelCaller;
  content: () => Promise<{ news: NewsItem[]; programs: ProgramItem[] }>;
  limiter: WindowLimiter;
  memoryKv: Kv;
  log: (line: string) => void;
  approvals?: Record<string, boolean>;
}

export interface ChatRequest {
  origin: string | null;
  ip: string;
  body: unknown;
}

export type ChatSource = 'claude' | 'fixed';
export interface ChatResponse {
  status: number;
  body: { reply: string; source: ChatSource; reason?: string } | { error: string };
}

function parse(body: unknown): { locale: ChatLocale; turns: Turn[] } | { error: string } | { tooLong: ChatLocale } {
  const b = (body && typeof body === 'object' ? body : {}) as { messages?: unknown; locale?: unknown };
  const locale = (CHAT_LOCALES as readonly string[]).includes(b.locale as string) ? (b.locale as ChatLocale) : 'hu';
  if (!Array.isArray(b.messages) || b.messages.length === 0) return { error: 'no_messages' };
  if (b.messages.length > MAX_MESSAGES) return { tooLong: locale };
  const turns: Turn[] = [];
  for (const m of b.messages) {
    const r = (m ?? {}) as { role?: unknown; content?: unknown };
    if ((r.role !== 'user' && r.role !== 'assistant') || typeof r.content !== 'string') return { error: 'bad_message' };
    const content = r.content.trim();
    if (!content) return { error: 'bad_message' };
    if (content.length > MAX_MESSAGE_CHARS) return { tooLong: locale };
    turns.push({ role: r.role, content });
  }
  // the API wants the conversation to open with the visitor and to alternate; the widget's welcome
  // is not sent, and two same-role turns in a row are merged
  const merged: Turn[] = [];
  for (const t of turns) {
    if (!merged.length && t.role === 'assistant') continue;
    const last = merged[merged.length - 1];
    if (last && last.role === t.role) last.content += `\n\n${t.content}`;
    else merged.push({ ...t });
  }
  if (!merged.length || merged[merged.length - 1].role !== 'user') return { error: 'last_not_user' };
  return { locale, turns: merged };
}

export async function handleChat(req: ChatRequest, deps: ChatDeps): Promise<ChatResponse> {
  const started = deps.now();
  const cfg = chatConfig(deps.env, deps.approvals);
  const log = (outcome: string, reason: string, extra = '') =>
    deps.log(`chat outcome=${outcome} reason=${reason}${extra} ms=${deps.now() - started}`);
  const fixed = (locale: ChatLocale, key: keyof typeof FIXED, reason: string): ChatResponse => {
    log('fixed', reason);
    return { status: 200, body: { reply: FIXED[key][locale], source: 'fixed', reason } };
  };

  if (!req.origin || !cfg.origins.includes(req.origin.replace(/\/+$/, ''))) {
    log('rejected', 'origin');
    return { status: 403, body: { error: 'origin' } };
  }

  const p = parse(req.body);
  if ('error' in p) {
    log('rejected', p.error);
    return { status: 400, body: { error: p.error } };
  }
  if ('tooLong' in p) return fixed(p.tooLong, 'tooLong', 'too_long');
  const { locale, turns } = p;

  if (!cfg.enabled) return fixed(locale, 'off', `off:${cfg.blockers.join(',')}`);
  if (turns.some((t) => t.role === 'user' && detectPii(t.content).length)) return fixed(locale, 'pii', 'pii_blocked');
  if (!deps.limiter.take(req.ip)) return fixed(locale, 'busy', 'rate');

  const store = cfg.store!; // enabled implies a store
  const kv = kvFor(store, deps.fetch, deps.memoryKv);
  const keys = budgetKeys(store.scope, deps.now());
  try {
    if ((await kv.get(keys.monthly)) >= cfg.monthlyMicroUsd) return fixed(locale, 'busy', 'cap_month');
    if ((await kv.incrBy(keys.daily, 1, DAY_TTL)) > cfg.dailyCap) return fixed(locale, 'busy', 'cap_daily');
  } catch {
    return fixed(locale, 'busy', 'budget_store_error');
  }

  let content: { news: NewsItem[]; programs: ProgramItem[] };
  try {
    content = await deps.content();
  } catch {
    content = { news: [], programs: [] };
  }

  let result;
  try {
    result = await deps.caller(deps.env.PONTMAS_ANTHROPIC_API_KEY!.trim(), cfg.model)(buildSystem(locale, content.news, content.programs), turns);
  } catch (e) {
    const status = (e as { status?: unknown })?.status;
    return fixed(locale, 'error', `api_error:${typeof status === 'number' ? status : 'network'}`);
  }

  const u = result.usage;
  const cost = costMicroUsd(cfg.model, u);
  let recorded = 'yes';
  try {
    await kv.incrBy(keys.monthly, cost, MONTH_TTL);
  } catch {
    recorded = 'no';
  }
  const numbers = ` in=${u.input_tokens ?? 0} out=${u.output_tokens ?? 0} cache_read=${u.cache_read_input_tokens ?? 0} cache_write=${u.cache_creation_input_tokens ?? 0} usd_micro=${cost} recorded=${recorded}`;

  if (result.kind === 'refusal') {
    log('fixed', 'refusal', numbers);
    return { status: 200, body: { reply: FIXED.refusal[locale], source: 'fixed', reason: 'refusal' } };
  }
  if (result.kind === 'empty') {
    log('fixed', 'empty', numbers);
    return { status: 200, body: { reply: FIXED.error[locale], source: 'fixed', reason: 'empty' } };
  }
  log('claude', 'ok', numbers);
  return { status: 200, body: { reply: plainText(result.text), source: 'claude' } };
}

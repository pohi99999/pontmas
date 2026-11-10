// One model call through the official SDK (card c017f163). Haiku 5.5 thinks adaptively and cannot
// switch thinking off; effort "low" keeps the thinking (billed as output) short for a chat answer.
// Not sent on purpose: temperature, top_p, top_k (the API version this SDK sends rejects them).
import Anthropic from '@anthropic-ai/sdk';
import type { SystemBlock } from './prompt';
import type { Usage } from './pricing';

export const MAX_TOKENS = 2000;
export const TIMEOUT_MS = 20_000;

export interface Turn {
  role: 'user' | 'assistant';
  content: string;
}

export type ModelResult =
  | { kind: 'text'; text: string; usage: Usage }
  | { kind: 'refusal'; usage: Usage }
  | { kind: 'empty'; usage: Usage };

export type ModelCaller = (system: SystemBlock[], turns: Turn[]) => Promise<ModelResult>;

export function claudeCaller(apiKey: string, model: string, fetchFn?: typeof fetch): ModelCaller {
  const client = new Anthropic({ apiKey, maxRetries: 1, timeout: TIMEOUT_MS, ...(fetchFn ? { fetch: fetchFn } : {}) });
  return async (system, turns) => {
    const res = await client.messages.create({
      model,
      max_tokens: MAX_TOKENS,
      system,
      messages: turns,
      output_config: { effort: 'low' },
    });
    const usage = res.usage as Usage;
    if (res.stop_reason === 'refusal') return { kind: 'refusal', usage };
    // a reply cut at max_tokens is not shown half-finished
    if (res.stop_reason === 'max_tokens') return { kind: 'empty', usage };
    const text = res.content.filter((b) => b.type === 'text').map((b) => (b as { text: string }).text).join('').trim();
    return text ? { kind: 'text', text, usage } : { kind: 'empty', usage };
  };
}

/** The model sometimes writes Markdown anyway; the chat shows plain text. */
export function plainText(s: string): string {
  return s
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/(^|\s)\*(\S[^*]*?)\*(?=\s|$|[.,!?])/g, '$1$2')
    .replace(/^#{1,6}\s+/gm, '')
    .trim();
}

// What must be approved before the chat can be switched on (card c017f163). The chat stays off,
// whatever the environment says, until every item here is true; each one is set in a reviewed pull
// request by the person who approved it, with their name and the date in the comment.
import { LEGAL_DRAFT } from '../legal';

export const CHAT_APPROVALS = {
  /** The foundation read the knowledge (src/lib/chat/knowledge.generated.ts, i.e. the pages' own text). */
  knowledge: false,
  /** The foundation approved the rules: what the chat answers and what it never does (rules.ts). */
  rules: false,
  /** The foundation approved the crisis text word for word (rules.ts CRISIS_TEXT). */
  crisisText: false,
  /** The privacy notice, with its chat section, is approved and published (src/lib/legal.ts). */
  privacyNotice: !LEGAL_DRAFT,
  /** Péter and the foundation read the answers of the 30-question evaluation (tests/chat-eval). */
  evaluation: false,
};

export type ChatApproval = keyof typeof CHAT_APPROVALS;

export function pendingApprovals(a: Record<string, boolean> = CHAT_APPROVALS): string[] {
  return Object.entries(a).filter(([, ok]) => !ok).map(([k]) => k);
}

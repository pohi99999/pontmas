// The contact form's server side, as plain functions (no Next imports) so node:test can run them.
//
// Until 2026-10-19 the form only *simulated* sending: an 800 ms setTimeout, then "Üzenetét sikeresen
// megkaptuk", and nothing left the browser (SECURITY_AUDIT.md M-2). Now /api/kapcsolat validates on
// the server and sends through Resend; the visitor sees success only after Resend accepted the mail.
// Recipient and sender come from the environment (CONTACT_TO, CONTACT_FROM, RESEND_API_KEY): the
// test recipient now, the real one at launch, without a code change.

export const TOPICS = [
  'altalanos',
  'mentorszuloi-tanacsadas',
  'aosz',
  'data-applikacio',
  'szakkonyvtar',
  'intezmenyi-tanacsadas',
  'szulo',
  'onkentes',
  'tamogatas',
] as const;

export const LIMITS = { nev: 120, email: 200, telefon: 40, uzenet: 5000 } as const;

export type ContactInput = { nev: string; email: string; telefon: string; tema: string; uzenet: string };
export type ContactEnv = { RESEND_API_KEY?: string; CONTACT_TO?: string; CONTACT_FROM?: string };
export type SendResult = { status: number; body: { ok: true } | { ok: false; error: string } };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/** Returns the cleaned input, or the name of the first invalid field. */
export function validateContact(raw: unknown): { ok: true; value: ContactInput } | { ok: false; field: string } {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const value: ContactInput = { nev: str(r.nev), email: str(r.email), telefon: str(r.telefon), tema: str(r.tema) || 'altalanos', uzenet: str(r.uzenet) };
  if (!value.nev || value.nev.length > LIMITS.nev) return { ok: false, field: 'nev' };
  if (!EMAIL_RE.test(value.email) || value.email.length > LIMITS.email) return { ok: false, field: 'email' };
  if (value.telefon.length > LIMITS.telefon || /[^\d+\s()/-]/.test(value.telefon)) return { ok: false, field: 'telefon' };
  if (!(TOPICS as readonly string[]).includes(value.tema)) return { ok: false, field: 'tema' };
  if (!value.uzenet || value.uzenet.length > LIMITS.uzenet) return { ok: false, field: 'uzenet' };
  return { ok: true, value };
}

/** Plain-text mail: no HTML, so nothing the visitor typed can be interpreted as markup. */
export function buildEmail(v: ContactInput, from: string, to: string) {
  const text = [
    'Új üzenet a pontmas kapcsolati űrlapjáról.',
    '',
    `Név: ${v.nev}`,
    `E-mail: ${v.email}`,
    `Telefon: ${v.telefon || '-'}`,
    `Téma: ${v.tema}`,
    '',
    v.uzenet,
  ].join('\n');
  // a newline in the subject would be a header injection; the name is single-line after this
  const subject = `Kapcsolati űrlap: ${v.nev.replace(/[\r\n]+/g, ' ').slice(0, 80)}`;
  return { from, to: [to], reply_to: v.email, subject, text };
}

/**
 * Validates and sends. The honeypot field `website` must stay empty (bots fill every field):
 * a filled one gets the same 200 as a real send but nothing is sent.
 */
export async function sendContact(raw: unknown, env: ContactEnv, fetchFn: typeof fetch): Promise<SendResult> {
  const honeypot = raw && typeof raw === 'object' ? str((raw as Record<string, unknown>).website) : '';
  if (honeypot) return { status: 200, body: { ok: true } };
  const key = env.RESEND_API_KEY?.trim(), to = env.CONTACT_TO?.trim(), from = env.CONTACT_FROM?.trim();
  if (!key || !to || !from) return { status: 503, body: { ok: false, error: 'unavailable' } };
  const v = validateContact(raw);
  if (!v.ok) return { status: 400, body: { ok: false, error: `invalid:${v.field}` } };
  let res: Response;
  try {
    res = await fetchFn('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(buildEmail(v.value, from, to)),
    });
  } catch {
    return { status: 502, body: { ok: false, error: 'send_failed' } };
  }
  if (!res.ok) return { status: 502, body: { ok: false, error: 'send_failed' } };
  const data = (await res.json().catch(() => null)) as { id?: string } | null;
  // success only with the id Resend returns for an accepted mail
  return data?.id ? { status: 200, body: { ok: true } } : { status: 502, body: { ok: false, error: 'send_failed' } };
}

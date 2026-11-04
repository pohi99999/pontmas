// Mails of the editor (login link, change notification), sent through Resend with an injected
// fetch, the same way as src/lib/contact.ts. Plain text only.
export type MailEnv = { RESEND_API_KEY?: string; CONTACT_FROM?: string };

export function mailConfigured(env: MailEnv): boolean {
  return !!env.RESEND_API_KEY?.trim() && !!env.CONTACT_FROM?.trim();
}

/** True only when Resend accepted the mail (answered with an id). Never throws. */
export async function sendMail(mail: { to: string; subject: string; text: string }, env: MailEnv, fetchFn: typeof fetch): Promise<boolean> {
  const key = env.RESEND_API_KEY?.trim(), from = env.CONTACT_FROM?.trim();
  if (!key || !from) return false;
  try {
    const res = await fetchFn('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [mail.to], subject: mail.subject.replace(/[\r\n]+/g, ' '), text: mail.text }),
    });
    if (!res.ok) return false;
    const data = (await res.json().catch(() => null)) as { id?: string } | null;
    return !!data?.id;
  } catch {
    return false;
  }
}

export function formatBudapest(d: Date): string {
  return new Intl.DateTimeFormat('hu-HU', { timeZone: 'Europe/Budapest', dateStyle: 'medium', timeStyle: 'short' }).format(d);
}

export function loginMail(to: string, link: string) {
  return {
    to,
    subject: 'Belépés a PontMás honlap szerkesztőjébe',
    text: [
      'Tisztelt Szerkesztő!',
      '',
      'Belépési linket kért a PontMás honlap szerkesztőjéhez. A link 15 percig érvényes:',
      '',
      link,
      '',
      'A link megnyitása után kérjük, kattintson a "Belépés" gombra.',
      'Ha nem Ön kérte a linket, kérjük, hagyja figyelmen kívül ezt a levelet.',
    ].join('\n'),
  };
}

export function changeMail(to: string, info: { editor: string; summary: string; at: Date; imageUrl?: string }) {
  const lines = [
    'Változás történt a PontMás honlap szerkesztőjében.',
    '',
    `Ki: ${info.editor}`,
    `Mi: ${info.summary}`,
    `Mikor: ${formatBudapest(info.at)}`,
  ];
  if (info.imageUrl) lines.push(`Kép: ${info.imageUrl}`);
  return { to, subject: `Szerkesztő: ${info.summary}`.slice(0, 120), text: lines.join('\n') };
}

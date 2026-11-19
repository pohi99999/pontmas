import { NextResponse } from 'next/server';
import { sendContact } from '@/lib/contact';
import { limited } from '@/lib/contactBrake';

// The contact form's endpoint (src/lib/contact.ts has the logic and the why; src/lib/contactBrake.ts the
// per-address brake and how long it keeps an address).

export async function POST(request: Request) {
  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid:json' }, { status: 400 });
  }
  const env = { RESEND_API_KEY: process.env.RESEND_API_KEY, CONTACT_TO: process.env.CONTACT_TO, CONTACT_FROM: process.env.CONTACT_FROM };
  const r = await sendContact(raw, env, fetch);
  return NextResponse.json(r.body, { status: r.status, headers: { 'Cache-Control': 'no-store' } });
}

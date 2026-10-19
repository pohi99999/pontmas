import { NextResponse } from 'next/server';
import { sendContact } from '@/lib/contact';

// The contact form's endpoint (src/lib/contact.ts has the logic and the why).

// Simple per-IP brake against bursts: 5 sends per 10 minutes. It lives in memory, so it is per
// server instance; enough against a script hammering one instance, not a hard global limit.
const WINDOW_MS = 10 * 60_000;
const MAX = 5;
const hits = new Map<string, number[]>();

function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX) { hits.set(ip, recent); return true; }
  recent.push(now); hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return false;
}

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

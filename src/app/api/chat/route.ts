import { NextResponse } from 'next/server';
import { getPublicContent } from '@/content/publicContent';
import { splitNews, visiblePrograms } from '@/content/public';
import { memoryKv } from '@/lib/chat/budget';
import { claudeCaller } from '@/lib/chat/claude';
import { chatConfig } from '@/lib/chat/config';
import { handleChat } from '@/lib/chat/handle';
import { WindowLimiter } from '@/lib/chat/limiter';

// The chat endpoint (card c017f163). Off by default: src/lib/chat/config.ts lists every condition,
// src/lib/chat/handle.ts the gates. The logic and the why live there.
export const maxDuration = 30;

const perVisitor = new WindowLimiter(chatConfig(process.env).perTenMinutes, 10 * 60_000);
const memory = memoryKv();

async function content() {
  const { content } = await getPublicContent();
  const { featured, rest } = splitNews(content.news);
  return { news: featured ? [featured, ...rest] : rest, programs: visiblePrograms(content.programs) };
}

export async function POST(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    // handled as a malformed request below
  }
  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  const r = await handleChat(
    { origin: request.headers.get('origin'), ip, body },
    {
      env: process.env,
      now: Date.now,
      fetch,
      caller: (key, model) => claudeCaller(key, model),
      content,
      limiter: perVisitor,
      memoryKv: memory,
      log: (line) => console.info(line),
    },
  );
  return NextResponse.json(r.body, { status: r.status, headers: { 'Cache-Control': 'no-store' } });
}

"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Send, X } from 'lucide-react';
import { detectPii } from '@/lib/chat/pii';
import { FIXED, type ChatLocale } from '@/lib/chat/rules';

// The chat window (card c017f163). Rendered only when the chat is switched on (layout.tsx asks
// chatConfig), so with the default settings nothing of it is on the page.
//
// - The conversation lives in this component's memory only: no localStorage, nothing on the server.
//   Closing the tab forgets it, so a shared family computer keeps nothing.
// - Personal data is stopped here, before the message leaves the browser (and again on the server).
// - A dialog for keyboard and screen-reader users: focus moves in, Tab stays inside, Esc closes and
//   focus returns to the button; new answers are announced politely.
// Placement: bottom left, the accessibility button is bottom right. To be agreed with Lumen.

interface Msg {
  role: 'user' | 'assistant';
  content: string;
  /** shown, never sent (the welcome and the local personal-data notice) */
  local?: boolean;
}

const LABELS: Record<ChatLocale, { open: string; title: string; close: string; input: string; send: string; sending: string; privacy: string }> = {
  hu: { open: 'Kérdezzen tőlünk', title: 'Kérdezzen tőlünk', close: 'Bezárás', input: 'Az Ön kérdése', send: 'Küldés', sending: 'Válasz készül…', privacy: 'Adatkezelési tájékoztató' },
  en: { open: 'Ask us', title: 'Ask us', close: 'Close', input: 'Your question', send: 'Send', sending: 'Preparing an answer…', privacy: 'Privacy notice' },
  de: { open: 'Fragen Sie uns', title: 'Fragen Sie uns', close: 'Schließen', input: 'Ihre Frage', send: 'Senden', sending: 'Antwort wird erstellt…', privacy: 'Datenschutzhinweis' },
};

export default function ChatWidget({ locale = 'hu' }: { locale?: ChatLocale }) {
  const t = LABELS[locale];
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ role: 'assistant', content: FIXED.welcome[locale], local: true }]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Focus moves into the dialog when it opens, and back to the button when it closes. The button is
  // rendered again only after the dialog is gone, so the return has to wait for that render (an
  // immediate focus() found no button: measured in Chrome, focus fell back to the page).
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      inputRef.current?.focus();
    } else if (wasOpen.current) {
      wasOpen.current = false;
      buttonRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, pending]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const items = dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), textarea:not([disabled])');
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || pending) return;
    if (detectPii(text).length) {
      setMessages((m) => [...m, { role: 'assistant', content: FIXED.pii[locale], local: true }]);
      return;
    }
    const next: Msg[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setPending(true);
    let reply = FIXED.error[locale];
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, messages: next.filter((m) => !m.local).map(({ role, content }) => ({ role, content })) }),
      });
      const data = (await res.json()) as { reply?: unknown };
      if (typeof data.reply === 'string' && data.reply) reply = data.reply;
    } catch {
      // network error: the fixed error text with the phone number
    }
    setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    setPending(false);
  }

  return (
    <>
      {!open && (
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-4 left-4 lg:bottom-6 lg:left-6 z-40 inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-800 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-900"
        >
          <MessageCircle size={18} aria-hidden="true" />
          {t.open}
        </button>
      )}
      {open && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onKeyDown={onKeyDown}
          className="fixed bottom-4 left-4 lg:bottom-6 lg:left-6 z-50 flex w-[24rem] max-w-[calc(100vw-2rem)] h-[34rem] max-h-[calc(100dvh-2rem)] flex-col rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h2 id={titleId} className="text-base font-bold">{t.title}</h2>
            <button type="button" onClick={close} className="rounded-full p-2 hover:bg-slate-100" aria-label={t.close}>
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm leading-relaxed" aria-live="polite" aria-relevant="additions">
            {messages.map((m, i) => (
              <p
                key={i}
                className={m.role === 'user' ? 'ml-8 rounded-2xl bg-blue-50 px-3 py-2 text-slate-900' : 'mr-8 rounded-2xl bg-slate-100 px-3 py-2 text-slate-900 whitespace-pre-line'}
              >
                {m.content}
              </p>
            ))}
            {pending && <p className="mr-8 px-3 py-2 text-slate-600">{t.sending}</p>}
            <div ref={endRef} />
          </div>
          <form onSubmit={send} className="border-t border-slate-200 p-3">
            <label htmlFor={`${titleId}-input`} className="sr-only">{t.input}</label>
            <div className="flex items-end gap-2">
              <textarea
                id={`${titleId}-input`}
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    (e.currentTarget.form as HTMLFormElement | null)?.requestSubmit();
                  }
                }}
                maxLength={1000}
                rows={2}
                className="flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button type="submit" disabled={pending || !input.trim()} className="rounded-xl bg-blue-700 p-3 text-white disabled:opacity-50" aria-label={t.send}>
                <Send size={18} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-600">
              <Link href="/adatkezeles#chat" className="underline">{t.privacy}</Link>
            </p>
          </form>
        </div>
      )}
    </>
  );
}

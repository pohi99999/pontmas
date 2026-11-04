"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function RedeemButton() {
  const [state, setState] = useState<'idle' | 'working' | 'invalid' | 'error'>('idle');

  async function redeem() {
    const token = new URLSearchParams(window.location.hash.slice(1)).get('t');
    if (!token) {
      setState('invalid');
      return;
    }
    setState('working');
    try {
      const res = await fetch('/api/szerkeszto/belepes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        // the token leaves the address bar and the browser history
        window.location.replace('/szerkeszto');
        return;
      }
      setState(res.status === 400 ? 'invalid' : 'error');
    } catch {
      setState('error');
    }
  }

  return (
    <div className="mt-6 space-y-4">
      <p className="text-base text-slate-700">A belépéshez kérjük, kattintson az alábbi gombra.</p>
      <button
        type="button"
        onClick={redeem}
        disabled={state === 'working'}
        className="min-h-12 w-full rounded-xl bg-blue-700 px-6 text-lg font-bold text-white hover:bg-blue-800 disabled:opacity-60"
      >
        Belépés
      </button>
      <p role="status" className="text-sm text-slate-700">
        {state === 'invalid' && (
          <>A link lejárt vagy már nem érvényes. Kérjen új linket a <Link className="font-bold text-blue-700 underline" href="/szerkeszto">szerkesztő oldalán</Link>.</>
        )}
        {state === 'error' && 'A belépés most nem sikerült. Kérjük, próbálja újra később.'}
      </p>
    </div>
  );
}

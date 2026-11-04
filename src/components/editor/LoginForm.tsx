"use client";

import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error' | 'limited'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    try {
      const res = await fetch('/api/szerkeszto/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? 'sent' : res.status === 429 ? 'limited' : 'error');
    } catch {
      setState('error');
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-base text-slate-700">
        Adja meg az e-mail címét. Ha a cím jogosult a szerkesztésre, belépési linket küldünk, amely 15 percig érvényes.
      </p>
      <label className="block space-y-2">
        <span className="block text-sm font-bold text-slate-900">E-mail cím</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block min-h-12 w-full rounded-xl border border-slate-300 px-4 text-base"
        />
      </label>
      <button
        type="submit"
        disabled={state === 'sending'}
        className="min-h-12 w-full rounded-xl bg-blue-700 px-6 text-base font-bold text-white hover:bg-blue-800 disabled:opacity-60"
      >
        {state === 'sending' ? 'Küldés folyamatban...' : 'Belépési link kérése'}
      </button>
      <p role="status" className="text-sm text-slate-700">
        {state === 'sent' && 'Köszönjük. Ha a cím szerepel a jogosultak között, hamarosan megérkezik a levél. Kérjük, nézze meg a levélszemét mappát is.'}
        {state === 'limited' && 'Túl sok kérés érkezett. Kérjük, próbálja újra később.'}
        {state === 'error' && 'A kérést most nem sikerült elküldeni. Kérjük, próbálja újra később.'}
      </p>
    </form>
  );
}

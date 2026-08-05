"use client";

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Szimulált API hívás (később ide jöhet a valós webhook vagy API route)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // 5 másodperc múlva visszaállítjuk az űrlapot alapállapotba
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[350px] animate-in fade-in duration-500">
        <CheckCircle2 size={48} className="text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Köszönjük megkeresését!</h3>
        <p className="text-slate-600">Üzenetét sikeresen továbbítottuk. Hamarosan felvesszük Önnel a kapcsolatot.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Írjon nekünk</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nev" className="block text-sm font-medium text-slate-700 mb-1">Név</label>
          <input required type="text" id="nev" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder="Az Ön neve" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">E-mail cím</label>
          <input required type="email" id="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder="pelda@email.hu" />
        </div>
        <div>
          <label htmlFor="uzenet" className="block text-sm font-medium text-slate-700 mb-1">Üzenet</label>
          <textarea required id="uzenet" rows={4} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none" placeholder="Miben segíthetünk?"></textarea>
        </div>
        <button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed">
          {isSubmitting ? 'Küldés folyamatban...' : 'Üzenet küldése'} 
          {!isSubmitting && <Send size={18} className="ml-2" />}
        </button>
      </form>
    </div>
  );
}

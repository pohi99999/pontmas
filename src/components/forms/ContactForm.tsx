"use client";

import React, { useState } from 'react';
import { Send, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nev: '',
    email: '',
    telefon: '',
    tema: 'altalanos',
    uzenet: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.nev || !formData.email || !formData.uzenet) {
      setErrorMsg('Kérjük, töltse ki az összes kötelező mezőt!');
      return;
    }

    setIsSubmitting(true);

    try {
      // Szimulált kliensoldali beküldés (későbbi API bővíthetőséggel)
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch {
      setIsSubmitting(false);
      setErrorMsg('Hiba történt az üzenet küldése során. Kérjük, próbálja újra később.');
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px] shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
          <CheckCircle2 size={36} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Köszönjük megkeresését!</h3>
        <p className="text-slate-600 text-sm sm:text-base max-w-md mb-6 leading-relaxed">
          Üzenetét sikeresen megkaptuk. Alapítványunk munkatársai hamarosan felveszik Önnel a kapcsolatot a megadott elérhetőségeken.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setIsSuccess(false);
            setFormData({ nev: '', email: '', telefon: '', tema: 'altalanos', uzenet: '' });
          }}
        >
          Új üzenet küldése
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-8 sm:p-10">
      <div className="flex items-center gap-2.5 mb-6 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Írjon nekünk üzenetet</h3>
          <p className="text-xs text-slate-500">Munkatársunk 1-2 munkanapon belül válaszol</p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate={false}>
        <div>
          <label htmlFor="nev" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Teljes név <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="text"
            id="nev"
            name="nev"
            value={formData.nev}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm text-slate-900 bg-slate-50/50"
            placeholder="Kovács Péter"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              E-mail cím <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm text-slate-900 bg-slate-50/50"
              placeholder="pelda@email.hu"
            />
          </div>

          <div>
            <label htmlFor="telefon" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Telefonszám (opcionális)
            </label>
            <input
              type="tel"
              id="telefon"
              name="telefon"
              value={formData.telefon}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm text-slate-900 bg-slate-50/50"
              placeholder="+36 30 123 4567"
            />
          </div>
        </div>

        <div>
          <label htmlFor="tema" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Üzenet témája
          </label>
          <select
            id="tema"
            name="tema"
            value={formData.tema}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm text-slate-900 bg-slate-50/50 cursor-pointer"
          >
            <option value="altalanos">Általános érdeklődés</option>
            <option value="szulo">Szülői segítségkérés / Szülőklub</option>
            <option value="aosz">AOSZ Info-Pont tanácsadás</option>
            <option value="tabor">Nyári tábor és rendezvények</option>
            <option value="intezmeny">Intézményi együttműködés</option>
            <option value="tamogatas">Támogatás és Céges CSR</option>
          </select>
        </div>

        <div>
          <label htmlFor="uzenet" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Üzenet szövege <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            id="uzenet"
            name="uzenet"
            rows={4}
            value={formData.uzenet}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm text-slate-900 bg-slate-50/50 resize-none"
            placeholder="Miben segíthetünk? Kérjük, fejtse ki részletesen..."
          />
        </div>

        <div className="pt-2">
          <Button
            disabled={isSubmitting}
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            rightIcon={!isSubmitting ? <Send size={18} /> : undefined}
          >
            {isSubmitting ? 'Küldés folyamatban...' : 'Üzenet elküldése'}
          </Button>
        </div>
      </form>
    </div>
  );
}

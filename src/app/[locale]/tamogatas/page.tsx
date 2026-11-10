"use client";

import { Receipt, Landmark, Briefcase, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import SectionHeader from '@/components/ui/SectionHeader';
import CopyButton from '@/components/ui/CopyButton';
import Button from '@/components/ui/Button';
import { useTranslations } from 'next-intl';
import { FOUNDATION } from '@/lib/foundation';

export default function TamogatasPage() {
  const t = useTranslations('Donation');
  // raw strings (the apostrophes in step 2 are shown as written); the tax number and name from foundation.ts
  const lepesek = (t.raw('steps') as { szam: string; cim: string; leiras: string }[]).map((l) => ({
    ...l,
    leiras: l.leiras.replace('{taxNumber}', FOUNDATION.taxNumber).replace('{shortName}', FOUNDATION.shortName),
  }));

  return (
    <div className="pb-20">
      
      {/* 1. Fejléc szekció */}
      <PageHeader
        badge={t('header.badge')}
        title={t('header.title')}
        subtitle={t('header.subtitle')}
      />

      {/* 2. Három Fő Támogatási Forma (Kártyák) */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch *:min-w-0">
          
          {/* 1. Adó 1% Kártya */}
          <div className="bg-white rounded-3xl p-8 border-2 border-blue-600 shadow-md flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-bl-xl">
              {t('tax.popular')}
            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-2xs">
              <Receipt size={28} />
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
              {t('tax.title')}
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
              {t('tax.text')}
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <CopyButton
                textToCopy={FOUNDATION.taxNumber}
                label={t('tax.label')}
                sublabel={FOUNDATION.name}
              />
            </div>
          </div>

          {/* 2. Közvetlen banki átutalás Kártya */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-2xs">
              <Landmark size={28} />
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
              {t('bank.title')}
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
              {t('bank.text')}
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <CopyButton
                textToCopy={FOUNDATION.bankAccount}
                label={t('bank.label', { bank: FOUNDATION.bankName })}
                sublabel={t('bank.reference')}
              />
            </div>
          </div>

          {/* 3. Vállalati & Céges CSR Kártya */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-2xs">
              <Briefcase size={28} />
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
              {t('csr.title')}
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
              {t('csr.text')}
            </p>

            <div className="pt-4 border-t border-slate-100 mt-auto">
              <Button href="/kapcsolat" variant="primary" fullWidth rightIcon={<ArrowRight size={16} />}>
                {t('csr.button')}
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Lépésről lépésre: Adó 1% felajánlása */}
      <section className="bg-slate-100/70 border-y border-slate-200/80 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <SectionHeader
            badge={t('guide.badge')}
            title={t.rich('guide.title', { nowrap: (chunks) => <span className="whitespace-nowrap">{chunks}</span> })}
            subtitle={t('guide.subtitle')}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lepesek.map((lep, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="display text-4xl text-blue-700 mb-3 block">{lep.szam}</span>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{lep.cim}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{lep.leiras}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Átláthatóság és Hitelességi Garancia */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl">
        <div className="bg-blue-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-300 bg-white/10 px-3 py-1 rounded-full">
              <ShieldCheck size={16} />
              <span>{t('transparency.badge')}</span>
            </div>
            <h3 className="display text-2xl sm:text-3xl">
              {t('transparency.title')}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
              {t('transparency.text')}
            </p>
          </div>

          <div className="flex flex-col gap-3 flex-shrink-0 w-full sm:w-auto">
            <Button href="/dokumentumok" variant="secondary" size="md" leftIcon={<FileText size={16} />} className="bg-white text-slate-900 hover:bg-slate-100 border-0">
              {t('transparency.reports')}
            </Button>
            <Button href="/kapcsolat" variant="outline" size="md" className="bg-transparent border-slate-400 text-slate-200 hover:bg-slate-800 hover:text-white">
              {t('transparency.ask')}
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}

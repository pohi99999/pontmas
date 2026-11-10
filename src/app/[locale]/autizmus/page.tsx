"use client";

import { useState } from 'react';
import { Brain, MessageCircle, RefreshCw, ShieldCheck, AlertCircle, Heart, BookOpen, ChevronDown, Download } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import CtaBand from '@/components/ui/CtaBand';
import { useTranslations } from 'next-intl';
import { FOUNDATION } from '@/lib/foundation';

export default function AutizmusPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const t = useTranslations('Autism');
  const traitIcons = [<MessageCircle key="m" size={28} />, <RefreshCw key="r" size={28} />, <Brain key="b" size={28} />];
  const spektrumJellemzok = (t.raw('traits.items') as { title: string; desc: string }[]).map((it, i) => ({ ...it, icon: traitIcons[i] }));
  const tenyekTevhitek = t.raw('myths.items') as { myth: string; fact: string }[];
  // raw: the answers are shown as written (no ICU parsing of their apostrophes); {phone} from foundation.ts
  const faqs = (t.raw('faq.items') as { question: string; answer: string }[]).map((f) => ({ ...f, answer: f.answer.replace('{phone}', FOUNDATION.phone) }));
  const tanacsokSzuloknek = t.raw('tips.items') as string[];

  return (
    <div className="pb-20">
      
      {/* 1. Fejléc szekció */}
      <PageHeader
        badge={t('header.badge')}
        title={t('header.title')}
        subtitle={t('header.subtitle')}
      />

      {/* 2. Spektrum Jellemzők (3 Pillér) */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          badge={t('traits.badge')}
          title={t('traits.title')}
          subtitle={t('traits.subtitle')}
        />

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {spektrumJellemzok.map((jellemzo, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all flex flex-col">
              <div className="text-blue-600 mb-6 bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xs">
                {jellemzo.icon}
              </div>
              <h3 className="display text-xl text-slate-900 mb-3">{jellemzo.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed flex-grow">{jellemzo.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Tények és Tévhitek */}
      <section className="bg-slate-100/70 border-y border-slate-200/80 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <SectionHeader
            badge={t('myths.badge')}
            title={t('myths.title')}
            subtitle={t('myths.subtitle')}
          />

          <div className="grid md:grid-cols-2 gap-6">
            {tenyekTevhitek.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
                <div className="flex items-start gap-3 bg-red-50 text-red-900 p-3.5 rounded-xl border border-red-100">
                  <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-red-700 block mb-0.5">{t('myths.mythLabel')}</span>
                    <p className="text-sm font-semibold text-slate-800">{item.myth}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-emerald-50 text-emerald-950 p-3.5 rounded-xl border border-emerald-100">
                  <ShieldCheck className="text-emerald-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-0.5">{t('myths.factLabel')}</span>
                    <p className="text-sm text-slate-700 leading-relaxed">{item.fact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Gyakorlati Tanácsok Szülőknek */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl">
        <div className="bg-blue-950 text-white pm-sotet rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/30 flex items-center justify-center text-blue-300">
              <Heart size={24} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">{t('tips.title')}</h2>
              <p className="text-xs text-blue-200">{t('tips.subtitle')}</p>
            </div>
          </div>

          <div className="space-y-4">
            {tanacsokSzuloknek.map((tanacs, i) => (
              <div key={i} className="flex items-start gap-3.5 bg-white/10 p-4 rounded-xl border border-white/10">
                <BookOpen className="text-sky-300 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-slate-100 text-sm leading-relaxed font-medium">{tanacs}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Gyakori kérdések (FAQ) */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl">
        <SectionHeader
          badge={t('faq.badge')}
          title={t('faq.title')}
          subtitle={t('faq.subtitle')}
        />

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 text-left font-bold text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg">{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Letölthető anyagok és Kapcsolat CTA */}
      <CtaBand
        title={t('cta.title')}
        text={t('cta.text')}
      >
        <Button href="/dokumentumok" variant="primary" leftIcon={<Download size={16} />}>
          {t('cta.documents')}
        </Button>
        <Button href="/kapcsolat" variant="outline">
          {t('cta.contact')}
        </Button>
      </CtaBand>

    </div>
  );
}

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { LEGAL_DRAFT, LEGAL_SOURCES } from '@/lib/legal';

// Building blocks of the legal pages. Plain, readable typography: these pages are read carefully,
// sometimes by a worried parent, so short paragraphs and clear headings, no decoration.

/** A marked open point. Visible on purpose: the draft must not look final to anyone who opens it. */
export function Review({ kind, children }: { kind: 'jogi' | 'kerdes'; children: React.ReactNode }) {
  const label = kind === 'jogi' ? '[JOGI ÁTNÉZÉS]' : '[KÉRDÉS]';
  return (
    <span className="mx-1 rounded-md border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-[0.95em] text-amber-900">
      <strong>{label}</strong> {children}
    </span>
  );
}

export function DraftBanner() {
  const t = useTranslations('Legal');
  if (!LEGAL_DRAFT) return null;
  return (
    <div role="note" className="mb-10 rounded-2xl border-2 border-amber-400 bg-amber-50 p-5 text-amber-950">
      <p className="font-bold">{t('draftTitle')}</p>
      <p className="mt-1 text-sm leading-relaxed">
        {t('draftText')}
      </p>
    </div>
  );
}

/**
 * On the English and German pages: the legal text is not translated (it is a draft, and no legal or
 * native-speaker review is planned), so the page says the Hungarian text below is the binding one.
 * The article itself carries lang="hu" there, so a screen reader reads it as Hungarian.
 */
export function LegalLanguageNote() {
  const locale = useLocale();
  const t = useTranslations('Legal');
  if (locale === 'hu') return null;
  return (
    <p role="note" className="mb-8 rounded-2xl border border-slate-300 bg-slate-100 p-4 text-slate-800">
      {t('languageNote')}
    </p>
  );
}

export function DraftSources() {
  if (!LEGAL_DRAFT) return null;
  return (
    <aside className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-600">
      <p className="font-semibold">A tervezet forrásai (az átnézéshez):</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {LEGAL_SOURCES.map((s) => <li key={s}>{s}</li>)}
      </ul>
    </aside>
  );
}

export function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-cim`} className="mt-10 scroll-mt-28">
      <h2 id={`${id}-cim`} className="text-2xl md:text-3xl text-slate-900 mb-4">{title}</h2>
      <div className="space-y-4 text-slate-700 leading-relaxed">{children}</div>
    </section>
  );
}

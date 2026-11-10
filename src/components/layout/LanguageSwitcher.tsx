"use client";

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown, Check } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { PUBLISHED_LOCALES, type Locale } from '@/i18n/routing';
import { LANGUAGE_CODES, switcherLocales } from '@/lib/nyelvek';

// The language switcher (review 2026-11-10, Marveen 6913, Péter GO 14675; layout agreed with Kenshin).
// Shown only when more than one language is published (src/i18n/routing.ts): until the translations
// are in, there is nothing to switch to, and a half-done language is never offered. Each language is
// written in its own language (an autonym, never a flag: a flag is a country, Austrians read German too).
// The link keeps the page: /autizmus <-> /en/autizmus. Texts: the LanguageSwitcher keys in messages/*
// (Kenshin, #39); the short code on the button is the same in every language.

/** Compact "HU ▾" button for the desktop header; opens a short list. */
export default function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const locales = switcherLocales(PUBLISHED_LOCALES);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); button.current?.focus(); } };
    const onPointer = (e: PointerEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onPointer); };
  }, [open]);

  if (!locales.length) return null;
  return (
    <div ref={wrap} className="relative">
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="nyelv-lista"
        aria-label={`${t('label')}. ${t('current', { language: t(`names.${locale}`) })}`}
        className="inline-flex h-10 min-w-[3.75rem] items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 text-xs font-bold tracking-wide text-slate-700 hover:bg-slate-100 cursor-pointer"
      >
        {LANGUAGE_CODES[locale]}
        <ChevronDown size={14} aria-hidden="true" className={open ? 'rotate-180' : ''} />
      </button>
      {open && (
        <ul id="nyelv-lista" className="absolute right-0 top-full z-50 mt-2 w-44 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
          {locales.map((l) => (
            <li key={l}>
              <Link
                href={pathname}
                locale={l}
                lang={l}
                hrefLang={l}
                aria-current={l === locale ? 'true' : undefined}
                onClick={() => setOpen(false)}
                className={`flex h-11 items-center justify-between rounded-xl px-3 text-sm font-semibold ${l === locale ? 'bg-blue-50 text-blue-800' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                {t(`names.${l}`)}
                {l === locale && <Check size={16} aria-hidden="true" />}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** The full list for the phone menu: one row per language, its own name. */
export function LanguageMenuList({ onPick }: { onPick?: () => void }) {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const locales = switcherLocales(PUBLISHED_LOCALES);
  if (!locales.length) return null;
  return (
    <div className="mb-2 border-b border-slate-100 pb-2">
      <p className="px-4 pt-1 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{t('label')}</p>
      <ul className="flex gap-1 px-2" aria-label={t('label')}>
        {locales.map((l) => (
          <li key={l} className="flex-1">
            <Link
              href={pathname}
              locale={l}
              lang={l}
              hrefLang={l}
              aria-current={l === locale ? 'true' : undefined}
              onClick={onPick}
              className={`flex h-11 items-center justify-center rounded-xl text-sm font-semibold ${l === locale ? 'bg-blue-50 text-blue-800' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              {t(`names.${l}`)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

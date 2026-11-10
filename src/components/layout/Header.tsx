"use client";

import { useEffect, useRef, useState } from 'react';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
// the path without the language prefix, so the active menu item is found in every language
import { usePathname } from '@/i18n/navigation';
import { Menu, X, Eye, EyeOff, Heart, SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSensory } from '@/context/SensoryContext';
import LanguageSwitcher, { LanguageMenuList } from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations('Header');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSensoryFriendly, toggleSensoryMode, highContrast, fontSize, readingRuler, reducedMotion, dyslexicFont, isPanelOpen, setPanelOpen } = useSensory();
  const hasCustomSettings = isSensoryFriendly || highContrast || fontSize !== 'normal' || readingRuler || reducedMotion || dyslexicFont;
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // While the menu is open: Escape closes it and gives the focus back to the menu button, and a
  // click or tap outside the header closes it too.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setIsMobileMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setIsMobileMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.autism'), href: '/autizmus' },
    { label: t('nav.help'), href: '/segitseg' },
    { label: t('nav.about'), href: '/rolunk' },
    { label: t('nav.press'), href: '/rolunk-irtak' },
    { label: t('nav.news'), href: '/hirek' },
    { label: t('nav.programs'), href: '/programok' },
    { label: t('nav.documents'), href: '/dokumentumok' },
    { label: t('nav.contact'), href: '/kapcsolat' },
  ];

  return (
    <header ref={headerRef} className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 transition-colors">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none rounded-lg p-1"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {/* The foundation's own mark and wordmark (SVG cut-outs of the original vector logo, /public/brand).
              The mark is decorative; the wordmark carries the name for assistive technology. */}
          <Image
            src="/brand/pontmas-jel.svg"
            alt=""
            width={369}
            height={398}
            sizes="45px"
            preload
            className="h-12 w-auto group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col gap-1">
            <Image
              src="/brand/pontmas-felirat.svg"
              alt="PontMás"
              width={599}
              height={132}
              sizes="140px"
              preload
              className="h-auto w-[140px]"
            />
            <span className="text-[11px] font-medium text-slate-500 tracking-wide uppercase whitespace-nowrap">
              {t('tagline')}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation: from 1360 px only. The full bar (9 items + 2 buttons) did not fit from lg
            (1024 px) and pushed "Támogatás" off screen, so narrower windows keep the hamburger menu.
            Every item stays on one line: tighter padding and no gap below 2xl (1536 px), and the
            "Lágy mód" button shows only its icon there (the text stays for screen readers). */}
        <nav className="hidden min-[1360px]:flex items-center gap-0 2xl:gap-2" aria-label={t('navLabel')}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2.5 2xl:px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'text-blue-700 bg-blue-50/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & CTA */}
        <div className="hidden min-[1360px]:flex items-center gap-3">
          <LanguageSwitcher />
          {/* Sensory Toggle */}
          <button
            onClick={toggleSensoryMode}
            type="button"
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              isSensoryFriendly
                ? 'bg-slate-800 text-white border-slate-700 shadow-inner'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title={isSensoryFriendly ? t('sensoryOnTitle') : t('sensoryOffTitle')}
            aria-pressed={isSensoryFriendly}
          >
            {isSensoryFriendly ? (
              <>
                <EyeOff size={16} className="text-sky-300" aria-hidden="true" />
                <span className="sr-only 2xl:not-sr-only">{t('sensoryOn')}</span>
              </>
            ) : (
              <>
                <Eye size={16} className="text-slate-600" aria-hidden="true" />
                <span className="sr-only 2xl:not-sr-only">{t('sensoryOff')}</span>
              </>
            )}
          </button>

          {/* Donation CTA */}
          <Link
            href="/tamogatas"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow whitespace-nowrap transition-all active:scale-95"
          >
            <Heart size={16} className="fill-white/20" />
            <span>{t('support')}</span>
          </Link>
        </div>

        {/* Mobile controls: Sensory Toggle + Hamburger */}
        <div className="flex items-center gap-2 min-[1360px]:hidden">
          <button
            onClick={toggleSensoryMode}
            type="button"
            className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
              isSensoryFriendly
                ? 'bg-slate-800 text-white border-slate-700'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
            aria-label={t('sensoryToggle')}
          >
            {isSensoryFriendly ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>

          <button
            ref={menuButtonRef}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            type="button"
            className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
            aria-label={isMobileMenuOpen ? t('menuClose') : t('menuOpen')}
            aria-expanded={isMobileMenuOpen}
            aria-controls="fo-menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menu drawer: full width on phones; from md (768 px) a narrow panel under the menu button,
          which reads better than a full-width list on a tablet or a 1280 px laptop. */}
      {isMobileMenuOpen && (
        <div id="fo-menu" className="min-[1360px]:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-150 md:absolute md:top-full md:right-6 lg:right-8 md:mt-2 md:w-[22.5rem] md:rounded-2xl md:border md:pb-4">
          {/* Below 1024 px the accessibility panel opens from here; from 1024 px it has the floating button */}
          <div className="lg:hidden mb-2 border-b border-slate-100 pb-2">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setPanelOpen(true);
              }}
              aria-expanded={isPanelOpen}
              aria-controls="accessibility-panel"
              className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <SlidersHorizontal size={20} aria-hidden="true" />
              <span>{t('accessibility')}</span>
              {hasCustomSettings && (
                <>
                  <span className="ml-auto h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  <span className="sr-only">{t('customActive')}</span>
                </>
              )}
            </button>
          </div>
          {/* The language, in full names (only when more than one language is published); after the
              accessibility row, which stays the first stop of the menu (tests/a11y-contrast.mjs) */}
          <LanguageMenuList onPick={() => setIsMobileMenuOpen(false)} />
          <nav className="flex flex-col gap-1" aria-label={t('mobileNavLabel')}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'text-blue-700 bg-blue-50 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 mt-2 border-t border-slate-100">
              <Link
                href="/tamogatas"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm text-center transition-colors"
              >
                <Heart size={18} />
                <span>{t('supportMobile')}</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

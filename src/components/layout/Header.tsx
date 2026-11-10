"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Eye, EyeOff, Heart, SlidersHorizontal } from 'lucide-react';
import { useSensory } from '@/context/SensoryContext';
import { ThemeToggleButton, ThemeToggleRow } from '@/components/ui/ThemeToggle';

export default function Header() {
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
    { label: 'Kezdőlap', href: '/' },
    { label: 'Autizmusról', href: '/autizmus' },
    { label: 'Segítség', href: '/segitseg' },
    { label: 'Rólunk', href: '/rolunk' },
    { label: 'Rólunk írták', href: '/rolunk-irtak' },
    { label: 'Hírek', href: '/hirek' },
    { label: 'Programok', href: '/programok' },
    { label: 'Dokumentumok', href: '/dokumentumok' },
    { label: 'Kapcsolat', href: '/kapcsolat' },
  ];

  return (
    <>
    {/* Display bar (Péter 14726): the display settings in one place above the header, desktop only (1360 px
        and up, where the full menu shows); below it the header is as before. It is NOT sticky: it scrolls
        away, so while scrolling the sticky header below stays its own 80 px. In the tab order it comes right
        after "Ugrás a tartalomra". The language switcher (#37) goes in here too. */}
    <div data-felso-sav className="hidden min-[1360px]:block border-b border-slate-200/80 bg-slate-50">
      <div className="container mx-auto flex h-10 items-center justify-end gap-2 px-4 sm:px-6 lg:px-8">
        <ThemeToggleButton />
        {/* Sensory Toggle: always with its label, outlined in the brand blue; on, it is a light blue tint,
            not black, so it cannot be taken for a dark-mode switch (review 2026-11-10) */}
        <button
          onClick={toggleSensoryMode}
          type="button"
          className={`h-8 px-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            isSensoryFriendly
              ? 'bg-blue-50 text-blue-800 border-blue-600'
              : 'bg-white text-blue-700 border-blue-600/60 hover:bg-blue-50'
          }`}
          title={isSensoryFriendly ? "Lágy, csökkentett ingerű mód aktív (kattintson a normál módhoz)" : "Csökkentett ingerű (szenszoros) mód bekapcsolása"}
          aria-pressed={isSensoryFriendly}
        >
          {isSensoryFriendly ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
          <span>{isSensoryFriendly ? 'Lágy mód: be' : 'Lágy mód'}</span>
        </button>
      </div>
    </div>
    <header ref={headerRef} className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 transition-colors">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-1.5 min-[340px]:gap-2 min-[420px]:gap-3 group focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none rounded-lg p-1"
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
            className="h-9 min-[340px]:h-10 min-[420px]:h-12 w-auto group-hover:scale-105 transition-transform dark:hidden"
          />
          {/* Dark theme: the same artwork with light ink (review 2026-11-10) */}
          <Image
            src="/brand/pontmas-jel-sotet.svg"
            alt=""
            width={369}
            height={398}
            sizes="45px"
            className="hidden h-9 min-[340px]:h-10 min-[420px]:h-12 w-auto group-hover:scale-105 transition-transform dark:block"
          />
          <div className="flex flex-col gap-1">
            <Image
              src="/brand/pontmas-felirat.svg"
              alt="PontMás"
              width={599}
              height={132}
              sizes="140px"
              preload
              className="pm-halo h-auto w-[112px] min-[340px]:w-[120px] min-[420px]:w-[140px] dark:hidden"
            />
            <Image
              src="/brand/pontmas-felirat-sotet.svg"
              alt="PontMás"
              width={599}
              height={132}
              sizes="140px"
              className="hidden h-auto w-[112px] min-[340px]:w-[120px] min-[420px]:w-[140px] dark:block"
            />
            <span className="text-[9px] min-[340px]:text-[10px] min-[420px]:text-[11px] font-medium text-slate-500 tracking-tight min-[340px]:tracking-normal min-[420px]:tracking-wide uppercase whitespace-nowrap">
              Vas Megyei Alapítvány
            </span>
          </div>
        </Link>

        {/* Desktop Navigation: from 1360 px only. The full bar (9 items + 2 buttons) did not fit from lg
            (1024 px) and pushed "Támogatás" off screen, so narrower windows keep the hamburger menu.
            Every item stays on one line: tighter padding and no gap below 2xl (1536 px). */}
        <nav className="hidden min-[1360px]:flex items-center gap-0 2xl:gap-2" aria-label="Fő navigáció">
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

        {/* Action Controls & CTA: the display settings moved to the bar above (Péter 14726) */}
        <div className="hidden min-[1360px]:flex items-center gap-3">
          {/* Donation CTA */}
          <Link
            href="/tamogatas"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow whitespace-nowrap transition-all active:scale-95"
          >
            <Heart size={16} className="fill-white/20" />
            <span>Támogatás</span>
          </Link>
        </div>

        {/* Mobile controls: Sensory Toggle + Hamburger */}
        <div className="flex items-center gap-2 min-[1360px]:hidden">
          <button
            onClick={toggleSensoryMode}
            type="button"
            aria-pressed={isSensoryFriendly}
            title="Csökkentett ingerű (szenszoros) mód"
            className={`h-11 px-2 min-[400px]:px-2.5 min-[420px]:px-3 rounded-xl border text-[11px] min-[400px]:text-[13px] min-[420px]:text-sm font-semibold flex items-center gap-1.5 transition-all ${
              isSensoryFriendly
                ? 'bg-blue-50 text-blue-800 border-blue-600'
                : 'bg-transparent text-blue-700 border-blue-600/60'
            }`}
          >
            {isSensoryFriendly ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
            {/* below 400 px the label goes on two lines, so the button fits next to the logo (review 2026-11-10, Ellenőr: 320-360 px) */}
            <span className="leading-[1.1] text-left">Lágy <br className="min-[400px]:hidden" />mód</span>
          </button>

          <button
            ref={menuButtonRef}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            type="button"
            className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
            aria-label={isMobileMenuOpen ? "Menü bezárása" : "Menü megnyitása"}
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
              <span>Akadálymentesítés</span>
              {hasCustomSettings && (
                <>
                  <span className="ml-auto h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  <span className="sr-only">(egyedi beállítások aktívak)</span>
                </>
              )}
            </button>
          </div>
          {/* The dark theme switch: in the menu on phones and tablets, an icon in the desktop header */}
          <div className="mb-2 border-b border-slate-100 pb-2">
            <ThemeToggleRow />
          </div>
          <nav className="flex flex-col gap-1" aria-label="Mobil navigáció">
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
                <span>Támogatás és adó 1%</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
    </>
  );
}

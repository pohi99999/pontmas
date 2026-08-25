"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Eye, EyeOff, Heart, Sparkles } from 'lucide-react';
import { useSensory } from '@/context/SensoryContext';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSensoryFriendly, toggleSensoryMode } = useSensory();
  const pathname = usePathname();

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
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 transition-colors">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none rounded-lg p-1"
          aria-label="PontMás Alapítvány Kezdőlap"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles size={22} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 tracking-tight leading-none group-hover:text-blue-700 transition-colors">
              Pont<span className="text-blue-600">Más</span>
            </span>
            <span className="text-[11px] font-medium text-slate-500 tracking-wide uppercase mt-0.5">
              Vas Megyei Alapítvány
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Fő navigáció">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
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
        <div className="hidden lg:flex items-center gap-3">
          {/* Sensory Toggle */}
          <button
            onClick={toggleSensoryMode}
            type="button"
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              isSensoryFriendly
                ? 'bg-slate-800 text-white border-slate-700 shadow-inner'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title={isSensoryFriendly ? "Lágy, csökkentett ingerű mód aktív (kattintson a normál módhoz)" : "Csökkentett ingerű (szenszoros) mód bekapcsolása"}
            aria-pressed={isSensoryFriendly}
            aria-label="Akadálymentes szenszoros mód kapcsoló"
          >
            {isSensoryFriendly ? (
              <>
                <EyeOff size={16} className="text-sky-300" />
                <span>Lágy mód: BE</span>
              </>
            ) : (
              <>
                <Eye size={16} className="text-slate-600" />
                <span>Lágy mód</span>
              </>
            )}
          </button>

          {/* Donation CTA */}
          <Link
            href="/tamogatas"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all active:scale-95"
          >
            <Heart size={16} className="fill-white/20" />
            <span>Támogatás</span>
          </Link>
        </div>

        {/* Mobile controls: Sensory Toggle + Hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleSensoryMode}
            type="button"
            className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
              isSensoryFriendly
                ? 'bg-slate-800 text-white border-slate-700'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
            aria-label="Szenszoros mód kapcsolása"
          >
            {isSensoryFriendly ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            type="button"
            className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
            aria-label={isMobileMenuOpen ? "Menü bezárása" : "Menü megnyitása"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-150">
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
                <span>Támogatás és Adó 1%</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

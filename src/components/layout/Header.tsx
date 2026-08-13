"use client";

import Link from 'next/link';
import { Menu, Eye, EyeOff } from 'lucide-react';
import { useSensory } from '@/context/SensoryContext';

export default function Header() {
  const { isSensoryFriendly, toggleSensoryMode } = useSensory();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-blue-700">PontMás Alapítvány</span>
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/rolunk" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">Rólunk</Link>
          <Link href="/autizmus" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">Autizmus</Link>
          <Link href="/programok" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">Programok</Link>
          <Link href="/tamogatas" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">Támogatás</Link>
          <Link href="/kapcsolat" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">Kapcsolat</Link>
          
          <button 
            onClick={toggleSensoryMode}
            className="ml-2 p-2 rounded-full hover:bg-slate-100 text-slate-600 flex items-center gap-1 text-xs font-medium border border-slate-200 transition-all"
            title={isSensoryFriendly ? "Normál mód visszaállítása" : "Csökkentett ingerű (szenszoros) mód bekapcsolása"}
          >
            {isSensoryFriendly ? <EyeOff size={16} className="text-blue-600" /> : <Eye size={16} />}
            <span className="hidden lg:inline">{isSensoryFriendly ? "Lágy mód aktív" : "Akadálymentesítés"}</span>
          </button>
        </nav>
        <button className="md:hidden p-2 text-slate-700" aria-label="Menü megnyitása">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}

import Link from 'next/link';
import { Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-blue-700">PontMás Alapítvány</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/rolunk" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">Rólunk</Link>
          <Link href="/autizmus" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">Autizmus</Link>
          <Link href="/programok" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">Programok</Link>
          <Link href="/tamogatas" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">Támogatás</Link>
          <Link href="/kapcsolat" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">Kapcsolat</Link>
        </nav>
        <button className="md:hidden p-2 text-slate-700" aria-label="Menü megnyitása">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}

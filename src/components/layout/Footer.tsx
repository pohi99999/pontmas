import Link from 'next/link';
import { Heart, Mail, MapPin, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      {/* Fő lábléc tartalom */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Oszlop 1: Alapítványi profil */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Sparkles size={18} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Pont<span className="text-blue-400">Más</span> Alapítvány
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              PontMás Vas Megyei Autista Gyermekekért Alapítvány. 2015 óta a Vas vármegyei érintett családok és intézmények elkötelezett támogatója.
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-300 bg-blue-950/60 border border-blue-800/60 p-2.5 rounded-lg">
              <ShieldCheck size={16} className="text-blue-400 flex-shrink-0" />
              <span>Autisták Országos Szövetsége (AOSZ) tagszervezet</span>
            </div>
          </div>

          {/* Oszlop 2: Gyorslinkek */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Oldaltérkép</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/rolunk" className="hover:text-white transition-colors">Rólunk és Értékeink</Link>
              </li>
              <li>
                <Link href="/autizmus" className="hover:text-white transition-colors">Autizmus Ismerettár & FAQ</Link>
              </li>
              <li>
                <Link href="/programok" className="hover:text-white transition-colors">Programok és Kék Séta</Link>
              </li>
              <li>
                <Link href="/tamogatas" className="hover:text-white transition-colors">Támogatás és Adó 1%</Link>
              </li>
              <li>
                <Link href="/dokumentumok" className="hover:text-white transition-colors">Dokumentumtár & Pályázatok</Link>
              </li>
              <li>
                <Link href="/kapcsolat" className="hover:text-white transition-colors">Kapcsolat & AOSZ Info-Pont</Link>
              </li>
            </ul>
          </div>

          {/* Oszlop 3: Elérhetőségek */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Elérhetőség</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <span>9700 Szombathely, Váci M. utca 12. 3./15.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={18} className="text-blue-400 flex-shrink-0" />
                <a href="mailto:info@pontmas.hu" className="hover:text-white transition-colors">info@pontmas.hu</a>
              </li>
              <li className="pt-1">
                <a 
                  href="https://www.facebook.com/groups/1622445488007296/?locale=hu_HU" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-sky-300 hover:text-sky-200 transition-colors"
                >
                  <span>Közösségi Facebook csoport</span>
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Oszlop 4: Támogatási & Jogi adatok */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Támogatási adatok</h3>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block">Adószám (1% felajánlás):</span>
                <span className="font-mono font-bold text-white text-sm">18654996-1-18</span>
              </div>
              <div className="pt-1 border-t border-slate-700/60">
                <span className="text-slate-400 block">Bankszámlaszám (CIB Bank):</span>
                <span className="font-mono font-bold text-white text-xs block break-all">11600006-00000000-75701521</span>
              </div>
            </div>
            <Link
              href="/tamogatas"
              className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-3 rounded-lg transition-colors"
            >
              <Heart size={14} className="fill-white" />
              <span>Adományozási tudnivalók</span>
            </Link>
          </div>

        </div>
      </div>

      {/* Alsó copyright sáv */}
      <div className="border-t border-slate-800 bg-slate-950 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {currentYear} PontMás Vas Megyei Autista Gyermekekért Alapítvány. Minden jog fenntartva.</p>
          <div className="flex items-center gap-4">
            <Link href="/dokumentumok" className="hover:text-slate-300 transition-colors">Közhasznúsági jelentések</Link>
            <span>•</span>
            <Link href="/kapcsolat" className="hover:text-slate-300 transition-colors">Adatvédelem & Kapcsolat</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

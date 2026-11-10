import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { Heart, Phone, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { FOUNDATION, ADDRESS_LINE, PHONE_HREF } from '@/lib/foundation';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      {/* Fő lábléc tartalom */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Oszlop 1: Alapítványi profil */}
          <div className="space-y-4">
            {/* The same mark and wordmark as in the header. The logo is dark artwork: on the dark footer it sits on a white tile instead of being recoloured. */}
            <div className="inline-flex items-center gap-3 lg:gap-2 xl:gap-3 rounded-2xl bg-white px-4 lg:px-3 xl:px-4 py-2.5">
              <Image src="/brand/pontmas-jel.svg" alt="" width={369} height={398} sizes="45px" className="h-12 lg:h-10 xl:h-12 w-auto" />
              <div className="flex flex-col gap-1">
                <Image src="/brand/pontmas-felirat.svg" alt="PontMás" width={599} height={132} sizes="140px" className="h-auto w-[140px] lg:w-[124px] xl:w-[140px]" />
                <span className="text-[11px] lg:text-[9.5px] xl:text-[11px] font-medium text-slate-600 tracking-wide uppercase whitespace-nowrap">
                  Vas Megyei Alapítvány
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {FOUNDATION.name}. 2015 óta a Vas vármegyei érintett családok és intézmények elkötelezett támogatója.
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-300 bg-blue-950/60 border border-blue-800/60 p-2.5 rounded-lg">
              <ShieldCheck size={16} className="text-blue-400 flex-shrink-0" />
              <span>Autisták Országos Szövetsége (AOSZ) tagszervezet</span>
            </div>
          </div>

          {/* Oszlop 2: Gyorslinkek */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Oldaltérkép</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 text-sm">
              <li>
                <Link href="/rolunk" className="hover:text-white transition-colors">Rólunk és értékeink</Link>
              </li>
              <li>
                <Link href="/autizmus" className="hover:text-white transition-colors">Autizmus-ismerettár és FAQ</Link>
              </li>
              <li>
                <Link href="/segitseg" className="hover:text-white transition-colors">Amiben segíteni tudunk</Link>
              </li>
              <li>
                <Link href="/rolunk-irtak" className="hover:text-white transition-colors">Rólunk írták és sajtó</Link>
              </li>
              <li>
                <Link href="/hirek" className="hover:text-white transition-colors">Hírek és szülőklub</Link>
              </li>
              <li>
                <Link href="/programok" className="hover:text-white transition-colors">Programok és események</Link>
              </li>
              <li>
                <Link href="/tamogatas" className="hover:text-white transition-colors">Támogatás és adó 1%</Link>
              </li>
              <li>
                <Link href="/dokumentumok" className="hover:text-white transition-colors">Dokumentumtár és pályázatok</Link>
              </li>
              <li>
                <Link href="/kapcsolat" className="hover:text-white transition-colors">Kapcsolat</Link>
              </li>
            </ul>
          </div>

          {/* Oszlop 3: Elérhetőségek */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Elérhetőség</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{ADDRESS_LINE}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={18} className="text-blue-400 flex-shrink-0" />
                <a href={PHONE_HREF} className="hover:text-white transition-colors">{FOUNDATION.contactPerson}, <span className="whitespace-nowrap">{FOUNDATION.phone}</span></a>
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
                <span className="font-mono font-bold text-white text-sm">{FOUNDATION.taxNumber}</span>
              </div>
              <div className="pt-1 border-t border-slate-700/60">
                <span className="text-slate-400 block">Bankszámlaszám ({FOUNDATION.bankName}):</span>
                <span className="font-mono font-bold text-white text-xs lg:text-[11px] xl:text-xs block break-all">{FOUNDATION.bankAccount}</span>
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© {currentYear} {FOUNDATION.name}. Minden jog fenntartva.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href="/dokumentumok" className="hover:text-slate-300 transition-colors">Közhasznúsági jelentések</Link>
            <span aria-hidden="true">•</span>
            <Link href="/adatkezeles" className="hover:text-slate-300 transition-colors">Adatkezelési tájékoztató</Link>
            <span aria-hidden="true">•</span>
            <Link href="/impresszum" className="hover:text-slate-300 transition-colors">Impresszum</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

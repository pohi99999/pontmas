"use client";

import { Receipt, Landmark, Briefcase, HeartHandshake, Sparkles, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import CopyButton from '@/components/ui/CopyButton';
import Button from '@/components/ui/Button';

export default function TamogatasPage() {
  const lepesek = [
    {
      szam: "01",
      cim: "Lépjen be az eSZJA felületére",
      leiras: "Jelentkezzen be a NAV online felületére (eszja.nav.gov.hu) az Ügyfélkapus azonosítójával május 20-ig."
    },
    {
      szam: "02",
      cim: "Nyissa meg a rendelkező nyilatkozatot",
      leiras: "Kattintson az '1+1% nyilatkozat' kitöltése gombra a bevallási tervezet jóváhagyásakor vagy attól függetlenül."
    },
    {
      szam: "03",
      cim: "Adja meg adószámunkat",
      leiras: "A kedvezményezett adószáma mezőbe másolja be az alábbi adószámot: 18654996-1-18 (PontMás Alapítvány)."
    },
    {
      szam: "04",
      cim: "Véglegesítse és küldje be",
      leiras: "Mentse el a nyilatkozatot, amellyel további költségek nélkül támogatja a Vas vármegyei autista gyermekeket."
    }
  ];

  return (
    <div className="pb-20">
      
      {/* 1. Fejléc szekció */}
      <section className="bg-gradient-to-b from-blue-50/80 to-slate-50 pt-16 pb-16 md:pt-20 md:pb-20 border-b border-slate-200/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Támogatási Központ"
            badgeIcon={<HeartHandshake size={14} />}
            title="Támogassa munkánkat – Minden segítség számít!"
            subtitle="Az Ön támogatása közvetlenül hozzájárul a Vas vármegyei autizmussal élő gyermekek képességfejlesztéséhez, a szülői közösség megtartásához és a krízishelyzetbe került családok segítéséhez."
            align="center"
          />
        </div>
      </section>

      {/* 2. Három Fő Támogatási Forma (Kártyák) */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8 items-stretch">
          
          {/* 1. Adó 1% Kártya */}
          <div className="bg-white rounded-3xl p-8 border-2 border-blue-600 shadow-md flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-bl-xl">
              Legnépszerűbb
            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-2xs">
              <Receipt size={28} />
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
              Személyi jövedelemadó 1%
            </h3>

            <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
              Rendelkezzen adója 1%-áról a május 20-i határidőig! Ez a felajánlás Önnek semmibe sem kerül, számunkra viszont alapvető működési biztonságot jelent.
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <CopyButton
                textToCopy="18654996-1-18"
                label="Adószámunk"
                sublabel="PontMás Vas Megyei Autista Gyermekekért Alapítvány"
              />
            </div>
          </div>

          {/* 2. Közvetlen banki átutalás Kártya */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-2xs">
              <Landmark size={28} />
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
              Banki átutalás & Adomány
            </h3>

            <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
              Egyszeri vagy rendszeres átutalással azonnal segítheti krízis alapunkat, valamint a nyári táborok és intézményi fejlesztőeszközök finanszírozását.
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <CopyButton
                textToCopy="11600006-00000000-75701521"
                label="Bankszámlaszám (CIB Bank)"
                sublabel="Közlemény: Adomány"
              />
            </div>
          </div>

          {/* 3. Vállalati & Céges CSR Kártya */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-2xs">
              <Briefcase size={28} />
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
              Vállalati CSR & Partnerség
            </h3>

            <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
              Céges adományozás esetén hivatalos adóigazolást állítunk ki, amellyel vállalkozása társasági adókedvezményt vehet igénybe. Célzott eseményszponzorációra is lehetőség van.
            </p>

            <div className="pt-4 border-t border-slate-100 mt-auto">
              <Button href="/kapcsolat" variant="primary" fullWidth rightIcon={<ArrowRight size={16} />}>
                Kapcsolatfelvétel cégeknek
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Lépésről lépésre: Adó 1% felajánlása */}
      <section className="bg-slate-100/70 border-y border-slate-200/80 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <SectionHeader
            badge="Útmutató"
            badgeIcon={<Sparkles size={14} />}
            title="Hogyan ajánlhatja fel az 1%-ot 4 egyszerű lépésben?"
            subtitle="Nem igényel több mint 2 percet az eSZJA felületén vagy a munkáltatóján keresztül."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lepesek.map((lep, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-3xl font-black text-blue-600 mb-3 block">{lep.szam}</span>
                  <h4 className="font-bold text-slate-900 text-base mb-2">{lep.cim}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{lep.leiras}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Átláthatóság és Hitelességi Garancia */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl">
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-300 bg-white/10 px-3 py-1 rounded-full">
              <ShieldCheck size={16} />
              <span>100% Átláthatóság</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Mire fordítjuk az adományokat?
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
              Alapítványunk minden forint felhasználásáról részletes közhasznúsági beszámolót készít, amely nyilvánosan elérhető a dokumentumtárunkban.
            </p>
          </div>

          <div className="flex flex-col gap-3 flex-shrink-0 w-full sm:w-auto">
            <Button href="/dokumentumok" variant="secondary" size="md" leftIcon={<FileText size={16} />} className="bg-white text-slate-900 hover:bg-slate-100 border-0">
              Beszámolók megtekintése
            </Button>
            <Button href="/kapcsolat" variant="outline" size="md" className="border-slate-700 text-slate-200 hover:bg-slate-800">
              Kérdése van? Írjon nekünk
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}

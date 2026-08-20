"use client";

import { useState } from 'react';
import { Calendar, MapPin, Sparkles, School, GraduationCap, Heart, ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';

export default function ProgramokPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'event' | 'family' | 'camp'>('all');

  const programok = [
    {
      category: 'event',
      title: 'Autizmus Világnapi "Kék Séta"',
      date: 'Minden év április 2. körül',
      location: 'Szombathely Fő tér és belváros',
      badge: 'Kiemelt éves esemény',
      description: 'Hagyományos és nagyszabású figyelemfelhívó sétánk, amellyel az autizmussal élők társadalmi elfogadását, láthatóságát hirdetjük. Célunk az előítéletek lebontása és a helyi közösség összefogása.',
      highlights: ['Kék lufik és szalagok', 'Közös séta érintett családokkal', 'Szakmai és szülői felszólalások']
    },
    {
      category: 'camp',
      title: 'Képességfejlesztő Nyári Táborok',
      date: 'Július - Augusztus (évente több turnusban)',
      location: 'Vas vármegyei élményhelyszínek',
      badge: 'Fejlesztő tábor',
      description: 'Kifejezetten autizmussal élő gyermekek számára megálmodott táboraink kiszámítható, biztonságos és elfogadó közeget nyújtanak. Gyógypedagógusok és képzett asszisztensek felügyeletével biztosítunk játékos készségfejlesztést és igazi kikapcsolódást.',
      highlights: ['Alacsony gyermek-felnőtt arány', 'Egyéni szenzoros igényekhez igazított programok', 'Közösségi élmények']
    },
    {
      category: 'family',
      title: 'Szülőklub és Tapasztalatcsere',
      date: 'Havonta rendszeresen',
      location: 'Szombathely, AOSZ Info-Pont / Közösségi tér',
      badge: 'Sorstársi közösség',
      description: 'Biztonságos és támogató beszélgetőfórum az érintett szülők számára. Meghívott szakemberek, gyógypedagógusok és egymást segítő szülők segítségével vitatjuk meg a mindennapi kihívásokat, intézményi kérdéseket.',
      highlights: ['Ingyenes részvétel', 'Szakértői témák és kötetlen beszélgetések', 'Érzelmi és gyakorlati támasz']
    },
    {
      category: 'family',
      title: 'Autizmus-barát Családi Napok',
      date: 'Tavaszi és őszi időszakban',
      location: 'Szombathely és környéke',
      badge: 'Családi program',
      description: 'Olyan kötetlen szabadidős programok, ahol a testvérek, szülők és a spektrumon lévő gyermekek együtt tölthetnek el egy élménydús napot, anélkül, hogy a környezet ítélkezésétől kellene tartaniuk.',
      highlights: ['Nyugtató pihenősátrak', 'Kreatív és mozgásos játékok', 'Családi kapcsolatépítés']
    }
  ];

  const tamogatottIntezmenyek = [
    { nev: "Aranyhíd EGYMI (Szombathely)", reszlet: "Speciális oktatási-nevelési fejlesztőeszközök, szenzoros szobák felszerelésének támogatása." },
    { nev: "Micimackó Óvoda (Szombathely)", reszlet: "Autizmus-specifikus korai fejlesztő játékok és vizuális támogató eszközök biztosítása." },
    { nev: "Vas Vármegyei Pedagógiai Szakszolgálat", reszlet: "Szakmai együttműködés, diagnosztikai és tanácsadási folyamatok támogatása." },
    { nev: "Integráló általános és középiskolák", reszlet: "Módszertani segítségnyújtás és érzékenyítő előadások a pedagógusok és osztályközösségek számára." }
  ];

  const filteredPrograms = selectedCategory === 'all' 
    ? programok 
    : programok.filter(p => p.category === selectedCategory);

  return (
    <div className="pb-20">
      
      {/* 1. Fejléc szekció */}
      <section className="bg-gradient-to-b from-blue-50/80 to-slate-50 pt-16 pb-16 md:pt-20 md:pb-20 border-b border-slate-200/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Események & Kezdeményezések"
            badgeIcon={<Sparkles size={14} />}
            title="Programjaink és Rendezvényeink"
            subtitle="Közösséget formálunk, élményeket adunk és intézményeket támogatunk Vas vármegyében. Ismerje meg legfontosabb éves kezdeményezéseinket!"
            align="center"
          />
        </div>
      </section>

      {/* 2. Programok és Események Kategóriaválasztóval */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Kategória szűrő gombok */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-2xl mx-auto" role="tablist" aria-label="Programkategóriák">
          {[
            { id: 'all', label: 'Összes program' },
            { id: 'event', label: 'Kiemelt Események' },
            { id: 'camp', label: 'Nyári Táborok' },
            { id: 'family', label: 'Szülőklub & Családok' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as typeof selectedCategory)}
              role="tab"
              aria-selected={selectedCategory === cat.id}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Esemény kártyák listája */}
        <div className="max-w-5xl mx-auto space-y-8">
          {filteredPrograms.map((program, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mb-2 inline-block">
                    {program.badge}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {program.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <Calendar size={14} className="text-blue-600" />
                    <span>{program.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <MapPin size={14} className="text-slate-400" />
                    <span>{program.location}</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 text-base leading-relaxed">
                {program.description}
              </p>

              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Főbb jellemzők:</span>
                <ul className="grid sm:grid-cols-3 gap-2">
                  {program.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end pt-2">
                <Button href="/kapcsolat" variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />}>
                  Érdeklődés & Részletek
                </Button>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 3. Intézményi Támogatások Modul */}
      <section className="bg-gradient-to-b from-slate-100/80 to-slate-50 border-y border-slate-200/80 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <SectionHeader
            badge="Együttműködés"
            badgeIcon={<School size={14} />}
            title="Támogatott intézmények Vas vármegyében"
            subtitle="Nemcsak közvetlenül a családokat segítjük, hanem azokat a szakmai intézményeket is, ahol a gyermekek a mindennapjaikat töltik."
          />

          <div className="grid md:grid-cols-2 gap-6">
            {tamogatottIntezmenyek.map((intezmeny, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1">{intezmeny.nev}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{intezmeny.reszlet}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-3xl mx-auto space-y-4 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">
              Szeretné, hogy az Ön intézménye is részesüljön támogatásban?
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xl mx-auto">
              Vegye fel velünk a kapcsolatot a konkrét szakmai igények, eszközbeszerzések és érzékenyítő tréningek egyeztetéséhez.
            </p>
            <div className="pt-2">
              <Button href="/kapcsolat" variant="primary" size="md">
                Intézményi megkeresés
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Támogatási felhívás */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-700 to-sky-600 rounded-3xl p-8 sm:p-12 text-white text-center shadow-lg space-y-6">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto text-white">
            <Heart size={24} className="fill-white/30" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Segítsen megvalósítani programjainkat!
          </h2>
          <p className="max-w-2xl mx-auto text-blue-100 text-base leading-relaxed">
            Adója 1%-ával vagy közvetlen támogatással Ön is hozzájárulhat a táborok, a Kék séta és a szülőklubok sikeres megszervezéséhez.
          </p>
          <div className="flex justify-center pt-2">
            <Button href="/tamogatas" variant="secondary" size="lg" className="bg-white text-blue-900 hover:bg-blue-50 border-0">
              Támogatási tudnivalók (1%)
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}

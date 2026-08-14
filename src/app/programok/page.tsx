'use client';

import Image from 'next/image';
import { Calendar, MapPin, ArrowRight, Image as ImageIcon, School, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function ProgramokPage() {
  const programok = [
    {
      title: 'Autizmus Világnapi "Kék Séta"',
      date: 'Minden év áprilisában',
      location: 'Szombathely',
      description: 'Hagyományos figyelemfelhívó sétánk, amellyel az autizmussal élők társadalmi elfogadását hirdetjük. Programunkkal célunk, hogy láthatóvá tegyük az érintett családokat, lebontsuk az előítéleteket és közelebb hozzuk egymáshoz a közösséget.',
      imageSrc: '/images/kek-seta.jpg'
    },
    {
      title: 'Képességfejlesztő Nyári Táborok',
      date: 'Nyári szünet idején',
      location: 'Vas vármegye',
      description: 'Kifejezetten autizmussal élő gyermekek számára szervezett táboraink biztonságos, elfogadó és kiszámítható környezetet nyújtanak. A táborok során a gyermekek szakértői felügyelet mellett fejlődhetnek és kapcsolódhatnak ki.',
      imageSrc: '/images/nyari-tabor.jpg'
    },
    {
      title: 'Szülőklub és Családi Napok',
      date: 'Folyamatosan szervezve',
      location: 'Változó helyszínek',
      description: 'Lehetőség a tapasztalatcserére, szakemberekkel való találkozásra és a kötetlen feltöltődésre az érintett családok számára. Együtt könnyebb megküzdeni a mindennapok kihívásaival.',
      imageSrc: '/images/csaladi-nap.jpg'
    }
  ];

  const tamogatottIntezmenyek = [
    "Aranyhíd EGYMI (Szombathely)",
    "Micimackó Óvoda (Szombathely)",
    "Vas Vármegyei Pedagógiai Szakszolgálat",
    "Integráltan oktató általános és középiskolák Vas vármegyében"
  ];

  return (
    <div className="pb-16">
      {/* Fejléc szekció */}
      <section className="bg-slate-50 pt-12 pb-16 border-b border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Programok és Események</h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
            Közösséget építünk és támogatunk. Fedezze fel állandó programjainkat, rendezvényeinket, és ismerje meg intézményfejlesztési munkánkat!
          </p>
        </div>
      </section>

      {/* Programok listája */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto grid gap-8">
          {programok.map((program, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row transition-shadow hover:shadow-md">
              
              {/* Kép keret Next.js Image-dzsel */}
              <div className="relative md:w-2/5 min-h-[240px] bg-slate-100 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col items-center justify-center p-6 text-slate-400">
                <Image
                  src={program.imageSrc}
                  alt={program.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <ImageIcon size={40} className="mb-2 text-slate-300" />
                <span className="text-xs font-mono bg-slate-200 text-slate-700 px-2 py-1 rounded">{program.imageSrc}</span>
              </div>
              
              {/* Tartalom */}
              <div className="p-8 md:w-3/5 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{program.title}</h2>
                <div className="flex flex-wrap gap-4 mb-4 text-sm font-medium text-slate-600">
                  <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
                    <Calendar size={16} className="mr-2 flex-shrink-0" />
                    {program.date}
                  </div>
                  <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                    <MapPin size={16} className="mr-2 text-slate-400 flex-shrink-0" />
                    {program.location}
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {program.description}
                </p>
                <div className="mt-auto">
                  <Link href="/kapcsolat" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                    Érdeklődöm a program iránt <ArrowRight className="ml-1.5" size={18} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Intézményi támogatások */}
      <section className="bg-blue-50 py-16 border-y border-blue-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="flex items-center mb-6">
                <School className="text-blue-600 mr-4" size={32} />
                <h2 className="text-3xl font-bold text-slate-900">Intézményi támogatások</h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-6">
                Az események szervezése mellett kiemelt célunk a Vas vármegyei autizmus-specifikus oktatási-nevelési intézmények, valamint az integráltan oktató iskolák segítése. Eszközbeszerzésekkel és szakmai programokkal támogatjuk az alábbi intézményeket:
              </p>
              <ul className="space-y-3">
                {tamogatottIntezmenyek.map((intezmeny, index) => (
                  <li key={index} className="flex items-start bg-white px-4 py-3 rounded-lg shadow-sm border border-slate-100">
                    <GraduationCap className="text-blue-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
                    <span className="font-medium text-slate-700">{intezmeny}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 w-full">
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Szeretné intézményét támogatottjaink között látni?</h3>
                  <p className="text-slate-600 text-sm mb-6">Vegye fel velünk a kapcsolatot, hogy egyeztethessünk a szakmai igényekről és a lehetséges támogatási formákról.</p>
                  <Link href="/kapcsolat" className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors w-full sm:w-auto">
                    Kapcsolatfelvétel
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

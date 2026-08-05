import { Calendar, MapPin, ArrowRight, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function ProgramokPage() {
  const programok = [
    {
      title: 'Autizmus Világnapi "Kék Séta"',
      date: 'Minden év áprilisában',
      location: 'Szombathely',
      description: 'Hagyományos figyelemfelhívó sétánk, amellyel az autizmussal élők társadalmi elfogadását hirdetjük. Programunkkal célunk, hogy láthatóvá tegyük az érintett családokat és közelebb hozzuk a közösséget.',
    },
    {
      title: 'Képességfejlesztő Nyári Táborok',
      date: 'Nyári szünet',
      location: 'Vas vármegye',
      description: 'Kifejezetten autizmussal élő gyermekek számára szervezett táboraink biztonságos, elfogadó és kiszámítható környezetet nyújtanak a fejlődéshez és a kikapcsolódáshoz.',
    },
    {
      title: 'Szülőklub és Családi Napok',
      date: 'Folyamatos',
      location: 'Változó helyszínek',
      description: 'Lehetőség a tapasztalatcserére, szakemberekkel való találkozásra és a kötetlen feltöltődésre az érintett családok számára. Együtt könnyebb!',
    }
  ];

  return (
    <div className="pb-16">
      {/* Fejléc szekció */}
      <section className="bg-slate-50 pt-12 pb-16 border-b border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Programok és Események</h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600">
            Közösséget építünk. Fedezze fel állandó programjainkat, rendezvényeinket és csatlakozzon kezdeményezéseinkhez!
          </p>
        </div>
      </section>

      {/* Programok listája */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto grid gap-8">
          {programok.map((program, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row transition-shadow hover:shadow-md">
              {/* Kép helykitöltő */}
              <div className="bg-slate-100 md:w-1/3 flex items-center justify-center p-12 text-slate-300 border-b md:border-b-0 md:border-r border-slate-100">
                <ImageIcon size={48} />
              </div>
              
              {/* Tartalom */}
              <div className="p-8 md:w-2/3 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-3">{program.title}</h2>
                <div className="flex flex-wrap gap-4 mb-4 text-sm font-medium text-slate-500">
                  <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    <Calendar size={16} className="mr-2" />
                    {program.date}
                  </div>
                  <div className="flex items-center bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                    <MapPin size={16} className="mr-2 text-slate-400" />
                    {program.location}
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {program.description}
                </p>
                <div className="mt-auto">
                  <Link href="/kapcsolat" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                    Érdeklődöm a program iránt <ArrowRight className="ml-1" size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import Link from 'next/link';
import { Heart, Info, Users, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-16">
      {/* Hero Szekció */}
      <section className="bg-gradient-to-b from-blue-50 to-slate-50 pt-20 pb-16 md:pt-32 md:pb-24 border-b border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Közösen a Vas vármegyei <br className="hidden md:block" />
            <span className="text-blue-700">autista gyermekekért</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-600 mb-10">
            Alapítványunk célja a támogatás, az elfogadás elősegítése és a minőségi oktatás biztosítása az érintett családok számára.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/tamogatas" className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-sm">
              <Heart className="mr-2" size={20} />
              Támogassa munkánkat
            </Link>
            <Link href="/autizmus" className="inline-flex items-center justify-center bg-white text-slate-700 border border-slate-300 px-8 py-3 rounded-full font-semibold hover:bg-slate-50 transition-colors shadow-sm">
              <Info className="mr-2" size={20} />
              Mi az az autizmus?
            </Link>
          </div>
        </div>
      </section>

      {/* Fő tevékenységek (Kártyák) */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Hogyan segítünk?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Kártya 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center transition-shadow hover:shadow-md">
            <div className="bg-blue-100 p-4 rounded-full text-blue-700 mb-6">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Közösségépítés</h3>
            <p className="text-slate-600 mb-6 flex-grow">Családi napok, kék séták és nyári táborok szervezése, ahol az érintett családok kapcsolódhatnak.</p>
            <Link href="/programok" className="text-blue-600 font-medium hover:text-blue-800 flex items-center transition-colors">
              Programjaink <ArrowRight className="ml-1" size={16} />
            </Link>
          </div>
          
          {/* Kártya 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center transition-shadow hover:shadow-md">
            <div className="bg-blue-100 p-4 rounded-full text-blue-700 mb-6">
              <Info size={32} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Szemléletformálás</h3>
            <p className="text-slate-600 mb-6 flex-grow">Edukációs anyagok és kampányok az autizmus társadalmi elfogadásának növelése érdekében.</p>
            <Link href="/autizmus" className="text-blue-600 font-medium hover:text-blue-800 flex items-center transition-colors">
              Tudjon meg többet <ArrowRight className="ml-1" size={16} />
            </Link>
          </div>

          {/* Kártya 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center transition-shadow hover:shadow-md">
            <div className="bg-blue-100 p-4 rounded-full text-blue-700 mb-6">
              <Heart size={32} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Anyagi Támogatás</h3>
            <p className="text-slate-600 mb-6 flex-grow">Krízis alap fenntartása a bajba került családok megsegítésére és oktatási intézmények támogatására.</p>
            <Link href="/tamogatas" className="text-blue-600 font-medium hover:text-blue-800 flex items-center transition-colors">
              Segítsen Ön is <ArrowRight className="ml-1" size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

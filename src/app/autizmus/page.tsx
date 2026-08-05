import { Brain, MessageCircle, RefreshCw, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AutizmusPage() {
  return (
    <div className="pb-16">
      {/* Fejléc szekció */}
      <section className="bg-slate-50 pt-12 pb-16 border-b border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Mi az az autizmus?</h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600">
            Az autizmus nem betegség, hanem egy életre szóló állapot, egy eltérő fejlődésmenet, amely a világ észlelésének és a környezettel való interakciónak a módját befolyásolja.
          </p>
        </div>
      </section>

      {/* Fő jellemzők (Spektrum) */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Egy sokszínű spektrum</h2>
          <p className="text-slate-600 leading-relaxed">
            Az autizmus egy spektrumzavar, ami azt jelenti, hogy az érintettek képességei és nehézségei rendkívül változatosak lehetnek. Bár minden autista személy egyedi, vannak olyan közös területek, ahol az eltérő fejlődés megmutatkozik.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-blue-600 mb-4">
              <MessageCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Kommunikáció és Szociális interakciók</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Nehézséget okozhat a testbeszéd, a mimika olvasása, a kölcsönös beszélgetések fenntartása, vagy a társas szabályok ösztönös megértése.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-blue-600 mb-4">
              <RefreshCw size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Rugalmasság és Rutinok</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Gyakori az erős ragaszkodás a megszokott rutinokhoz. A váratlan változások szorongást okozhatnak, míg az ismétlődő tevékenységek megnyugtatóak lehetnek.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-blue-600 mb-4">
              <Brain size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Szenzoros érzékenység</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Az érzékszerveken keresztül érkező ingerek (hangok, fények, érintések, illatok) feldolgozása eltérő lehet; túlérzékenység és alulérzékenység is előfordulhat.
            </p>
          </div>
        </div>
      </section>

      {/* Tények és Tévhitek */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Tények és Tévhitek</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-l-red-400">
              <div className="flex items-start">
                <AlertCircle className="text-red-400 mr-3 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Tévhit: Az autizmus egy betegség, ami gyógyítható.</h4>
                  <p className="text-slate-600 text-sm">Tény: Az autizmus egy idegrendszeri fejlődési eltérés. Nem betegség, amit "meg kell gyógyítani", hanem egy állapot, ami megfelelő támogatással és elfogadással élhető.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-l-green-400">
              <div className="flex items-start">
                <ShieldCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Tény: Az autista emberek képesek a fejlődésre és a tanulásra.</h4>
                  <p className="text-slate-600 text-sm">Bár a tanulási folyamat eltérő lehet, célzott pedagógiai módszerekkel és támogató környezetben az autizmussal élők is folyamatosan fejlődnek, tanulnak és teljes értékű életet élhetnek.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

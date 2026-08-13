import { Brain, MessageCircle, RefreshCw, ShieldCheck, AlertCircle, Heart, BookOpen } from 'lucide-react';

export default function AutizmusPage() {
  const spektrumJellemzok = [
    {
      icon: <MessageCircle size={32} />,
      title: "Kommunikáció és Szociális interakció",
      desc: "Nehézséget okozhat a testbeszéd, a mimika olvasása, a kölcsönös beszélgetések fenntartása, vagy a társas szabályok ösztönös megértése. Sok érintett őszinte és egyenes kommunikációt folytat."
    },
    {
      icon: <RefreshCw size={32} />,
      title: "Rugalmasság és Rutinok",
      desc: "Gyakori az erős ragaszkodás a megszokott rutinokhoz. A váratlan változások szorongást okozhatnak, míg az ismétlődő, strukturált tevékenységek kiszámíthatóságot és megnyugvást adnak."
    },
    {
      icon: <Brain size={32} />,
      title: "Szenzoros érzékenység",
      desc: "Az érzékszerveken keresztül érkező ingerek (hangok, fények, érintések) feldolgozása eltérő lehet; túlérzékenység és alulérzékenység is előfordulhat a spektrumon."
    }
  ];

  const tanacsokSzuloknek = [
    "Ne hibáztassa magát! Az autizmus egy idegrendszeri fejlődési eltérés, nem a nevelés következménye.",
    "Keressen hiteles forrásokat és szakembereket (gyógypedagógus, gyermekpszichiáter) a korai fejlesztés megkezdéséhez.",
    "Csatlakozzon sorstársi közösségekhez (pl. a PontMás Alapítvány szülőklubjához), ahol megértésre és gyakorlati tanácsokra lelhet.",
    "Fókuszáljon a gyermeke erősségeire! Minden autizmussal élő gyermek egyedi képességekkel és érdeklődési körrel rendelkezik."
  ];

  return (
    <div className="pb-16">
      {/* Fejléc szekció */}
      <section className="bg-slate-50 pt-12 pb-16 border-b border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Mi az az autizmus?</h1>
          <p className="max-w-3xl mx-auto text-lg text-slate-600 leading-relaxed">
            Az autizmus nem betegség, hanem egy életre szóló állapot, egy eltérő fejlődésmenet. Befolyásolja, hogyan érzékeli az érintett a világot, és hogyan lép kapcsolatba a környezetével.
          </p>
        </div>
      </section>

      {/* Spektrum jellemzők */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Egy sokszínű spektrum</h2>
          <p className="text-slate-600 leading-relaxed">
            Az autizmus spektrumzavar, ami azt jelenti, hogy bár vannak közös jellemzők, az érintettek képességei és nehézségei rendkívül változatosak. Nincs két egyforma autista személy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {spektrumJellemzok.map((jellemzo, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="text-blue-600 mb-6 bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center">
                {jellemzo.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{jellemzo.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{jellemzo.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tények és Tévhitek (Vizuális megerősítés) */}
      <section className="bg-slate-100 py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Tények és Tévhitek</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-l-red-400 h-full flex flex-col justify-center">
              <div className="flex items-start">
                <AlertCircle className="text-red-400 mr-4 flex-shrink-0" size={28} />
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-2">Tévhit: Az autizmus gyógyítható betegség.</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">Tény: Az autizmus egy idegrendszeri sajátosság. Nem &quot;kigyógyulni&quot; kell belőle, hanem megfelelő támogatással és elfogadással élhetővé tenni a mindennapokat.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-l-green-400 h-full flex flex-col justify-center">
              <div className="flex items-start">
                <ShieldCheck className="text-green-500 mr-4 flex-shrink-0" size={28} />
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-2">Tény: Folyamatos fejlődésre képesek.</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">Célzott pedagógiai módszerekkel és támogató közegben az autizmussal élők is folyamatosan tanulnak, és a maguk ütemében teljes értékű életet élhetnek.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Útmutató Szülőknek */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="flex items-center justify-center mb-8">
          <Heart className="text-blue-600 mr-3" size={32} />
          <h2 className="text-3xl font-bold text-slate-900 text-center">Gyakorlati tanácsok szülőknek</h2>
        </div>
        <div className="bg-white border border-blue-100 rounded-2xl p-8 shadow-sm">
          <p className="text-slate-600 mb-6 leading-relaxed">
            A diagnózis pillanata sok család számára ijesztő lehet. Alapítványunk tapasztalata alapján az alábbi lépések segíthetnek az első időszakban:
          </p>
          <ul className="space-y-4">
            {tanacsokSzuloknek.map((tanacs, i) => (
              <li key={i} className="flex items-start">
                <BookOpen className="text-blue-500 mr-3 mt-1 flex-shrink-0" size={20} />
                <span className="text-slate-700 leading-relaxed font-medium">{tanacs}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

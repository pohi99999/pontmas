import { CheckCircle2 } from 'lucide-react';

export default function RolunkPage() {
  const celok = [
    'Oktatási intézmények támogatása',
    'Szülőklubok és szakmai továbbképzések szervezése',
    'Családi napok és nyári táborok lebonyolítása',
    'Szemléletformáló programok (pl. Kék Séta) indítása'
  ];

  return (
    <div className="pb-16">
      {/* Fejléc szekció */}
      <section className="bg-slate-50 pt-12 pb-16 border-b border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Rólunk</h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600">
            Ismerje meg a PontMás Vas Megyei Autista Gyermekekért Alapítvány történetét, küldetését és a mögötte álló elhivatott csapatot.
          </p>
        </div>
      </section>

      {/* Tartalmi szekció */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Küldetés és Történet */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Küldetésünk és Történetünk</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              A PontMás Alapítványt 2015-ben hoztuk létre azzal a határozott céllal, hogy a Vas vármegyében élő autista gyermekek és családjaik számára átfogó támogatást nyújtsunk.
            </p>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Legyen szó anyagi segítségről, eszközbeszerzésről, szakmai programokról vagy közösségépítésről, hiszünk abban, hogy közös erővel élhetőbb és elfogadóbb környezetet teremthetünk.
            </p>
            <ul className="space-y-3">
              {celok.map((item, i) => (
                <li key={i} className="flex items-center text-slate-700 font-medium">
                  <CheckCircle2 className="text-blue-600 mr-3 flex-shrink-0" size={20} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Szakmai Háttér kártya */}
          <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100 shadow-sm h-full flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Szakmai Háttér és Hitelesség</h3>
            <p className="text-blue-800 mb-4 leading-relaxed">
              A kuratórium elnöke <strong>Pohánka Edit</strong>, aki egyben az Autisták Országos Szövetségének (AOSZ) alelnöke is. Ez a kapcsolat biztosítja az országos szintű szakmai hálózatba ágyazottságot és a naprakész tudást.
            </p>
            <p className="text-blue-800 leading-relaxed">
              Alapítványunk tagjai maguk is autizmussal érintett szülők, valamint a spektrumzavarra specializálódott gyógypedagógusok és asszisztensek. Közel 40 Vas vármegyei családdal és számos oktatási-nevelési intézménnyel állunk napi kapcsolatban.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

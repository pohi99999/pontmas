import Image from 'next/image';
import { CheckCircle2, Target, Award, Users } from 'lucide-react';

export default function RolunkPage() {
  const alapelvek = [
    {
      icon: <Target className="text-blue-600" size={24} />,
      title: "Célzott támogatás",
      desc: "Anyagi, eszközbeli és szakmai segítségnyújtás a Vas vármegyében élő autista gyermekeknek és családjaiknak."
    },
    {
      icon: <Users className="text-blue-600" size={24} />,
      title: "Közösségi erő",
      desc: "Közel 40 családdal állunk közvetlen kapcsolatban, szülőklubokat és családi napokat szervezve a mindennapok megkönnyítésére."
    },
    {
      icon: <Award className="text-blue-600" size={24} />,
      title: "Szakmai hitelesség",
      desc: "Csapatunk autizmus-specifikus gyógypedagógusokból, asszisztensekből és elhivatott, érintett szülőkből áll."
    }
  ];

  const tevekenysegek = [
    "Autizmus-specifikus oktatási-nevelési intézmények támogatása fejlesztő eszközökkel.",
    "Rendszeres szülőklubok és szakmai továbbképzések biztosítása szakembereknek.",
    "Integrált és szegregált oktatásban részt vevő gyermekek esélyegyenlőségének elősegítése.",
    "Krízis alap fenntartása a váratlanul nehéz helyzetbe került családok gyors megsegítésére."
  ];

  return (
    <div className="pb-16">
      {/* Fejléc szekció */}
      <section className="bg-slate-50 pt-12 pb-16 border-b border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Kik vagyunk mi?</h1>
          <p className="max-w-3xl mx-auto text-lg text-slate-600 leading-relaxed">
            A PontMás Vas Megyei Autista Gyermekekért Alapítvány egy 2015 óta aktívan működő civil szervezet. Küldetésünk, hogy hidat képezzünk az érintett családok, a szakemberek és a társadalom között.
          </p>
        </div>
      </section>

      {/* Történetünk és Elnökség szekció */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
          
          {/* Szöveges tartalom */}
          <div className="md:col-span-7 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">Történetünk és küldetésünk</h2>
            <p className="text-slate-600 leading-relaxed">
              Alapítványunkat az élet hívta életre. Oynchron szülők és szakemberek fogtak össze, akik a saját bőrükön tapasztalták meg, milyen kihívásokkal kell szembenéznie egy autizmussal élő gyermeknek és családjának Vas vármegyében.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Nem csupán egy szervezet vagyunk: egy támogató és megtartó közösséget építünk, ahol a szülők megoszthatják tapasztalataikat, a gyermekek pedig biztonságos, megértő közegben fejlődhetnek.
            </p>
            
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mt-6">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Országos szakmai háttér</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                A kuratórium elnöke <strong>Pohánka Edit</strong>, aki egyben az Autisták Országos Szövetségének (AOSZ) alelnöke is. Ez a tisztség és szakmai beágyazottság garantálja, hogy alapítványunk a legfrissebb módszertanok és országos szintű lehetőségek mentén segítse a helyi közösséget.
              </p>
            </div>
          </div>

          {/* Vizuális Kép keret Next.js Image támogatással */}
          <div className="md:col-span-5 relative w-full h-[320px] bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center">
            <Image
              src="/images/csapat.jpg"
              alt="PontMás Alapítvány Csapatfotó"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
              onError={(e) => {
                // Helykitöltő vizuális elem, amíg a fájl nem létezik a public/images mappa alatt
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="p-6 text-center text-slate-400">
              <Users size={48} className="mx-auto mb-2 text-slate-300" />
              <p className="font-semibold text-slate-600">Alapítványi Csapatfotó</p>
              <p className="text-xs text-slate-400 mt-1">Helyezze el a képet:<br/><code className="bg-slate-200 px-1 py-0.5 rounded text-slate-700">/public/images/csapat.jpg</code></p>
            </div>
          </div>

        </div>
      </section>

      {/* Alapelvek grid */}
      <section className="bg-white border-y border-slate-100 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Értékeink</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {alapelvek.map((elv, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <div className="mb-4 bg-white w-12 h-12 rounded-lg flex items-center justify-center shadow-sm">
                  {elv.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{elv.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{elv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Részletes tevékenységi lista */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">Mivel foglalkozunk kiemelten?</h2>
        <div className="grid gap-4">
          {tevekenysegek.map((item, i) => (
            <div key={i} className="flex items-start bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
              <CheckCircle2 className="text-green-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
              <p className="text-slate-700 font-medium text-sm sm:text-base">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

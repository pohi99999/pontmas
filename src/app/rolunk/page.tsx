import { Target, Award, Users, ShieldCheck, Heart, CheckCircle2, Building2 } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import CtaBand from '@/components/ui/CtaBand';
import { CommunityGallery } from '@/components/content/Gallery';
import { AmiertDolgozunk, CsapatSor, SzuloiGondolatok } from '@/components/content/Hangunk';
import { FOUNDATION, ADDRESS_LINE } from '@/lib/foundation';

export default function RolunkPage() {
  const alapelvek = [
    {
      icon: <Target className="text-blue-600" size={26} />,
      title: "Célzott és közvetlen támogatás",
      desc: "Anyagi, eszközbeli és módszertani segítségnyújtás a Vas vármegyében élő autista gyermekeknek, szüleiknek és iskoláiknak."
    },
    {
      icon: <Users className="text-blue-600" size={26} />,
      title: "Összetartó közösség",
      desc: "Több mint 40 családdal állunk napi kapcsolatban. Szülőklubokat, családi napokat és közös programokat szervezünk az elszigetelődés ellen."
    },
    {
      icon: <Award className="text-blue-600" size={26} />,
      title: "Szakmai hitelesség és AOSZ-partnerség",
      desc: "Autizmus-specifikus gyógypedagógusok, szakasszisztensek és érintett szülők közös munkája garantálja a legfrissebb módszertani színvonalat."
    },
    {
      icon: <Heart className="text-blue-600" size={26} />,
      title: "Elfogadás és esélyegyenlőség",
      desc: "Társadalmi szemléletformálással és intézményi segítségnyújtással küzdünk azért, hogy minden gyermek a képességeihez mérten kibontakozhasson."
    }
  ];

  const merfoldkovek = [
    { ev: "2015", cim: "Alapítás Szombathelyen", leiras: "Érintett szülők és gyógypedagógusok elhatározásából létrejön a PontMás Vas Megyei Autista Gyermekekért Alapítvány." },
    { ev: "2018", cim: "Intézményi eszközbeszerzések", leiras: "Megkezdődik a Vas megyei speciális és integráló intézmények célzott fejlesztőeszköz-ellátása." },
    { ev: "2024+", cim: "Közösségi hálózat bővülése", leiras: "Éves Kék séták, képességfejlesztő nyári táborok és folyamatos krízisalap működtetése." }
  ];

  return (
    <div className="pb-20">
      
      {/* 1. Fejléc szekció */}
      <PageHeader
        badge="Kik vagyunk mi?"
        title="A PontMás Alapítvány története és küldetése"
        subtitle="2015 óta hidat képezünk az autizmussal élő gyermekek, családjaik, a szakemberek és a társadalom között Vas vármegyében."
      />

      {/* 2. Történetünk és Elnökség szekció */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
          
          {/* Szöveges tartalom */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Személyes elhivatottságból született segítség
            </h2>
            
            <p className="text-slate-600 leading-relaxed text-base">
              Alapítványunkat az élet hívta életre. Olyan elkötelezett szülők és gyógypedagógusok fogtak össze, akik a mindennapi valóságban tapasztalták meg, milyen akadályokkal szembesül egy autizmussal élő gyermek és családja Vas vármegyében.
            </p>
            
            <p className="text-slate-600 leading-relaxed text-base">
              Nem csupán egy adminisztratív szervezet vagyunk: megtartó közösséget építünk, ahol a szülők megoszthatják tapasztalataikat és aggodalmaikat, a gyermekek pedig biztonságos, ingerszegény és szeretetteljes közegben fejlődhetnek.
            </p>

            {/* Elnökség & AOSZ Kiemelés */}
            <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-6 shadow-2xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-950">Országos szakmai beágyazottság</h3>
                  <p className="text-xs text-blue-700 font-semibold">Autisták Országos Szövetsége (AOSZ) tagszervezet</p>
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed pt-1">
                A kuratórium elnöke <strong>Pohánka Edit</strong>, aki egyben az <strong>Autisták Országos Szövetségének (AOSZ) alelnöke</strong> is. Ez a pozíció és elismert szakmai háttér biztosítja, hogy alapítványunk az országos irányelvek és a legkorszerűbb módszertanok alapján támogassa a Vas vármegyei közösséget.
              </p>
            </div>
          </div>

          {/* Hitelességi kártya */}
          <div className="lg:col-span-5 bg-blue-950 text-white pm-sotet rounded-3xl p-8 shadow-xl border border-slate-800 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Szervezeti hitelesség</h3>
                <span className="text-xs text-slate-400">PontMás Alapítvány</span>
              </div>
            </div>

            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-slate-300"><strong className="text-white">Bejegyzés éve:</strong> 2015.09.08.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-slate-300"><strong className="text-white">Adószám:</strong> {FOUNDATION.taxNumber}</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-slate-300"><strong className="text-white">Fő tevékenység:</strong> Egyéb szociális ellátás bentlakás nélkül (TEÁOR 8899)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-slate-300"><strong className="text-white">Székhely:</strong> {ADDRESS_LINE}</span>
              </li>
            </ul>

            <div className="pt-2">
              <Button href="/tamogatas" variant="primary" size="md" fullWidth>
                Támogassa Alapítványunkat
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* The people of the foundation: shows once a portrait is published (src/content/csapat.ts) */}
      <CsapatSor />

      {/* 3. Értékeink Grid */}
      <section className="bg-white border-y border-slate-200/80 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <SectionHeader
            badge="Iránytűnk"
            title="Alapértékeink és szemléletünk"
            subtitle="Minden döntésünket és programunkat az érintett gyermekek és családjaik valódi jólléte vezérli."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {alapelvek.map((elv, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex flex-col">
                <div className="mb-4 bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-xs border border-slate-100">
                  {elv.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{elv.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed flex-grow">{elv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Mérföldkövek / Idővonal */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-5xl">
        <SectionHeader
          badge="Útunk"
          title="Főbb mérföldköveink"
          subtitle="Hogyan fejlődött a PontMás Alapítvány a megalakulása óta?"
        />

        <div className="grid md:grid-cols-3 gap-6">
          {merfoldkovek.map((m, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="display text-4xl text-blue-700 mb-2 block">{m.ev}</span>
              <h3 className="font-bold text-slate-900 text-base mb-2">{m.cim}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{m.leiras}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The foundation's own voice; the parents' thoughts show only once real ones arrive (src/content/hangunk.ts) */}
      <AmiertDolgozunk />
      <SzuloiGondolatok />

      {/* Képek a közösségről */}
      <CommunityGallery />

      {/* 5. Csatlakozás és Kapcsolat CTA */}
      <CtaBand
        title="Legyen része közösségünknek!"
        text="Akár érintett szülőként, akár szakemberként vagy támogatóként keres minket, szeretettel várjuk megkeresését."
        headingLevel="h2"
      >
        <Button href="/kapcsolat" variant="primary">
          Kapcsolatfelvétel
        </Button>
        <Button href="/tamogatas" variant="outline">
          Támogatási formák
        </Button>
      </CtaBand>

    </div>
  );
}

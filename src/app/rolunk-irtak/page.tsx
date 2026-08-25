import type { Metadata } from "next";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { 
  Newspaper, 
  Quote, 
  Tv, 
  HeartHandshake, 
  ExternalLink, 
  Calendar, 
  Sparkles, 
  MessageSquare,
  Award,
  ArrowRight
} from "lucide-react";

export const metadata: Metadata = {
  title: "Rólunk írták & Sajtómegjelenések | PontMás Alapítvány",
  description: "Cikkek, tudósítások, interjúk és köszönetnyilvánítások a PontMás Alapítvány tevékenységéről és a Vas vármegyei autizmus közösségről.",
  openGraph: {
    title: "Rólunk írták | PontMás Alapítvány",
    description: "Sajtócikkek, elismerések és személyes történetek a PontMás Alapítvány munkájáról.",
    url: "https://pontmas.hu/rolunk-irtak",
  },
};

export default function RolunkIrtakPage() {
  const articles = [
    {
      type: "sajto",
      badge: "Sajtóhír • VAOL / Vas Népe",
      icon: Newspaper,
      title: "Kékbe öltözött Szombathely – Séta és figyelemfelhívás az Autizmus Világnapján",
      date: "2024. április",
      summary: "Több száz résztvevővel, érintett családdal és támogatóval tartotta meg a PontMás Alapítvány az Autizmus Világnapja alkalmából szervezett szombathelyi Kék Sétát. A Városháza és a Fő tér kék megvilágítása a szolidaritást és a társadalmi elfogadást szimbolizálta.",
      quote: "„Célunk, hogy a társadalom ne félelemmel vagy távolságtartással, hanem nyitottsággal és megértéssel tekintsen az autizmussal élőkre.”",
      source: "Vas Vármegyei Hírportál (VAOL)",
    },
    {
      type: "koszonet",
      badge: "Szülői Visszajelzés • Köszönetnyilvánítás",
      icon: Quote,
      title: "„A szülőklub adott erőt és kapaszkodót az óvodai integrációban”",
      date: "2024. október",
      summary: "Egy szombathelyi édesanya megható levele arról, hogyan segített a PontMás Alapítvány szülőklubja és a szakképzett gyógypedagógusok tanácsa abban, hogy kisfia zökkenőmentesen kezdhesse meg a közösségi életet a helyi óvodában.",
      quote: "„Amikor megkaptuk a diagnózist, elszigeteltnek éreztük magunkat. A PontMás közössége nemcsak szakmai választ adott minden kérdésünkre, de igazi biztonságot és barátokat találtunk.”",
      source: "Érintett szülői beszámoló",
    },
    {
      type: "sajto",
      badge: "Tudósítás • Szombathelyi Televízió",
      icon: Tv,
      title: "Akkreditált gyógypedagógiai képzést finanszírozott a PontMás Alapítvány",
      date: "2024. június",
      summary: "Szombathely MJV Önkormányzati Támogatásának köszönhetően 13 szombathelyi gyógypedagógus és asszisztens vehetett részt az Autizmus Alapítvány 30 órás, magas szintű szakmai továbbképzésén, 100%-os alapítványi finanszírozással.",
      quote: "„A legjobb befektetés gyermekeink jövőjébe az, ha a velük nap mint nap foglalkozó pedagógusok a legkorszerűbb autizmus-specifikus módszertannal rendelkeznek.”",
      source: "SZTV Híradó & Önkormányzati tudósítás",
    },
    {
      type: "esemeny",
      badge: "Élménybeszámoló • Vasi Skanzen",
      icon: HeartHandshake,
      title: "Családi Nap és Szülőklub a Vasi Skanzenben – Közösség és feltöltődés",
      date: "2024. szeptember",
      summary: "A hagyományos őszi családi napon kézműves foglalkozásokkal, agyagozással, nyúlkuglival és gyógypedagógusok által kísért akadálypályával várták a gyermekeket, míg a szülők pszichológus által vezetett támogató csoportban oszthatták meg tapasztalataikat.",
      quote: "„A gyerekek szabadon, feszültség nélkül önmaguk lehettek, mi szülők pedig megkönnyebbülten beszélgethettünk a mindennapok kihívásairól.”",
      source: "PontMás Alapítványi Krónika",
    },
    {
      type: "elismeres",
      badge: "Szakmai Partnerség • AOSZ",
      icon: Award,
      title: "Megnyílt a Szombathelyi AOSZ Info-Pont a Sugár úton",
      date: "2023. november",
      summary: "Az Autisták Országos Szövetségével kötött stratégiai partnerség keretében létrejött a szombathelyi információs pont, amely a DATA applikáció bevezetésével és mentorszülői tanácsadással közvetlen segítséget nyújt a Nyugat-Dunántúlon.",
      quote: "„Egy olyan hiánypótló központ jött létre, ahol a diagnózis utáni első bizonytalan lépésektől kezdve a felnőttkori autonómiáig mindenki szakértő segítséget kap.”",
      source: "AOSZ Sajtóközlemény",
    },
    {
      type: "koszonet",
      badge: "Intézményi Köszönet • Aranyhíd EGYMI",
      icon: Quote,
      title: "Új fejlesztő eszközök és speciális könyvtári állomány az autista diákoknak",
      date: "2024. május",
      summary: "A helyi partnerintézmények gyógypedagógusai fejezték ki köszönetüket a PontMás Alapítványnak az adományozott vizuális napirendi eszközökért, érzékszervi fejlesztő játékokért és a folyamatosan bővülő szakirodalmi könyvtárért.",
      quote: "„Az alapítvány támogatása nélkül sokkal nehezebb lenne biztosítani a differenciált, személyre szabott fejlesztést tanulóinknak.”",
      source: "Pedagógiai munkaközösség",
    },
  ];

  return (
    <div className="flex flex-col gap-16 py-12 md:py-20">
      {/* 1. Hero */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-6 py-16 sm:px-12 sm:py-20 text-white shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-6">
            <Badge variant="info">
              Média, Sajtó & Elismerések
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Rólunk írták & Közösségi Visszhangok
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
              Szeretnénk tevékenységünket és az autizmussal élő gyermekek mindennapjait minél szélesebb körben bemutatni, hogy a társadalom megértéssel és támogató szeretettel fogadja el őket.
            </p>
          </div>
          <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* 2. Cikkek és köszönetnyilvánítások rácsa */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          title="Sajtómegjelenések, tudósítások és szülői köszönőlevelek"
          subtitle="Összegyűjtöttük az elmúlt évek legfontosabb médiamegjelenéseit, televíziós tudósításait és személyes történeteit."
          center
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((item, index) => {
            const Icon = item.icon;
            return (
              <article 
                key={index} 
                className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                      <Icon className="h-3.5 w-3.5" />
                      <span>{item.badge}</span>
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {item.date}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.summary}
                  </p>

                  {item.quote && (
                    <div className="relative rounded-2xl bg-slate-50 p-4 border border-slate-100 italic text-xs text-slate-700 leading-relaxed">
                      <Quote className="h-5 w-5 text-blue-300 absolute -top-2.5 -left-1 bg-white rounded-full p-0.5" />
                      <p className="pt-1">{item.quote}</p>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Forrás: {item.source}</span>
                  <Sparkles className="h-4 w-4 text-blue-400" />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 3. Kapcsolati felhívás sajtónak és szülőknek */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-black">Sajtómegkeresése van vagy megosztaná saját történetét?</h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Örömmel állunk az újságírók, médiafelületek és az érintett családok rendelkezésére interjúk, cikkek és szakmai beszélgetések kapcsán.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 flex-shrink-0">
            <Button href="/kapcsolat" variant="primary" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3">
              Kapcsolatfelvétel
            </Button>
            <Button href="/rolunk" variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800">
              Alapítványunkról
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

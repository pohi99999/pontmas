import type { Metadata } from "next";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ArrowRight, 
  Sparkles, 
  Megaphone, 
  CheckCircle2, 
  Heart, 
  GraduationCap,
  ExternalLink
} from "lucide-react";

export const metadata: Metadata = {
  title: "Hírek & Aktualitások | PontMás Alapítvány",
  description: "A PontMás Alapítvány legfrissebb hírei, szülőklub meghívói, családi nap beszámolói és szakmai továbbképzései.",
  openGraph: {
    title: "Hírek & Aktualitások | PontMás Alapítvány",
    description: "Értesüljön a PontMás Alapítvány legújabb eseményeiről, programjairól és híreiről.",
    url: "https://pontmas.hu/hirek",
  },
};

export default function HirekPage() {
  const newsItems = [
    {
      featured: true,
      badge: "Kiemelt Esemény • Szülőklub",
      title: "Meghívó: Szülőklub – „Foglald el magad egy kicsit! Önálló szabadidős tevékenységek tervezése, tanítása”",
      date: "2024. október 26. (Szombat) 14:00 - 16:30",
      location: "9700 Szombathely, Sugár út 9. (PontMás Alapítvány Irodája)",
      speaker: "Bárdosi Emőke – Az Aranyhíd EGYMI szakirányos gyógypedagógusa",
      description: "A PontMás Vas Megyei Autista Gyermekekért Alapítvány szeretettel meghívja az érintett szülőket, hozzátartozókat és szakembereket soron következő szakmai szülőklub rendezvényére. A részvétel ingyenes, de regisztrációhoz kötött.",
      highlights: [
        "Gyakorlati módszerek az önálló otthoni szabadidő eltöltéséhez",
        "Vizuális napirendek és tevékenység-tervezők alkalmazása",
        "Kötetlen szülői tapasztalatcsere és tanácsadás",
      ],
      actionText: "Regisztráció a Szülőklubra",
      actionHref: "/kapcsolat?topic=szulo",
      googleFormHref: "https://forms.gle/1gBnMZHoTn3DuZ189",
    },
    {
      featured: false,
      badge: "Közösségi Élet • Beszámoló",
      title: "Családi Nap 2024 a Vasi Skanzenben – Közösségépítés és Szülőklub a természetben",
      date: "2024. szeptember 28.",
      location: "Vasi Skanzen, Szombathely",
      speaker: "Temesi Patrícia pszichológus & Pohánka Edit kuratóriumi elnök",
      description: "Hagyományos őszi családi napunkon a változékony idő ellenére is nagyszerű hangulatban gyűltek össze a családok. A gyermekek gyógypedagógusok és asszisztensek segítségével agyagozhattak, körmöcskézhettek, fát ültethettek, nyúlkuglizhattak és akadálypályán vehettek részt, míg a szülőknek Temesi Patrícia pszichológus vezetett interaktív és feltöltő csapatépítő beszélgetést.",
      highlights: [
        "Gyógypedagógusok által felügyelt kreatív állomások",
        "Pszichológiai támogatás és tapasztalatcsere az iskolakezdésről",
        "Közös pizza-parti és kötetlen barátkozás",
      ],
      actionText: "Részletes beszámoló",
      actionHref: "/programok",
    },
    {
      featured: false,
      badge: "Szakmai Fejlesztés • Támogatás",
      title: "Továbbképzés gyógypedagógusok és asszisztensek részére (Szombathely MJV támogatásával)",
      date: "2024. április - május",
      location: "Autizmus Alapítvány Képzési Központ",
      speaker: "13 szombathelyi pedagógus az Aranyhíd EGYMI, Micimackó Óvoda és Váci Mihály Ált. Iskolából",
      description: "Alapítványunk a Szombathely Megyei Jogú Város Önkormányzati Támogatási Rendszerén keresztül elnyert 800.000 Ft támogatás segítségével 100%-ban finanszírozta a helyi szakemberek akkreditált 30 órás alapozó és kommunikációs-szociális képzéseit.",
      highlights: [
        "11 fő végezte el az Autizmussal élő gyermekek célzott pedagógiai ellátása 30 órás képzést",
        "2 fő végezte el a Szociális és kommunikációs készségek fejlesztése kurzust",
        "A képzések teljes 715.000 Ft-os díját az alapítvány finanszírozta",
      ],
      actionText: "Pályázati dokumentumok",
      actionHref: "/dokumentumok",
    },
    {
      featured: false,
      badge: "Önkéntesség • Felhívás",
      title: "Önkéntes segítőket és aktivistákat keresünk!",
      date: "Folyamatosan",
      location: "Szombathely és környéke",
      speaker: "PontMás Alapítvány Kuratóriuma",
      description: "Munkánk bővülésével és a növekvő igényekkel párhuzamosan elkötelezett önkénteseket keresünk rendezvényeink lebonyolításához, szülőklubok szervezéséhez, kommunikációhoz és adminisztrációhoz.",
      highlights: [
        "Rendezvényszervezés (Kék Séta, Családi Nap, Szülőklubok)",
        "Gyermekfelügyelet és segítői közreműködés programokon",
        "Közösségi média és szemléletformáló kampányok támogatása",
      ],
      actionText: "Jelentkezem önkéntesnek",
      actionHref: "/kapcsolat?topic=onkentes",
    },
  ];

  return (
    <div className="flex flex-col gap-16 py-12 md:py-20">
      {/* 1. Hero */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 px-6 py-16 sm:px-12 sm:py-20 text-white shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-6">
            <Badge variant="warning">
              Hírek, Aktualitások & Események
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Közösségi élet, programok és szakmai hírek
            </h1>
            <p className="text-lg sm:text-xl text-blue-100/90 leading-relaxed">
              Kövesse figyelemmel a PontMás Alapítvány legfrissebb eseményeit, szülőklubjait, szakmai támogatási programjait és élménybeszámolóit!
            </p>
          </div>
          <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* 2. Kiemelt hír / Meghívó banner */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border-2 border-blue-500/40 bg-gradient-to-br from-blue-50 via-white to-sky-50 p-8 sm:p-12 shadow-lg space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Badge variant="info">
              Legközelebbi Szülőklub
            </Badge>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 bg-blue-100/80 px-3 py-1.5 rounded-full">
              <Calendar className="h-4 w-4" />
              <span>{newsItems[0].date}</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            {newsItems[0].title}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-700 bg-white/80 p-5 rounded-2xl border border-blue-100">
            <div className="flex items-start gap-2.5">
              <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-900">Helyszín:</span>
                <span>{newsItems[0].location}</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <GraduationCap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-900">Előadó:</span>
                <span>{newsItems[0].speaker}</span>
              </div>
            </div>
          </div>

          <p className="text-base text-slate-700 leading-relaxed">
            {newsItems[0].description}
          </p>

          <div className="space-y-2 border-t border-blue-100 pt-4">
            <h4 className="font-bold text-slate-900 text-sm">Főbb témák és program:</h4>
            <div className="grid sm:grid-cols-3 gap-3">
              {newsItems[0].highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Button
              href={newsItems[0].actionHref}
              variant="primary"
              size="lg"
              className="bg-blue-700 hover:bg-blue-800"
            >
              {newsItems[0].actionText}
            </Button>
            {newsItems[0].googleFormHref && (
              <a
                href={newsItems[0].googleFormHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 px-4 py-2.5 rounded-xl border border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <span>Google Űrlap megnyitása</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* 3. További hírek és beszámolók */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          title="További híreink és beszámolóink"
          subtitle="Ismerje meg az alapítvány legfrissebb eseményeit és szakmai tevékenységeit."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsItems.slice(1).map((item, index) => (
            <article
              key={index}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    {item.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {item.date}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>

                <div className="border-t border-slate-100 pt-3 space-y-2">
                  {item.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100">
                <Link
                  href={item.actionHref}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <span>{item.actionText}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. Önkéntes toborzó felhívás */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-2xl">
            <Badge variant="warning">Csatlakozzon Hozzánk</Badge>
            <h3 className="text-2xl sm:text-3xl font-black">Szeretne önkéntesként segíteni munkánkat?</h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Legyen szó rendezvényekről, gyermekfoglalkozásokról, szülőklubokról vagy online kommunikációról, minden segítő kéznek és jó szándéknak nagyon örülünk!
            </p>
          </div>
          <div className="flex flex-wrap gap-4 flex-shrink-0">
            <Button href="/kapcsolat?topic=onkentes" variant="primary" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3">
              Jelentkezem Önkéntesnek
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

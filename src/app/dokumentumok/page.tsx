import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Download, Archive, Award, ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import DocDownloadButton from '@/components/ui/DocDownloadButton';

export const metadata: Metadata = {
  title: "Dokumentumtár & Pályázatok | PontMás Alapítvány",
  description: "A PontMás Alapítvány hivatalos alapító okirata, közhasznúsági beszámolói, adatvédelmi tájékoztatója és önkormányzati pályázati elszámolásai.",
  openGraph: {
    title: "Dokumentumtár & Pályázatok | PontMás Alapítvány",
    description: "Hivatalos átláthatósági dokumentumok és pályázatok.",
    url: "https://pontmas.hu/dokumentumok",
  },
};

export default function DokumentumokPage() {
  const officialDocs = [
    {
      title: "Alapító Okirat és Határozatok",
      category: "Jogi alapdokumentum",
      date: "Nyilvántartási szám: 18-01-0001850",
      description: "A PontMás Vas Megyei Autista Gyermekekért Alapítvány hivatalos alapító okirata, célkitűzései és kuratóriumi működési rendje.",
    },
    {
      title: "Adatvédelmi és Adatkezelési Szabályzat (GDPR)",
      category: "Adatvédelem",
      date: "Hatályos: 2024. január 1-től",
      description: "Tájékoztató a weboldal látogatóinak, hírlevél feliratkozóknak és az érintett családok adatainak jogszerű kezeléséről.",
    },
    {
      title: "2023. évi Közhasznúsági és Pénzügyi Beszámoló",
      category: "Közhasznúsági jelentés",
      date: "Elfogadva: 2024. május",
      description: "Részletes mérleg és eredménykimutatás a beérkezett adó 1% felajánlásokról és a cél szerinti programok finanszírozásáról.",
    },
    {
      title: "2022. évi Közhasznúsági és Szakmai Beszámoló",
      category: "Közhasznúsági jelentés",
      date: "Elfogadva: 2023. május",
      description: "Éves összefoglaló a Kék Séta, nyári táborok és szülőklubok megvalósításáról és pénzügyi mérlegéről.",
    },
  ];

  const grantProjects = [
    {
      title: "Szombathely MJV Önkormányzati Támogatás – Pedagógus Képzések",
      badge: "Megvalósult Pályázat",
      grantAmount: "800.000 Ft támogatási összeg",
      description: "A szombathelyi intézmények (Aranyhíd EGYMI, Micimackó Óvoda, Váci Mihály Általános Iskola) 13 gyógypedagógusának és asszisztensének akkreditált Autizmus Alapítványi továbbképzése (Alapozó 30 órás képzés és Szociális-kommunikációs képzés).",
      details: [
        "Megvalósítás időszaka: 2024. április – május",
        "Összes finanszírozott képzési költség: 715.000 Ft (100%-os támogatás)",
        "Támogató szervezet: Szombathely Megyei Jogú Város Önkormányzata",
      ],
    },
    {
      title: "Városi Civil Alap – Családi Nap & Szülőklub Fejlesztés",
      badge: "Közösségi Támogatás",
      grantAmount: "Közösségi és szakmai forrás",
      description: "Éves családi nap megszervezése a Vasi Skanzenben, agyagozó és készségfejlesztő gyermekfoglalkozásokkal, valamint pszichológus által vezetett szülői támogatással.",
      details: [
        "Megvalósítás: 2024. szeptember",
        "Helyszín: Vasi Skanzen Szombathely",
        "Résztvevők száma: Több tucat Vas vármegyei érintett család",
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-16 py-12 md:py-20">
      {/* 1. Fejléc */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-6 py-16 sm:px-12 sm:py-20 text-white shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-6">
            <Badge variant="info">Átláthatóság & Hitelesség</Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Dokumentumtár és Hivatalos Pályázatok
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
              Az átláthatóság és a társadalmi felelősségvállalás alapítványunk működésének alappillére. Itt érheti el hivatalos dokumentumainkat, közhasznúsági beszámolóinkat és pályázati elszámolásainkat.
            </p>
          </div>
          <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* 2. Hivatalos Iratok & Beszámolók */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          title="Hivatalos Iratok és Éves Beszámolók"
          subtitle="Minden törvényi előírásnak és közhasznúsági követelménynek maradéktalanul eleget teszünk."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {officialDocs.map((doc, index) => (
            <div
              key={index}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    <FileText className="h-3.5 w-3.5" />
                    {doc.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{doc.date}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {doc.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {doc.description}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Hivatalos PDF formátum</span>
                <DocDownloadButton docTitle={doc.title} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Pályázatok és Önkormányzati Támogatások */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          title="Megvalósult Pályázatok és Elszámolások"
          subtitle="Tudjon meg többet a támogatások célszerű és szakszerű felhasználásáról."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {grantProjects.map((project, index) => (
            <div
              key={index}
              className="flex flex-col justify-between rounded-3xl border border-blue-200/80 bg-gradient-to-br from-white to-blue-50/40 p-8 shadow-sm space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="warning">{project.badge}</Badge>
                  <span className="text-xs font-bold text-blue-900 bg-blue-100 px-3 py-1 rounded-full">
                    {project.grantAmount}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  {project.title}
                </h3>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {project.description}
                </p>

                <div className="border-t border-blue-100 pt-4 space-y-2">
                  {project.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Kapcsolat / Kérdés */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-black">További hivatalos információt keres?</h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Kérdéseivel, szakmai együttműködési javaslataival forduljon bizalommal Kuratóriumunkhoz az info@pontmas.hu címen vagy kapcsolatfelvételi űrlapunkon keresztül!
            </p>
          </div>
          <div className="flex flex-wrap gap-4 flex-shrink-0">
            <Button href="/kapcsolat" variant="primary" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3">
              Kapcsolatfelvétel
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

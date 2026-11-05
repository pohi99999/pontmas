import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from '@/components/ui/PageHeader';
import SectionHeader from "@/components/ui/SectionHeader";
import FeatureCard from "@/components/ui/FeatureCard";
import ActionCard from "@/components/ui/ActionCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Users, Smartphone, BookOpen, School, CheckCircle2, ArrowRight, HeartHandshake } from "lucide-react";
import CtaBand from '@/components/ui/CtaBand';

export const metadata: Metadata = {
  title: "Amiben segíteni tudunk | PontMás Alapítvány",
  description: "Mentorszülői tanácsadás, DATA applikáció támogatás, szakmai könyvtár kölcsönzés és intézményi eligazítás Vas vármegyében.",
  openGraph: {
    title: "Amiben segíteni tudunk | PontMás Alapítvány",
    description: "Autizmussal élő gyermekek és családjaik átfogó támogatása Vas vármegyében.",
    url: "https://pontmas.hu/segitseg",
  },
};

export default function HelpPage() {
  const services = [
    {
      icon: Users,
      badge: "Szülői Közösség",
      title: "Mentorszülői Tanácsadás",
      description: "Kérdezzen olyan édesanyától vagy édesapától, aki szintén autizmussal élő gyermeket nevel! Az AOSZ által felkészített mentorszülők személyes tapasztalattal és empátiával segítik a frissen diagnosztizált vagy nehézségekkel küzdő családokat.",
      bullets: [
        "Személyes és telefonos sorstársi beszélgetés",
        "Gyakorlati mindennapi tanácsok és megküzdési stratégiák",
        "AOSZ által képzett, hiteles mentorszülői hálózat",
      ],
      linkText: "Mentorszülő keresése",
      linkHref: "/kapcsolat?topic=mentorszuloi-tanacsadas",
    },
    {
      icon: Smartphone,
      badge: "Digitális Segítség",
      title: "DATA Applikáció Támogatás",
      description: "A Digitális Autonómia Támogató Alkalmazás (DATA) segít az autista személyeknek a mindennapi napirend, folyamatábrák és vizuális támogatás kialakításában. Irodánkban segítünk a letöltésben és a testreszabásban.",
      bullets: [
        "Alkalmazás telepítése okostelefonra és tabletre",
        "Egyéni napirendek és vizuális folyamatok feltöltése",
        "Gyakorlati betanítás szülőknek és pedagógusoknak",
      ],
      linkText: "DATA támogatást kérek",
      linkHref: "/kapcsolat?topic=data-applikacio",
    },
    {
      icon: BookOpen,
      badge: "Tudástár",
      title: "Vas Vármegyei Szakkönyvtár",
      description: "Folyamatosan bővülő szakkönyvtárunkból érintett szülők, pedagógusok, gyógypedagógusok és egyetemi hallgatók egyaránt ingyenesen kölcsönözhetnek autizmus-specifikus szakkönyveket és fejlesztő anyagokat.",
      bullets: [
        "Korszerű magyar és külföldi szakirodalom",
        "Fejlesztő füzetek, vizuális támogató eszközök és PECS anyagok",
        "Ingyenes kölcsönzés regisztráció után",
      ],
      linkText: "Könyvtári kölcsönzés",
      linkHref: "/kapcsolat?topic=szakkonyvtar",
    },
    {
      icon: School,
      badge: "Oktatási Kalauz",
      title: "Intézményi & Integrációs Eligazítás",
      description: "Részletes felvilágosítást nyújtunk a Vas vármegyei autizmus-ellátásról, a szegregáltan és integráltan nevelő óvodákról, általános és középiskolákról, valamint fejlesztő központokról.",
      bullets: [
        "Óvodai és iskolai beilleszkedési tanácsadás",
        "Együttműködés: Aranyhíd EGYMI, Micimackó Óvoda, Váci Mihály Ált. Isk.",
        "Szakértői bizottsági folyamatok megértése",
      ],
      linkText: "Intézményi tanácsadás",
      linkHref: "/kapcsolat?topic=intezmenyi-tanacsadas",
    },
    {
      icon: HeartHandshake,
      badge: "Közösség",
      title: "Szülőklub & Élménynapok",
      description: "Rendszeres szülőklub alkalmak szakemberek (gyógypedagógusok, pszichológusok) bevonásával, valamint éves Családi Nap a Vasi Skanzenben és Kék Séta az elfogadásért.",
      bullets: [
        "Kötetlen szülői tapasztalatcsere és szakmai előadások",
        "Biztonságos, autizmus-barát családi programok",
        "Gyermekfoglalkozások képzett segítőkkel",
      ],
      linkText: "Következő szülőklub megtekintése",
      linkHref: "/hirek",
    },
  ];

  return (
    <div className="flex flex-col gap-16 pb-12 md:pb-20">
      {/* 1. Hero szekció */}
      <PageHeader
        badge="Szolgáltatásaink & Segítségnyújtás"
        title="Nem kell egyedül végigmennie ezen az úton."
        subtitle="A PontMás Alapítvány 2015-ös megalakulása óta azért dolgozik, hogy a Vas vármegyei autizmussal élő gyermekek és családtagjaik minden élethelyzetben valódi, szakszerű és emberközeli támogatást kapjanak."
      >
        <div className="flex flex-wrap gap-4">
          <Button href="#szolgaltatasok" variant="primary">
            Szolgáltatásaink megtekintése
          </Button>
          <Button href="/kapcsolat" variant="outline">
            Kérdezzen kollégánktól
          </Button>
        </div>
      </PageHeader>

      {/* 2. Szolgáltatások részletesen */}
      <section id="szolgaltatasok" className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          title="Amiben segíteni tudunk Önnek és családjának"
          subtitle="Átfogó segítségnyújtás a gyanú felmerülésétől a diagnózison át az iskolai integrációig és mindennapi életviteli támogatásig."
          align="center"
        />

        {/* Five services: three and two on large screens, so no row ends in an empty column */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index} 
                className={`flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition-all group ${index < 3 ? 'lg:col-span-2' : 'lg:col-span-3'} ${index === 4 ? 'md:max-lg:col-span-2' : ''}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="neutral">{service.badge}</Badge>
                  </div>
                  <h3 className="display text-xl text-slate-900">{service.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>
                  
                  <div className="border-t border-slate-100 pt-3 space-y-2">
                    {service.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100">
                  <Link
                    href={service.linkHref}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <span>{service.linkText}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Lépésről lépésre: Mi a teendő ha felmerül a gyanú? */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-100 p-8 sm:p-12 space-y-8 border border-slate-200/80">
          <SectionHeader
            title="Hova forduljon, ha úgy gondolja, gyermeke autizmussal élhet?"
            subtitle="Gyakorlati útmutató a kivizsgálás és a segítségkérés első lépéseihez."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">1</div>
              <h3 className="font-bold text-slate-900 text-lg">Gyermekorvos & Védőnő</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Első lépésként jelezze észrevételeit a házi gyermekorvosnak vagy a védőnőnek, kérjen fejlődésneurológiai vagy gyermekpszichiátriai beutalót.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">2</div>
              <h3 className="font-bold text-slate-900 text-lg">Szakszolgálat & Diagnosztika</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                A Vas Vármegyei Pedagógiai Szakszolgálat Megyei Szakértői Bizottsága végzi a pedagógiai diagnosztikát és javaslatot tesz a fejlesztésekre.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">3</div>
              <h3 className="font-bold text-slate-900 text-lg">PontMás Alapítvány & AOSZ</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Hívjon minket, vagy vegyen részt Szülőklubunkon: sorstársi közösséget, tanácsokat és gyakorlati segítséget kap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Kapcsolatfelvételi CTA sáv */}
      <CtaBand
        title="Személyes vagy telefonos segítségre van szüksége?"
        text="Hívja Rumi Edinát a +36 20 969 8715 számon, vagy írjon nekünk üzenetet online űrlapunkon keresztül!"
      >
        <Button href="/kapcsolat" variant="primary">
          Kapcsolatfelvétel
        </Button>
      </CtaBand>
    </div>
  );
}

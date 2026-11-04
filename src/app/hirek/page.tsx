import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { NewsCard, NewsFeaturedCard } from "@/components/content/ContentCards";
import { getPublicContent } from "@/content/publicContent";
import { splitNews } from "@/content/public";

export const metadata: Metadata = {
  title: "Hírek & Aktualitások | PontMás Alapítvány",
  description: "A PontMás Alapítvány legfrissebb hírei, szülőklub meghívói, családi nap beszámolói és szakmai továbbképzései.",
  openGraph: {
    title: "Hírek & Aktualitások | PontMás Alapítvány",
    description: "Értesüljön a PontMás Alapítvány legújabb eseményeiről, programjairól és híreiről.",
    url: "https://pontmas.hu/hirek",
  },
};

// The items come from the editor's store (src/content), or from the seed when the store is empty
// or unreachable; the cards are shared with the editor's preview.
export const revalidate = 3600;

export default async function HirekPage() {
  const { content } = await getPublicContent();
  const { featured, rest } = splitNews(content.news);

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
      {featured && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <NewsFeaturedCard item={featured} />
        </section>
      )}

      {/* 3. További hírek és beszámolók */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          title="További híreink és beszámolóink"
          subtitle="Ismerje meg az alapítvány legfrissebb eseményeit és szakmai tevékenységeit."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rest.map((item) => (
            <NewsCard key={item.id} item={item} />
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

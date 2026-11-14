import type { Metadata } from "next";
import PageHeader from '@/components/ui/PageHeader';
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { NewsCard, NewsFeaturedCard } from "@/components/content/ContentCards";
import { getPublicContent } from "@/content/publicContent";
import { splitNews } from "@/content/public";
import CtaBand from '@/components/ui/CtaBand';

export const metadata: Metadata = {
  title: "Hírek és aktualitások | PontMás Alapítvány",
  description: "A PontMás Alapítvány legfrissebb hírei, szülőklub meghívói, családi nap beszámolói és szakmai továbbképzései.",
  openGraph: {
    title: "Hírek és aktualitások | PontMás Alapítvány",
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
    <div className="flex flex-col gap-16 pb-12 md:pb-20">
      {/* 1. Hero */}
      <PageHeader
        badge="Hírek, aktualitások és események"
        title="Közösségi élet, programok és szakmai hírek"
        subtitle="Kövesse figyelemmel a PontMás Alapítvány legfrissebb eseményeit, szülőklubjait, szakmai támogatási programjait és élménybeszámolóit!"
      />

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

        {/* Two columns from 768 px (Péter 15566): an even number of cards fills the rows; an odd last card is
            centred at the same width instead of standing alone at the left edge. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:[&>:last-child:nth-child(odd)]:col-span-2 md:[&>:last-child:nth-child(odd)]:justify-self-center md:[&>:last-child:nth-child(odd)]:w-[calc(50%-1rem)]">
          {rest.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* 4. Önkéntes toborzó felhívás */}
      <CtaBand
        title="Szeretne önkéntesként segíteni munkánkat?"
        text="Legyen szó rendezvényekről, gyermekfoglalkozásokról, szülőklubokról vagy online kommunikációról, minden segítő kéznek és jó szándéknak nagyon örülünk!"
        label="Csatlakozzon hozzánk"
      >
        <Button href="/kapcsolat?topic=onkentes" variant="primary">
          Jelentkezem Önkéntesnek
        </Button>
      </CtaBand>
    </div>
  );
}

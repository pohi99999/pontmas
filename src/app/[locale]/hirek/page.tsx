import type { Metadata } from "next";
import PageHeader from '@/components/ui/PageHeader';
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { NewsCard, NewsFeaturedCard } from "@/components/content/ContentCards";
import { getPublicContent } from "@/content/publicContent";
import { splitNews } from "@/content/public";
import CtaBand from '@/components/ui/CtaBand';
import { getTranslations } from 'next-intl/server';
import { alternatesFor, pageLocale, type PageParams } from '@/i18n/page';

const metadataBase: Metadata = {
  // title and description: <namespace>.meta in messages/<locale>.json
  openGraph: { url: "https://pontmas.hu/hirek" },
};

export const generateMetadata = alternatesFor('/hirek', metadataBase, 'News');

// The items come from the editor's store (src/content), or from the seed when the store is empty
// or unreachable; the cards are shared with the editor's preview.
export const revalidate = 3600;

export default async function HirekPage({ params }: PageParams) {
  await pageLocale(params);
  const t = await getTranslations('News');
  const { content } = await getPublicContent();
  const { featured, rest } = splitNews(content.news);

  return (
    <div className="flex flex-col gap-16 pb-12 md:pb-20">
      {/* 1. Hero */}
      <PageHeader
        badge={t('header.badge')}
        title={t('header.title')}
        subtitle={t('header.subtitle')}
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
          title={t('more.title')}
          subtitle={t('more.subtitle')}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rest.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* 4. Önkéntes toborzó felhívás */}
      <CtaBand
        title={t('cta.title')}
        text={t('cta.text')}
        label={t('cta.label')}
      >
        <Button href="/kapcsolat?topic=onkentes" variant="primary">
          {t('cta.button')}
        </Button>
      </CtaBand>
    </div>
  );
}

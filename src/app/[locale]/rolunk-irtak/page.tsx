import type { Metadata } from "next";
import { Link } from '@/i18n/navigation';
import PageHeader from '@/components/ui/PageHeader';
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { Newspaper, Quote, Tv, HeartHandshake, Calendar, Sparkles } from "lucide-react";
import CtaBand from '@/components/ui/CtaBand';
import { getTranslations } from 'next-intl/server';
import { alternatesFor, pageLocale, type PageParams } from '@/i18n/page';

const metadataBase: Metadata = {
  // title and description: <namespace>.meta in messages/<locale>.json
  openGraph: { url: "https://pontmas.hu/rolunk-irtak" },
};

export const generateMetadata = alternatesFor('/rolunk-irtak', metadataBase, 'Press');

export default async function RolunkIrtakPage({ params }: PageParams) {
  await pageLocale(params);
  const t = await getTranslations('Press');
  // type and icon stay in the code; the texts are in messages (Press.articles, same order)
  const kinds = [{ type: 'sajto', icon: Newspaper }, { type: 'koszonet', icon: Quote }, { type: 'sajto', icon: Tv }, { type: 'esemeny', icon: HeartHandshake }, { type: 'koszonet', icon: Quote }];
  const texts = t.raw('articles') as { badge: string; title: string; date: string; summary: string; quote: string; source: string }[];
  const articles = kinds.map((k, i) => ({ ...k, ...texts[i] }));

  return (
    <div className="flex flex-col gap-16 pb-12 md:pb-20">
      {/* 1. Hero */}
      <PageHeader
        badge={t('header.badge')}
        title={t('header.title')}
        subtitle={t('header.subtitle')}
      />

      {/* 2. Cikkek és köszönetnyilvánítások rácsa */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          title={t('list.title')}
          subtitle={t('list.subtitle')}
          align="center"
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
                    <span className="text-xs text-slate-600 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {item.date}
                    </span>
                  </div>

                  <h3 className="display text-xl text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
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
                  <span>{t('list.source', { source: item.source })}</span>
                  <Sparkles className="h-4 w-4 text-blue-400" />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 3. Kapcsolati felhívás sajtónak és szülőknek */}
      <CtaBand
        title={t('cta.title')}
        text={t('cta.text')}
      >
        <Button href="/kapcsolat" variant="primary">
          {t('cta.contact')}
        </Button>
        <Button href="/rolunk" variant="outline">
          {t('cta.about')}
        </Button>
      </CtaBand>
    </div>
  );
}

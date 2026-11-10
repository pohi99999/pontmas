import type { Metadata } from "next";
import { Link } from '@/i18n/navigation';
import PageHeader from '@/components/ui/PageHeader';
import SectionHeader from "@/components/ui/SectionHeader";
import FeatureCard from "@/components/ui/FeatureCard";
import ActionCard from "@/components/ui/ActionCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Users, Smartphone, BookOpen, School, CheckCircle2, ArrowRight, HeartHandshake } from "lucide-react";
import CtaBand from '@/components/ui/CtaBand';
import { FOUNDATION } from '@/lib/foundation';
import { getTranslations } from 'next-intl/server';
import { alternatesFor, pageLocale, type PageParams } from '@/i18n/page';

const metadataBase: Metadata = {
  // title and description: <namespace>.meta in messages/<locale>.json
  openGraph: { url: "https://pontmas.hu/segitseg" },
};

export const generateMetadata = alternatesFor('/segitseg', metadataBase, 'Help');

export default async function HelpPage({ params }: PageParams) {
  await pageLocale(params);
  const t = await getTranslations('Help');
  // icons and targets stay in the code; the texts are in messages (Help.services, same order)
  const serviceLinks = [
    { icon: Users, linkHref: '/kapcsolat?topic=mentorszuloi-tanacsadas' },
    { icon: Smartphone, linkHref: '/kapcsolat?topic=data-applikacio' },
    { icon: BookOpen, linkHref: '/kapcsolat?topic=szakkonyvtar' },
    { icon: School, linkHref: '/kapcsolat?topic=intezmenyi-tanacsadas' },
    { icon: HeartHandshake, linkHref: '/hirek' },
  ];
  const texts = t.raw('services') as { badge: string; title: string; description: string; bullets: string[]; linkText: string }[];
  const services = serviceLinks.map((l, i) => ({ ...l, ...texts[i] }));
  const steps = t.raw('steps.items') as { title: string; text: string }[];

  return (
    <div className="flex flex-col gap-16 pb-12 md:pb-20">
      {/* 1. Hero szekció */}
      <PageHeader
        badge={t('header.badge')}
        title={t('header.title')}
        subtitle={t('header.subtitle')}
      >
        <div className="flex flex-wrap gap-4">
          <Button href="#szolgaltatasok" variant="primary">
            {t('header.services')}
          </Button>
          <Button href="/kapcsolat" variant="outline">
            {t('header.ask')}
          </Button>
        </div>
      </PageHeader>

      {/* 2. Szolgáltatások részletesen */}
      <section id="szolgaltatasok" className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          title={t('servicesSection.title')}
          subtitle={t('servicesSection.subtitle')}
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
            title={t('steps.title')}
            subtitle={t('steps.subtitle')}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">1</div>
              <h3 className="font-bold text-slate-900 text-lg">{steps[0].title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {steps[0].text}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">2</div>
              <h3 className="font-bold text-slate-900 text-lg">{steps[1].title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {steps[1].text}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">3</div>
              <h3 className="font-bold text-slate-900 text-lg">{steps[2].title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {steps[2].text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Kapcsolatfelvételi CTA sáv */}
      <CtaBand
        title={t('cta.title')}
        text={t('cta.text', { phone: FOUNDATION.phone })}
      >
        <Button href="/kapcsolat" variant="primary">
          {t('cta.button')}
        </Button>
      </CtaBand>
    </div>
  );
}

import { Link } from '@/i18n/navigation';
import { Heart, Users, HandHeart, School, HelpCircle, ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import FeatureCard from '@/components/ui/FeatureCard';
import Button from '@/components/ui/Button';
import CopyButton from '@/components/ui/CopyButton';
import PontJel from '@/components/brand/PontJel';
import CtaBand from '@/components/ui/CtaBand';
import { FOUNDATION } from '@/lib/foundation';
import { getTranslations } from 'next-intl/server';
import { alternatesFor, pageLocale, type PageParams } from '@/i18n/page';

export const generateMetadata = alternatesFor('/');

export default async function Home({ params }: PageParams) {
  await pageLocale(params);
  const t = await getTranslations('Home');
  const stats = t.raw('stats') as { value: string; label: string }[];

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-20">
      
      {/* 1. Hero: the logo's sphere is the picture. A photo goes into the sphere once the foundation sends one. */}
      <section className="border-b border-slate-200/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-10 md:pb-14">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-6 items-center">
            <div className="lg:col-span-7 min-w-0">
              <p className="eyebrow mb-6">
                <span className="pont" aria-hidden="true" />
                {FOUNDATION.name}
              </p>
              <h1 className="text-[2.75rem] leading-[1.08] sm:text-6xl lg:text-[3.25rem] xl:text-[4.25rem] text-slate-900 mb-7">
                {t.rich('heroTitle', {
                  br: () => <br className="hidden sm:inline" />,
                  accent: (chunks) => <span className="text-blue-700">{chunks}</span>,
                })}
              </h1>
              <p className="max-w-xl text-lg sm:text-xl text-slate-600 leading-relaxed mb-9">
                {t('heroText')}
              </p>
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4 [&>*]:whitespace-nowrap">
                <Button href="/tamogatas" size="lg" variant="primary" leftIcon={<Heart size={20} className="fill-white/30" />}>
                  {t('ctaSupport')}
                </Button>
                <Button href="/autizmus" size="lg" variant="outline" leftIcon={<HelpCircle size={20} className="text-blue-600" />}>
                  {t('ctaAutism')}
                </Button>
              </div>
            </div>
            <div className="lg:col-span-5 min-w-0">
              <div className="relative mx-auto max-w-[300px] sm:max-w-[380px] lg:max-w-[480px]" aria-hidden="true">
                <span className="lufi z-10" style={{ width: '10%', aspectRatio: '1', left: '58%', top: '13%' }} />
                <span className="lufi z-10" style={{ width: '5.5%', aspectRatio: '1', left: '45%', top: '21%' }} />
                <span className="lufi z-10" style={{ width: '3.6%', aspectRatio: '1', left: '74%', top: '20%' }} />
                <PontJel />
              </div>
            </div>
          </div>

          {/* The facts in one row */}
          <dl className="mt-12 md:mt-16 grid sm:grid-cols-3 gap-6 sm:gap-10 border-t border-slate-200 pt-8">
            {stats.map((stat) => (
              <div key={stat.value}>
                <dt className="display text-3xl md:text-4xl text-slate-900">{stat.value}</dt>
                <dd className="text-[15px] text-slate-600 mt-1">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 3. Fő Tevékenységek & Pillérek */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid xl:grid-cols-12 gap-x-10">
        <div className="xl:col-span-5 min-w-0">
        <SectionHeader
          align="left"
          className="xl:sticky xl:top-28"
          badge={t('mission.badge')}
          title={t('mission.title')}
          subtitle={t('mission.subtitle')}
        />

        </div>
        <div className="xl:col-span-7 min-w-0 grid sm:grid-cols-2 gap-x-10 gap-y-12">
          <FeatureCard
            icon={<Users size={28} />}
            title={t('pillars.community.title')}
            description={t('pillars.community.text')}
            linkHref="/programok"
            linkLabel={t('pillars.community.link')}
          />

          <FeatureCard
            icon={<HelpCircle size={28} />}
            title={t('pillars.awareness.title')}
            description={t('pillars.awareness.text')}
            linkHref="/autizmus"
            linkLabel={t('pillars.awareness.link')}
          />

          <FeatureCard
            icon={<School size={28} />}
            title={t('pillars.institutions.title')}
            description={t('pillars.institutions.text')}
            linkHref="/programok"
            linkLabel={t('pillars.institutions.link')}
          />

          <FeatureCard
            icon={<HandHeart size={28} />}
            title={t('pillars.crisis.title')}
            description={t('pillars.crisis.text')}
            linkHref="/tamogatas"
            linkLabel={t('pillars.crisis.link')}
          />
        </div>
        </div>
      </section>

      {/* 4. Donation: a full-width deep blue band, the tax and bank numbers in one row */}
      <section className="bg-blue-950 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-4xl">
            <p className="eyebrow mb-5" style={{ color: '#c9d5ec' }}>
              <span className="pont" aria-hidden="true" />
              {t('donation.eyebrow')}
            </p>
            <h2 className="text-4xl sm:text-5xl text-white leading-[1.1] mb-6">
              {t('donation.title')}
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed max-w-2xl mb-8">
              {t('donation.text')}
            </p>
            <Link
              href="/tamogatas"
              className="inline-flex items-center text-sm font-semibold text-blue-100 underline decoration-blue-400 underline-offset-4 hover:text-white transition-colors"
            >
              <span>{t('donation.more')}</span>
              <ArrowRight size={16} className="ml-1.5" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-6 mt-10 text-slate-900">
            <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-2 mb-4">
              {t('donation.dataTitle')}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <CopyButton
                textToCopy={FOUNDATION.taxNumber}
                label={t('donation.taxLabel')}
                sublabel={t('donation.taxSub')}
              />
              <CopyButton
                textToCopy={FOUNDATION.bankAccount}
                label={t('donation.bankLabel', { bank: FOUNDATION.bankName })}
                sublabel={t('donation.bankSub')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Kapcsolatfelvétel hívószó */}
      <CtaBand
        title={t('cta.title')}
        text={t('cta.text')}
      >
        <Button href="/kapcsolat" variant="primary">
          {t('cta.button')}
        </Button>
      </CtaBand>

    </div>
  );
}

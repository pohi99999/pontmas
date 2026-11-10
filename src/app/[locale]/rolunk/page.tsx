import { Target, Award, Users, ShieldCheck, Heart, CheckCircle2, Building2 } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import CtaBand from '@/components/ui/CtaBand';
import { CommunityGallery } from '@/components/content/Gallery';
import { FOUNDATION, ADDRESS_LINE } from '@/lib/foundation';
import { getTranslations } from 'next-intl/server';
import { alternatesFor, pageLocale, type PageParams } from '@/i18n/page';

export const generateMetadata = alternatesFor('/rolunk');

export default async function RolunkPage({ params }: PageParams) {
  await pageLocale(params);
  const t = await getTranslations('About');
  // icons stay in the code; the texts are in messages (About.values.items, same order)
  const valueIcons = [Target, Users, Award, Heart];
  const alapelvek = (t.raw('values.items') as { title: string; desc: string }[]).map((v, i) => {
    const Icon = valueIcons[i];
    return { ...v, icon: <Icon className="text-blue-600" size={26} /> };
  });
  const merfoldkovek = t.raw('milestones.items') as { ev: string; cim: string; leiras: string }[];

  return (
    <div className="pb-20">
      
      {/* 1. Fejléc szekció */}
      <PageHeader
        badge={t('header.badge')}
        title={t('header.title')}
        subtitle={t('header.subtitle')}
      />

      {/* 2. Történetünk és Elnökség szekció */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
          
          {/* Szöveges tartalom */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('story.title')}
            </h2>
            
            <p className="text-slate-600 leading-relaxed text-base">
              {t('story.p1')}
            </p>
            
            <p className="text-slate-600 leading-relaxed text-base">
              {t('story.p2')}
            </p>

            {/* Elnökség & AOSZ Kiemelés */}
            <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-6 shadow-2xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-950">{t('story.nationalTitle')}</h3>
                  <p className="text-xs text-blue-700 font-semibold">{t('story.aosz')}</p>
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed pt-1">
                {t.rich('story.board', { b: (chunks) => <strong>{chunks}</strong> })}
              </p>
            </div>
          </div>

          {/* Hitelességi kártya */}
          <div className="lg:col-span-5 bg-blue-950 text-white rounded-3xl p-8 shadow-xl border border-slate-800 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">{t('facts.title')}</h3>
                <span className="text-xs text-slate-400">{t('facts.org')}</span>
              </div>
            </div>

            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-slate-300"><strong className="text-white">{t('facts.registeredLabel')}</strong> {t('facts.registered')}</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-slate-300"><strong className="text-white">{t('facts.taxLabel')}</strong> {FOUNDATION.taxNumber}</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-slate-300"><strong className="text-white">{t('facts.activityLabel')}</strong> {t('facts.activity')}</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-slate-300"><strong className="text-white">{t('facts.seatLabel')}</strong> {ADDRESS_LINE}</span>
              </li>
            </ul>

            <div className="pt-2">
              <Button href="/tamogatas" variant="primary" size="md" fullWidth>
                {t('facts.support')}
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Értékeink Grid */}
      <section className="bg-white border-y border-slate-200/80 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <SectionHeader
            badge={t('values.badge')}
            title={t('values.title')}
            subtitle={t('values.subtitle')}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {alapelvek.map((elv, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex flex-col">
                <div className="mb-4 bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-xs border border-slate-100">
                  {elv.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{elv.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed flex-grow">{elv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Mérföldkövek / Idővonal */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-5xl">
        <SectionHeader
          badge={t('milestones.badge')}
          title={t('milestones.title')}
          subtitle={t('milestones.subtitle')}
        />

        <div className="grid md:grid-cols-3 gap-6">
          {merfoldkovek.map((m, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="display text-4xl text-blue-700 mb-2 block">{m.ev}</span>
              <h3 className="font-bold text-slate-900 text-base mb-2">{m.cim}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{m.leiras}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Képek a közösségről */}
      <CommunityGallery />

      {/* 5. Csatlakozás és Kapcsolat CTA */}
      <CtaBand
        title={t('cta.title')}
        text={t('cta.text')}
        headingLevel="h2"
      >
        <Button href="/kapcsolat" variant="primary">
          {t('cta.contact')}
        </Button>
        <Button href="/tamogatas" variant="outline">
          {t('cta.support')}
        </Button>
      </CtaBand>

    </div>
  );
}

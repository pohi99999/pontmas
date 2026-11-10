import { GraduationCap } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import ProgramFilter from '@/components/content/ProgramFilter';
import Gallery from '@/components/content/Gallery';
import { getPublicContent } from '@/content/publicContent';
import { visiblePrograms } from '@/content/public';
import CtaBand from '@/components/ui/CtaBand';
import { getTranslations } from 'next-intl/server';
import { alternatesFor, pageLocale, type PageParams } from '@/i18n/page';

// A server page now, so it can read the editor's store (or the seed); only the category filter
// runs in the browser (ProgramFilter).
export const revalidate = 3600;

export const generateMetadata = alternatesFor('/programok');

export default async function ProgramokPage({ params }: PageParams) {
  await pageLocale(params);
  const { content } = await getPublicContent();
  const programok = visiblePrograms(content.programs);
  const t = await getTranslations('Programs');
  const tamogatottIntezmenyek = t.raw('institutions') as { nev: string; reszlet: string }[];

  return (
    <div className="pb-20">
      
      {/* 1. Fejléc szekció */}
      <PageHeader
        badge={t('header.badge')}
        title={t('header.title')}
        subtitle={t('header.subtitle')}
      />

      {/* 2. Programok és Események Kategóriaválasztóval */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <ProgramFilter programs={programok} />

      </section>

      {/* Képek a programokról */}
      <Gallery />

      {/* 3. Intézményi Támogatások Modul */}
      <section className="bg-gradient-to-b from-slate-100/80 to-slate-50 border-y border-slate-200/80 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <SectionHeader
            badge={t('support.badge')}
            title={t('support.title')}
            subtitle={t('support.subtitle')}
          />

          <div className="grid md:grid-cols-2 gap-6">
            {tamogatottIntezmenyek.map((intezmeny, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{intezmeny.nev}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{intezmeny.reszlet}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-3xl mx-auto space-y-4 shadow-sm">
            <h3 className="display text-xl text-slate-900">
              {t('support.askTitle')}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xl mx-auto">
              {t('support.askText')}
            </p>
            <div className="pt-2">
              <Button href="/kapcsolat" variant="primary" size="md">
                {t('support.askButton')}
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Támogatási felhívás */}
      <CtaBand
        title={t('cta.title')}
        text={t('cta.text')}
        headingLevel="h2"
      >
        <Button href="/tamogatas" variant="primary">
          {t('cta.button')}
        </Button>
      </CtaBand>

    </div>
  );
}

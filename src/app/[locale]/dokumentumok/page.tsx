import type { Metadata } from "next";
import { Link } from '@/i18n/navigation';
import { FileText, CheckCircle2 } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import SectionHeader from '@/components/ui/SectionHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import DocAvailability from '@/components/ui/DocAvailability';
import CtaBand from '@/components/ui/CtaBand';
import { FOUNDATION } from '@/lib/foundation';
import { getTranslations } from 'next-intl/server';
import { alternatesFor, pageLocale, type PageParams } from '@/i18n/page';

const metadataBase: Metadata = {
  // title and description: <namespace>.meta in messages/<locale>.json
  openGraph: { url: "https://pontmas.hu/dokumentumok" },
};

export const generateMetadata = alternatesFor('/dokumentumok', metadataBase, 'Documents');

export default async function DokumentumokPage({ params }: PageParams) {
  await pageLocale(params);
  const t = await getTranslations('Documents');
  // raw strings (no ICU parsing); the registration number from foundation.ts; the link target in code
  const docLinks: (string | undefined)[] = [undefined, '/adatkezeles', undefined, undefined];
  const officialDocs = (t.raw('docs') as { title: string; category: string; date: string; description: string }[]).map((d, i) => ({
    ...d,
    date: d.date.replace('{registrationNumber}', FOUNDATION.registrationNumber),
    href: docLinks[i],
  }));
  const grantProjects = t.raw('grants') as { title: string; badge: string; grantAmount: string; description: string; details: string[] }[];

  return (
    <div className="flex flex-col gap-16 pb-12 md:pb-20">
      {/* 1. Fejléc */}
      <PageHeader
        badge={t('header.badge')}
        title={t('header.title')}
        subtitle={t('header.subtitle')}
      />

      {/* 2. Hivatalos Iratok & Beszámolók */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          title={t('official.title')}
          subtitle={t('official.subtitle')}
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
                  <span className="text-xs text-slate-600">{doc.date}</span>
                </div>

                <h3 className="display text-xl text-slate-900 group-hover:text-blue-700 transition-colors">
                  {doc.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {doc.description}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                {doc.href ? (
                  <>
                    <span className="text-xs text-slate-500 font-medium">{t('official.onSite')}</span>
                    <Link href={doc.href} className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
                      {t('official.open')}
                    </Link>
                  </>
                ) : (
                  <>
                    <span className="text-xs text-slate-500 font-medium">{t('official.pdf')}</span>
                    <DocAvailability />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Pályázatok és Önkormányzati Támogatások */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          title={t('grantSection.title')}
          subtitle={t('grantSection.subtitle')}
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

                <h3 className="display text-xl text-slate-900">
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

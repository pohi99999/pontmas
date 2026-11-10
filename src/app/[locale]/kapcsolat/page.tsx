import { MapPin, Phone, MessageSquare, ExternalLink } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import SectionHeader from '@/components/ui/SectionHeader';
import ContactForm from '@/components/forms/ContactForm';
import { FOUNDATION, ADDRESS_LINE, PHONE_HREF } from '@/lib/foundation';
import { getTranslations } from 'next-intl/server';
import { alternatesFor, pageLocale, type PageParams } from '@/i18n/page';

export const generateMetadata = alternatesFor('/kapcsolat');

export default async function KapcsolatPage({ params }: PageParams) {
  await pageLocale(params);
  const t = await getTranslations('Contact');
  return (
    <div className="pb-20">
      
      {/* 1. Fejléc szekció */}
      <PageHeader
        badge={t('header.badge')}
        title={t('header.title')}
        subtitle={t('header.subtitle')}
      />

      {/* 2. Kapcsolati és Irodai Információk + Form */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12">
          
          {/* Bal oszlop: Elérhetőségek */}
          <div className="lg:col-span-5 space-y-8 lg:self-start lg:sticky lg:top-28">
            
            {/* Közvetlen elérhetőségek */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base">{t('seat')}</h2>
                  <p className="text-slate-600 text-sm mt-0.5">{ADDRESS_LINE}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base">{t('person')}</h2>
                  <p className="text-slate-600 text-sm mt-0.5">{FOUNDATION.contactPerson}</p>
                  <a href={PHONE_HREF} className="text-blue-600 hover:text-blue-800 font-semibold text-sm mt-0.5 block">
                    {FOUNDATION.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base">{t('group')}</h2>
                  <a 
                    href="https://www.facebook.com/groups/1622445488007296/?locale=hu_HU" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm mt-0.5 inline-flex items-center gap-1"
                  >
                    <span>{t('facebook')}</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Jobb oszlop: Kapcsolati űrlap */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>
      </section>

    </div>
  );
}

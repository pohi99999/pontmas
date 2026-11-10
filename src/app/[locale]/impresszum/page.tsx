import type { Metadata } from "next";
import { Link } from '@/i18n/navigation';
import PageHeader from '@/components/ui/PageHeader';
import { DraftBanner, DraftSources, LegalLanguageNote, Review, Section } from '@/components/legal/LegalParts';
import { FOUNDATION } from '@/lib/foundation';
import { LEGAL_DRAFT } from '@/lib/legal';
import { getTranslations } from 'next-intl/server';
import { alternatesFor, pageLocale, type PageParams } from '@/i18n/page';

// Impresszum, DRAFT (src/lib/legal.ts): the service provider's data a website has to show
// (2001. évi CVIII. törvény 4. §, to be confirmed in the legal review).

const metadataBase: Metadata = {
  // title and description: <namespace>.meta in messages/<locale>.json
  robots: LEGAL_DRAFT ? { index: false, follow: false } : undefined,
};

export const generateMetadata = alternatesFor('/impresszum', metadataBase, 'Imprint');

export default async function ImpresszumPage({ params }: PageParams) {
  const locale = await pageLocale(params);
  const t = await getTranslations('Imprint');
  return (
    <>
      <PageHeader badge={t('header.badge')} title={t('header.title')} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <LegalLanguageNote />
        <article className="mx-auto max-w-3xl" lang={locale === 'hu' ? undefined : 'hu'}>
          <DraftBanner />

          <Section id="uzemelteto" title="A weboldal üzemeltetője">
            <ul className="space-y-1">
              <li><strong>Név:</strong> {FOUNDATION.name}</li>
              <li><strong>Székhely:</strong> {FOUNDATION.registeredSeat}</li>
              <li>
                <strong>Nyilvántartási szám:</strong> ellenőrzés alatt
                <Review kind="kerdes">
                  Hivatalos forrásból még nem ellenőrzött. Az alapítvány 2024-es szabályzata 18-01-0000323-at ír, a weboldal eddig
                  {FOUNDATION.registrationNumber}-t. A közhiteles adat a bíróság civil névjegyzékében van (civilsznev.birosag.hu,
                  keresés adószámra); a keresés captcha mögött van, ezért ember végzi el.
                </Review>
              </li>
              <li><strong>Nyilvántartó bíróság:</strong> <Review kind="kerdes">a nyilvántartó törvényszék neve</Review></li>
              <li><strong>Adószám:</strong> {FOUNDATION.taxNumber}</li>
              <li>
                <strong>Képviselő:</strong> {/* Péter's confirmation, 2026-11-10 (Telegram 14695) */}
                Pohánka Edit, a kuratórium elnöke
              </li>
              <li><strong>Telefon:</strong> {FOUNDATION.phone} ({FOUNDATION.contactPerson})</li>
              <li>
                <strong>E-mail:</strong>
                <Review kind="jogi">
                  Az impresszumban kötelező-e e-mail-cím? Ha igen, melyik (a pontmas.hu-s cím mögött még nincs postafiók)?
                </Review>
              </li>
            </ul>
          </Section>

          <Section id="tarhely" title="Tárhelyszolgáltató">
            {/* measured: the Vercel project "pontmas" serves the site */}
            <ul className="space-y-1">
              <li><strong>Név:</strong> Vercel Inc.</li>
              <li><strong>Cím:</strong> <Review kind="kerdes">a Vercel hivatalos címe</Review></li>
              <li><strong>Elérhetőség:</strong> <Review kind="kerdes">a Vercel e-mail-címe vagy webes elérhetősége</Review></li>
            </ul>
          </Section>

          <Section id="adatvedelem" title="Adatvédelem">
            <p>
              A személyes adatok kezeléséről az <Link href="/adatkezeles" className="underline">adatkezelési tájékoztató</Link> szól.
            </p>
          </Section>

          <DraftSources />
        </article>
      </div>
    </>
  );
}

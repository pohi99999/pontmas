import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from '@/components/ui/PageHeader';
import { DraftBanner, DraftSources, Review, Section } from '@/components/legal/LegalParts';
import { ADDRESS_LINE, FOUNDATION } from '@/lib/foundation';
import { LEGAL_DRAFT } from '@/lib/legal';

// Impresszum, DRAFT (src/lib/legal.ts): the service provider's data a website has to show
// (2001. évi CVIII. törvény 4. §, to be confirmed in the legal review).

export const metadata: Metadata = {
  title: "Impresszum | PontMás Alapítvány",
  description: "A pontmas.hu weboldal üzemeltetőjének és tárhelyszolgáltatójának adatai.",
  robots: LEGAL_DRAFT ? { index: false, follow: false } : undefined,
};

export default function ImpresszumPage() {
  return (
    <>
      <PageHeader badge="Jogi adatok" title="Impresszum" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <article className="mx-auto max-w-3xl">
          <DraftBanner />

          <Section id="uzemelteto" title="A weboldal üzemeltetője">
            <ul className="space-y-1">
              <li><strong>Név:</strong> {FOUNDATION.name}</li>
              <li><strong>Székhely:</strong> {ADDRESS_LINE}</li>
              <li>
                <strong>Nyilvántartási szám:</strong> {FOUNDATION.registrationNumber}
                <Review kind="kerdes">A 2024-es szabályzat 18-01-0000323-at ír; melyik a helyes (lásd az adatkezelési tájékoztatót)?</Review>
              </li>
              <li><strong>Nyilvántartó bíróság:</strong> <Review kind="kerdes">a nyilvántartó törvényszék neve</Review></li>
              <li><strong>Adószám:</strong> {FOUNDATION.taxNumber}</li>
              <li><strong>Képviselő:</strong> <Review kind="kerdes">a kuratórium elnökének neve</Review></li>
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

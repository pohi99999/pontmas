import type { Metadata } from 'next';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import { FOUNDATION, PHONE_HREF } from '@/lib/foundation';

// The page for an address that does not exist. Until 2026-11-18 a mistyped address showed the
// framework's English default ("This page could not be found.") with no way on in the content.
// The same page start as every subpage (PageHeader), so it does not look like a breakdown.
export const metadata: Metadata = {
  title: 'Az oldal nem található | PontMás Alapítvány',
};

export default function NotFound() {
  return (
    <div className="flex flex-col gap-12 pb-12 md:pb-20">
      <PageHeader
        badge="404: az oldal nem található"
        title="Ezt az oldalt nem találjuk"
        subtitle="Lehet, hogy elírás került a címbe, vagy az oldal már máshol található. Az alábbi gombokkal továbbléphet."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button href="/" variant="primary">Vissza a kezdőlapra</Button>
          <Button href="/segitseg" variant="outline">Amiben segíteni tudunk</Button>
          <Button href="/kapcsolat" variant="outline">Kapcsolat</Button>
        </div>
      </PageHeader>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* a second-level heading: the footer's headings are third-level, and a page may not skip a level */}
        <h2 className="text-2xl md:text-3xl text-slate-900">Telefonon is elérhet minket</h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-700">
          {FOUNDATION.contactPerson},{' '}
          <a href={PHONE_HREF} className="inline-flex min-h-11 items-center font-semibold text-blue-700 underline-offset-4 hover:text-blue-900 hover:underline">
            {FOUNDATION.phone}
          </a>
          .
        </p>
      </section>
    </div>
  );
}

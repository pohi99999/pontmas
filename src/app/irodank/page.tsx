import type { Metadata } from "next";
import Image from 'next/image';
import { Clock, MapPin, Phone } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { FOUNDATION, PHONE_HREF } from '@/lib/foundation';
import { IRODA_CIM, IRODANK } from '@/content/irodank';
import { CSAPAT } from '@/content/csapat';

// The office (Edina 2026-11-13, Péter 15487). Her text word for word (src/content/irodank.ts); this page adds
// only the title and the "Címünk" label.
export const metadata: Metadata = {
  title: "Irodánk | PontMás Alapítvány",
  description: "Személyes ügyfélfogadás Szombathelyen, a Sugár út 9. 3. emeletén: kedden 9.00-13.00, pénteken 9.00-12.00.",
  openGraph: {
    title: "Irodánk | PontMás Alapítvány",
    description: "Személyes ügyfélfogadás Szombathelyen, a Sugár út 9. 3. emeletén.",
    url: "https://pontmas.hu/irodank",
  },
};

// Edina's portrait (Edina 2026-11-14 14:33: "Az irodánk fülhöz is ke lehet tenni a fotómat"; Péter 15558), the same
// approved file and name as on /rolunk, taken from src/content/csapat.ts so the two never drift apart.
const EDINA = CSAPAT.find((t) => t.nev === 'Rumi Edina');

export default function IrodankPage() {
  return (
    <div className="flex flex-col gap-16 pb-12 md:pb-20">
      <PageHeader badge="Személyes ügyfélfogadás" title="Irodánk" subtitle={IRODANK.bevezeto} />

      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7 min-w-0 space-y-5 text-lg leading-relaxed text-slate-700">
            <p>{IRODANK.hely}</p>
            <p>{IRODANK.bovites}</p>
            {EDINA?.foto && (
              <figure className="flex items-center gap-5 pt-2">
                <div className="relative aspect-[4/5] w-32 sm:w-40 flex-shrink-0 overflow-hidden rounded-2xl bg-blue-50 border border-slate-200/80">
                  <Image src={EDINA.foto} alt={EDINA.nev} fill sizes="160px" className="foto object-cover" />
                </div>
                <figcaption className="text-base leading-snug">
                  <span className="block font-bold text-slate-900">{EDINA.nev}</span>
                  <span className="block text-slate-600">{EDINA.szerep}</span>
                </figcaption>
              </figure>
            )}
          </div>

          <aside className="lg:col-span-5 min-w-0 self-start rounded-3xl border border-blue-200/80 bg-blue-50/80 p-6 md:p-8 space-y-6">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-blue-700" aria-hidden="true" />
              <div>
                <h2 className="text-base font-bold text-slate-900">Címünk</h2>
                <p className="text-slate-700">{IRODA_CIM}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="mt-1 h-5 w-5 flex-shrink-0 text-blue-700" aria-hidden="true" />
              <div className="min-w-0">
                <h2 className="text-base font-bold text-slate-900">{IRODANK.fogadasCim}</h2>
                <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-slate-700">
                  {IRODANK.fogadas.map((f) => (
                    <div key={f.nap} className="contents">
                      <dt>{`${f.nap}:`}</dt>
                      <dd className="font-semibold text-slate-900">{f.ido}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">{IRODANK.egyeztetes}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-blue-700" aria-hidden="true" />
              <div>
                <h2 className="text-base font-bold text-slate-900">{IRODANK.elerhetosegCim}</h2>
                <p className="text-slate-700">
                  Telefon:{' '}
                  <a href={PHONE_HREF} className="font-semibold text-blue-700 hover:text-blue-900 whitespace-nowrap">{FOUNDATION.phone}</a>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

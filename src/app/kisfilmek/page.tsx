import type { Metadata } from "next";
import { ExternalLink } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { buttonClasses } from '@/components/ui/buttonClasses';
import Kisfilm from '@/components/content/Kisfilm';
import { KISFILMEK, SZULOI_SOROZAT, SZULOI_SOROZAT_LISTA, YOUTUBE_CSATORNA } from '@/content/kisfilmek';

// The foundation's short films (Edina 2026-11-13, Péter 15469). The text about the series is Edina's, word for
// word (src/content/kisfilmek.ts); this page only adds headings and the note on how the players load.
export const metadata: Metadata = {
  title: "Kisfilmek | PontMás Alapítvány",
  description: "Az alapítvány háromrészes szülői kisfilmsorozata az autizmusról, a SZÜLŐ2025 pályázat keretében.",
  openGraph: {
    title: "Kisfilmek | PontMás Alapítvány",
    description: "Autizmus – Szülői kisfilmsorozat, három részben.",
    url: "https://pontmas.hu/kisfilmek",
  },
};

export default function KisfilmekPage() {
  return (
    <div className="flex flex-col gap-16 pb-12 md:pb-20">
      <PageHeader badge="Autizmus – Szülői kisfilmsorozat" title="Kisfilmek" subtitle={SZULOI_SOROZAT.cel} />

      <section className="container mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="filmek-cim">
        <h2 id="filmek-cim" className="sr-only">A kisfilmek</h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {KISFILMEK.map((film) => (
            <Kisfilm key={film.youtubeId} film={film} />
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <a href={SZULOI_SOROZAT_LISTA} target="_blank" rel="noopener noreferrer" className={buttonClasses({ variant: 'primary', size: 'md' })}>
            <span>A lejátszási lista a YouTube-on</span>
            <ExternalLink size={16} aria-hidden="true" />
          </a>
          <a href={YOUTUBE_CSATORNA} target="_blank" rel="noopener noreferrer" className={buttonClasses({ variant: 'outline', size: 'md' })}>
            <span>Az alapítvány YouTube-csatornája</span>
            <ExternalLink size={16} aria-hidden="true" />
          </a>
        </div>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-slate-600">
          A videók csak a lejátszás gombra kattintva töltődnek be a YouTube-ról (youtube-nocookie.com); addig az oldal nem kapcsolódik a YouTube-hoz.
        </p>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7 min-w-0">
            <h2 className="text-3xl md:text-[2.75rem] text-slate-900 leading-[1.1] mb-8">A sorozatról</h2>
            <div className="space-y-5 text-base leading-relaxed text-slate-700">
              <p>{SZULOI_SOROZAT.tartalom}</p>
              <div>
                <p className="font-bold text-slate-900">{SZULOI_SOROZAT.reszekCim}</p>
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  {SZULOI_SOROZAT.reszek.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
              <p>{SZULOI_SOROZAT.elony}</p>
            </div>
          </div>
          <aside className="lg:col-span-5 min-w-0 self-start rounded-3xl border border-blue-200/80 bg-blue-50/80 p-6 md:p-8">
            <h2 className="display text-xl text-blue-950">A pályázatról</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{SZULOI_SOROZAT.palyazat}</p>
          </aside>
        </div>
      </section>
    </div>
  );
}

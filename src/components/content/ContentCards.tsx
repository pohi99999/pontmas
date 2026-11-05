// The cards of /hirek and /programok. The public pages and the editor's preview both render these,
// so the preview shows exactly what will be live. The markup is the one the pages had on main;
// the only additions are the optional image and hiding a block whose field is empty.
import Link from 'next/link';
import { ArrowRight, Calendar, CheckCircle2, ExternalLink, GraduationCap, MapPin } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { publicImage } from '@/content/public';
import type { ContentImage, NewsItem, ProgramItem } from '@/content/types';

/** Shown only with the child photo declaration (publicImage); a draft image renders nothing. */
export function ContentImageView({ image, className = '' }: { image?: ContentImage; className?: string }) {
  const img = publicImage(image);
  if (!img) return null;
  return (
    // A plain <img> on purpose: the files are already resized in the editor, and next/image remote
    // optimisation would need extra configuration and cost.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={img.url}
      alt={img.alt}
      width={img.width}
      height={img.height}
      loading="lazy"
      decoding="async"
      className={`foto w-full aspect-[4/3] rounded-2xl bg-slate-100 object-cover ${className}`.trim()}
    />
  );
}

/** The large banner of /hirek (on main: newsItems[0]). */
export function NewsFeaturedCard({ item }: { item: NewsItem }) {
  return (
    <div className="rounded-[2.5rem] bg-blue-50 p-6 sm:p-8 md:p-12 space-y-6">
      <ContentImageView image={item.image} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Badge variant="info">
          Legközelebbi Szülőklub
        </Badge>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 bg-blue-100/80 px-3 py-1.5 rounded-full">
          <Calendar className="h-4 w-4" />
          <span>{item.date}</span>
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
        {item.title}
      </h2>

      {(item.location || item.speaker) && (
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-700 bg-white/80 p-5 rounded-2xl border border-blue-100">
          {item.location && (
            <div className="flex items-start gap-2.5">
              <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-900">Helyszín:</span>
                <span>{item.location}</span>
              </div>
            </div>
          )}
          {item.speaker && (
            <div className="flex items-start gap-2.5">
              <GraduationCap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-900">Előadó:</span>
                <span>{item.speaker}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <p className="text-base text-slate-700 leading-relaxed">
        {item.description}
      </p>

      {item.highlights.length > 0 && (
        <div className="space-y-2 border-t border-blue-100 pt-4">
          <h3 className="font-bold text-slate-900 text-sm">Főbb témák és program:</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            {item.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-100">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(item.actionHref || item.googleFormHref) && (
        <div className="flex flex-wrap items-center gap-4 pt-4">
          {item.actionHref && (
            <Button
              href={item.actionHref}
              variant="primary"
              size="lg"
              className="bg-blue-700 hover:bg-blue-800"
            >
              {item.actionText}
            </Button>
          )}
          {item.googleFormHref && (
            <a
              href={item.googleFormHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 px-4 py-2.5 rounded-xl border border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <span>Google Űrlap megnyitása</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/** One card of "További híreink és beszámolóink" (on main: newsItems.slice(1)). */
export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article
      className="flex flex-col justify-between rounded-[2rem] border border-slate-200 bg-white p-7"
    >
      <div className="space-y-4">
        <ContentImageView image={item.image} />
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
            {item.badge}
          </span>
          <span className="text-xs text-slate-600 font-mono">
            {item.date}
          </span>
        </div>

        <h3 className="display text-2xl text-slate-900 leading-snug">
          {item.title}
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed">
          {item.description}
        </p>

        {item.highlights.length > 0 && (
          <div className="border-t border-slate-100 pt-3 space-y-2">
            {item.highlights.map((h, hIdx) => (
              <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {item.actionHref && (
        <div className="pt-6 mt-4 border-t border-slate-100">
          <Link
            href={item.actionHref}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>{item.actionText}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </article>
  );
}

/** One card of the program list on /programok. */
export function ProgramCard({ program }: { program: ProgramItem }) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden md:flex">
      {publicImage(program.image) && (
        <div className="flex-none md:w-5/12">
          <ContentImageView image={program.image} className="!rounded-none md:h-full md:!aspect-auto" />
        </div>
      )}
      <div className="min-w-0 flex-1 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mb-2 inline-block">
            {program.badge}
          </span>
          <h2 className="text-3xl text-slate-900">
            {program.title}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Calendar size={14} className="text-blue-600" />
            <span>{program.date}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <MapPin size={14} className="text-slate-400" />
            <span>{program.location}</span>
          </div>
        </div>
      </div>

      <p className="text-slate-600 text-base leading-relaxed">
        {program.description}
      </p>

      {program.highlights.length > 0 && (
        <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Főbb jellemzők:</span>
          <ul className="grid sm:grid-cols-3 gap-2">
            {program.highlights.map((h, i) => (
              <li key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button href="/kapcsolat" variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />}>
          Érdeklődés & Részletek
        </Button>
      </div>
      </div>
    </div>
  );
}

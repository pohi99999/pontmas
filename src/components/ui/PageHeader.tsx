import React from 'react';
import PontJel from '@/components/brand/PontJel';
import PontAblak from '@/components/brand/PontAblak';

export interface PageHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  /** A photo already published on the site, shown in the sphere of the mark (src/content/fejlecFotok.ts). */
  foto?: { src: string; alt: string };
  children?: React.ReactNode;
}

// The top of every subpage: the same structure everywhere, the title on the left and the foundation's
// mark in the same place on the right. A predictable page start suits the audience.
// With `foto` (L2, Lumen's plan of 2026-11-18) the mark is the photo window of the home page, and it also
// shows on phones, small, beside the eyebrow, so the page has a picture in its first screen. The place and
// the shape are the same on every page; only the photo differs. Decorative: hidden from a screen reader,
// like the home page's.
export default function PageHeader({ badge, title, subtitle, foto, children }: PageHeaderProps) {
  return (
    <section className="border-b border-slate-200/80 bg-gradient-to-b from-blue-50/80 to-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="relative lg:flex lg:min-h-[250px] lg:items-center lg:pr-[280px]">
          <div className="max-w-3xl">
            {badge && (
              <p className={`eyebrow mb-4 ${foto ? 'max-lg:min-h-[7.9rem] max-lg:pr-32' : ''}`}>
                <span className="pont" aria-hidden="true" />
                {badge}
              </p>
            )}
            <h1 className="text-4xl md:text-6xl leading-[1.1] text-slate-900">{title}</h1>
            {subtitle && <p className="mt-5 text-lg md:text-xl leading-relaxed text-slate-600">{subtitle}</p>}
            {children && <div className="mt-8">{children}</div>}
          </div>
          {foto ? (
            <div className="absolute right-0 -top-3 w-[7.5rem] lg:top-1/2 lg:w-[230px] lg:-translate-y-1/2" aria-hidden="true">
              <PontAblak src={foto.src} alt={foto.alt} sizes="(min-width: 1024px) 170px, 88px" />
            </div>
          ) : (
            <div className="absolute right-0 top-1/2 hidden w-[230px] -translate-y-1/2 lg:block">
              <PontJel />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

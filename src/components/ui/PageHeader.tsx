import React from 'react';
import PontJel from '@/components/brand/PontJel';

export interface PageHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

// The top of every subpage: the same structure everywhere, the title on the left and the foundation's
// mark in the same place on the right. A predictable page start suits the audience.
export default function PageHeader({ badge, title, subtitle, children }: PageHeaderProps) {
  return (
    <section className="border-b border-slate-200/80 bg-gradient-to-b from-blue-50/80 to-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="relative lg:flex lg:min-h-[250px] lg:items-center lg:pr-[280px]">
          <div className="max-w-3xl">
            {badge && (
              <p className="eyebrow mb-4">
                <span className="pont" aria-hidden="true" />
                {badge}
              </p>
            )}
            <h1 className="text-4xl md:text-6xl leading-[1.1] text-slate-900">{title}</h1>
            {subtitle && <p className="mt-5 text-lg md:text-xl leading-relaxed text-slate-600">{subtitle}</p>}
            {children && <div className="mt-8">{children}</div>}
          </div>
          <div className="absolute right-0 top-1/2 hidden w-[230px] -translate-y-1/2 lg:block">
            <PontJel />
          </div>
        </div>
      </div>
    </section>
  );
}

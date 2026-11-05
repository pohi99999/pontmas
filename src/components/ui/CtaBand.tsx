import React from 'react';

export interface CtaBandProps {
  title: string;
  text: string;
  label?: string;
  headingLevel?: 'h2' | 'h3';
  children: React.ReactNode;
}

// The closing invitation of a page: the same calm band everywhere, so the visitor always knows where the next step is.
export default function CtaBand({ title, text, label, headingLevel = 'h3', children }: CtaBandProps) {
  const Heading = headingLevel;
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-blue-50 rounded-[2.5rem] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left max-w-2xl">
          {label && (
            <p className="eyebrow">
              <span className="pont" aria-hidden="true" />
              {label}
            </p>
          )}
          <Heading className="display text-3xl text-slate-900">{title}</Heading>
          <p className="text-slate-600 text-sm leading-relaxed">{text}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 flex-shrink-0">{children}</div>
      </div>
    </section>
  );
}

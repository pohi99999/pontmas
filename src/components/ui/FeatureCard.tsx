import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkHref?: string;
  linkLabel?: string;
  badge?: string;
  className?: string;
  /** The blue thread through the points (review 2026-11-10): a blue rule starting with the logo's dot. */
  thread?: 'last' | 'continue' | 'continue-right';
}

export default function FeatureCard({
  icon,
  title,
  description,
  linkHref,
  linkLabel = 'Tudjon meg többet',
  badge,
  className = '',
  thread,
}: FeatureCardProps) {
  // on a phone the content moves right of the vertical thread
  const rule = thread ? 'relative border-blue-400 pl-6 sm:pl-0' : 'border-slate-900';
  return (
    <div className={`border-t-2 ${rule} pt-6 flex flex-col h-full ${className}`}>
      {thread && (
        <>
          <span className="pont absolute -left-px -top-[7px]" style={{ fontSize: 19 }} aria-hidden="true" />
          {/* on a phone the thread runs down to the next point; in the two-column grid it runs on to the right */}
          {thread !== 'last' && <span className="sm:hidden absolute left-[5px] top-0 h-[calc(100%+3rem)] w-0.5 bg-blue-200" aria-hidden="true" />}
          {thread === 'continue-right' && <span className="hidden sm:block absolute left-full -top-0.5 h-0.5 w-10 bg-blue-400" aria-hidden="true" />}
        </>
      )}
      <div className="flex items-center justify-between mb-4">
        <div className="text-blue-700">
          {icon}
        </div>
        {badge && (
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
            {badge}
          </span>
        )}
      </div>

      <h3 className="display text-2xl text-slate-900 mb-3">
        {title}
      </h3>

      <p className="text-slate-600 leading-relaxed text-[15px] flex-grow mb-6">
        {description}
      </p>

      {linkHref && (
        <div>
          <Link
            href={linkHref}
            className="inline-flex items-center text-sm font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:decoration-blue-700"
          >
            <span>{linkLabel}</span>
            <ArrowRight size={16} className="ml-1.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

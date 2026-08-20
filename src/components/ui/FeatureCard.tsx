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
}

export default function FeatureCard({
  icon,
  title,
  description,
  linkHref,
  linkLabel = 'Tudjon meg többet',
  badge,
  className = '',
}: FeatureCardProps) {
  return (
    <div className={`bg-white p-8 rounded-2xl shadow-sm hover:shadow-md border border-slate-200/80 transition-all flex flex-col h-full group ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
          {icon}
        </div>
        {badge && (
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
            {badge}
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">
        {title}
      </h3>

      <p className="text-slate-600 leading-relaxed text-sm flex-grow mb-6">
        {description}
      </p>

      {linkHref && (
        <div className="pt-4 border-t border-slate-100">
          <Link
            href={linkHref}
            className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors group/link"
          >
            <span>{linkLabel}</span>
            <ArrowRight size={16} className="ml-1.5 transform group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
}

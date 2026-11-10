import React from 'react';
import { Link } from '@/i18n/navigation';
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
    <div className={`border-t-2 border-slate-900 pt-6 flex flex-col h-full ${className}`}>
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

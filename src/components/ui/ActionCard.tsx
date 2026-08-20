import React from 'react';
import Button from './Button';

export interface ActionCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  highlight?: boolean;
  badge?: string;
  className?: string;
}

export default function ActionCard({
  icon,
  title,
  description,
  buttonLabel,
  buttonHref,
  highlight = false,
  badge,
  className = '',
}: ActionCardProps) {
  return (
    <div
      className={`rounded-2xl p-8 flex flex-col h-full transition-all relative ${
        highlight
          ? 'bg-gradient-to-br from-blue-700 to-blue-900 text-white shadow-lg shadow-blue-900/20'
          : 'bg-white border border-slate-200 text-slate-900 shadow-sm hover:shadow-md'
      } ${className}`}
    >
      {badge && (
        <span
          className={`absolute top-4 right-4 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
            highlight ? 'bg-blue-500/40 text-blue-100 border border-blue-400/30' : 'bg-blue-50 text-blue-700 border border-blue-100'
          }`}
        >
          {badge}
        </span>
      )}

      {icon && (
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
            highlight ? 'bg-white/10 text-white' : 'bg-blue-50 text-blue-600'
          }`}
        >
          {icon}
        </div>
      )}

      <h3 className={`text-2xl font-bold mb-3 ${highlight ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h3>

      <p className={`text-sm leading-relaxed mb-8 flex-grow ${highlight ? 'text-blue-100' : 'text-slate-600'}`}>
        {description}
      </p>

      <div className="mt-auto">
        <Button
          href={buttonHref}
          variant={highlight ? 'secondary' : 'primary'}
          fullWidth
          className={highlight ? 'bg-white text-blue-900 hover:bg-blue-50 border-0' : ''}
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}

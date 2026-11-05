import React from 'react';

export interface SectionHeaderProps {
  badge?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}

export default function SectionHeader({
  badge,
  title,
  subtitle,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const alignmentClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={`max-w-3xl mb-12 md:mb-16 ${alignmentClass} ${className}`}>
      {badge && (
        <p className="eyebrow mb-3">
          <span className="pont" aria-hidden="true" />
          {badge}
        </p>
      )}
      <h2 className="text-3xl md:text-[2.75rem] text-slate-900 leading-[1.1] mb-5">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

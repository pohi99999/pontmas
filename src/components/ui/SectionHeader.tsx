import React from 'react';
import Badge from './Badge';

export interface SectionHeaderProps {
  badge?: string;
  badgeIcon?: React.ReactNode;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
  /** The page's own title is the h1 (one per page); every other section header stays h2. */
  as?: 'h1' | 'h2';
}

export default function SectionHeader({
  badge,
  badgeIcon,
  title,
  subtitle,
  align = 'center',
  className = '',
  as: Heading = 'h2',
}: SectionHeaderProps) {
  const alignmentClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={`max-w-3xl mb-12 md:mb-16 ${alignmentClass} ${className}`}>
      {badge && (
        <div className="mb-3">
          <Badge variant="primary" icon={badgeIcon}>
            {badge}
          </Badge>
        </div>
      )}
      <Heading className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
        {title}
      </Heading>
      {subtitle && (
        <p className="text-base md:text-lg text-slate-600 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

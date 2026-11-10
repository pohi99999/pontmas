"use client";

// The category filter of /programok, the only part of that page that needs the browser.
// The markup is the one the page had on main.
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ProgramItem } from '@/content/types';
import { ProgramCard } from './ContentCards';

type Category = 'all' | ProgramItem['category'];

const CATEGORIES: { id: Category }[] = [
  { id: 'all' },
  { id: 'event' },
  { id: 'camp' },
  { id: 'family' },
];

export default function ProgramFilter({ programs }: { programs: ProgramItem[] }) {
  const t = useTranslations('ProgramFilter');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const filteredPrograms = selectedCategory === 'all'
    ? programs
    : programs.filter(p => p.category === selectedCategory);

  return (
    <>
      {/* Kategória szűrő gombok */}
      <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-2xl mx-auto" role="tablist" aria-label={t('label')}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            role="tab"
            aria-selected={selectedCategory === cat.id}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t(cat.id)}
          </button>
        ))}
      </div>

      {/* Esemény kártyák listája */}
      <div className="max-w-5xl mx-auto space-y-8">
        {filteredPrograms.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>
    </>
  );
}

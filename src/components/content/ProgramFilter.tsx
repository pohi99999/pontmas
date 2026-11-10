"use client";

// The category filter of /programok, the only part of that page that needs the browser.
// The markup is the one the page had on main.
import { useState } from 'react';
import type { ProgramItem } from '@/content/types';
import { ProgramCard } from './ContentCards';

type Category = 'all' | ProgramItem['category'];

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all', label: 'Összes program' },
  { id: 'event', label: 'Kiemelt események' },
  { id: 'camp', label: 'Nyári táborok' },
  { id: 'family', label: 'Szülőklub és családok' },
];

export default function ProgramFilter({ programs }: { programs: ProgramItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const filteredPrograms = selectedCategory === 'all'
    ? programs
    : programs.filter(p => p.category === selectedCategory);

  return (
    <>
      {/* Kategória szűrő gombok */}
      <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-2xl mx-auto" role="tablist" aria-label="Programkategóriák">
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
            {cat.label}
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

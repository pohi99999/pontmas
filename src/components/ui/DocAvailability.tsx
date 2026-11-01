import React from 'react';
import { Clock } from 'lucide-react';

// The documents are not uploaded yet, so the card shows a plain status instead of a button:
// a "Letöltés" button that only opened an alert promised a download that did not exist.
export default function DocAvailability() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
      <span>Hamarosan elérhető</span>
    </span>
  );
}

"use client";

import React from 'react';
import { Download } from 'lucide-react';

export default function DocDownloadButton({ docTitle }: { docTitle: string }) {
  const handleClick = () => {
    alert(`A(z) "${docTitle}" dokumentum letöltése hamarosan elérhető, vagy hivatalos másolat kérhető az info@pontmas.hu címen!`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-lg hover:bg-blue-50 cursor-pointer"
      aria-label={`${docTitle} letöltése`}
    >
      <Download className="h-4 w-4" />
      <span>Letöltés</span>
    </button>
  );
}

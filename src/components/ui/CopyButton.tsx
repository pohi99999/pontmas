"use client";

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  sublabel?: string;
  className?: string;
}

export default function CopyButton({
  textToCopy,
  label,
  sublabel,
  className = '',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={`w-full text-left bg-slate-50 hover:bg-slate-100/90 active:bg-slate-200/80 p-4 rounded-xl border border-slate-200 hover:border-blue-400 group transition-all flex items-center justify-between cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${className}`}
      aria-label={`Másolás: ${textToCopy}`}
      title="Kattintson a másoláshoz"
    >
      <div className="min-w-0 pr-3">
        {label && (
          <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            {label}
          </span>
        )}
        <span className="block text-base sm:text-lg font-mono font-bold text-slate-900 tracking-tight truncate">
          {textToCopy}
        </span>
        {sublabel && (
          <span className="block text-xs text-slate-500 mt-0.5">
            {sublabel}
          </span>
        )}
      </div>

      <div
        className={`p-2 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all flex-shrink-0 ${
          copied
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-white text-slate-600 border border-slate-200 group-hover:border-blue-300 group-hover:text-blue-600 shadow-2xs'
        }`}
      >
        {copied ? (
          <>
            <Check size={16} className="text-emerald-600" />
            <span className="hidden sm:inline">Másolva!</span>
          </>
        ) : (
          <>
            <Copy size={16} />
            <span className="hidden sm:inline">Másolás</span>
          </>
        )}
      </div>
    </button>
  );
}

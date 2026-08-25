"use client";

import React, { useState } from 'react';
import { useAccessibility } from '@/context/SensoryContext';
import { 
  Sparkles, 
  Sun, 
  Type, 
  ZapOff, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  BookOpen, 
  Check, 
  Eye
} from 'lucide-react';

export default function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isSensoryFriendly,
    toggleSensoryMode,
    highContrast,
    toggleHighContrast,
    fontSize,
    cycleFontSize,
    readingRuler,
    toggleReadingRuler,
    reducedMotion,
    toggleReducedMotion,
    dyslexicFont,
    toggleDyslexicFont,
    resetAll,
  } = useAccessibility();

  const hasCustomSettings = isSensoryFriendly || highContrast || fontSize !== 'normal' || readingRuler || reducedMotion || dyslexicFont;

  return (
    <>
      {/* Floating Toolbar Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className={`flex items-center gap-2.5 rounded-full px-4 py-3 text-sm font-semibold shadow-xl transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 ${
            isOpen
              ? 'bg-slate-900 text-white shadow-slate-900/30'
              : hasCustomSettings
              ? 'bg-blue-700 text-white hover:bg-blue-800 shadow-blue-700/30 ring-2 ring-blue-300'
              : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-200/80 shadow-slate-300/40'
          }`}
          aria-expanded={isOpen}
          aria-controls="accessibility-panel"
          aria-label="Akadálymentesítés és Szenzoros beállítások vezérlőpultja"
        >
          <div className="relative flex items-center justify-center">
            <SlidersHorizontal className="h-5 w-5 text-current" />
            {hasCustomSettings && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <span className="hidden sm:inline">Akadálymentesítés</span>
        </button>
      </div>

      {/* Floating Settings Panel */}
      {isOpen && (
        <div
          id="accessibility-panel"
          role="region"
          aria-label="Akadálymentesítési beállítások"
          className="fixed bottom-20 right-6 z-50 w-88 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl backdrop-blur-xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-4"
        >
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <Eye className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Szenzoros & A11y Panel</h3>
                <p className="text-xs text-slate-500">Személyre szabott élmény és nyugodt olvasás</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none"
              aria-label="Panel bezárása"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3 text-sm">
            {/* 1. Sensory Mode (Nyugtató mód) */}
            <button
              onClick={toggleSensoryMode}
              className={`flex w-full items-center justify-between rounded-xl p-3 text-left transition-all ${
                isSensoryFriendly
                  ? 'bg-blue-50 border-2 border-blue-600 text-blue-900 font-medium'
                  : 'bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className={`h-5 w-5 ${isSensoryFriendly ? 'text-blue-700' : 'text-slate-500'}`} />
                <div>
                  <div className="font-semibold text-slate-900">Szenzoros / Nyugtató Mód</div>
                  <div className="text-xs text-slate-500">Lágyabb színek, minimális kontraszt és ingerek</div>
                </div>
              </div>
              {isSensoryFriendly && <Check className="h-5 w-5 text-blue-700 flex-shrink-0" />}
            </button>

            {/* 2. High Contrast (Erős kontraszt) */}
            <button
              onClick={toggleHighContrast}
              className={`flex w-full items-center justify-between rounded-xl p-3 text-left transition-all ${
                highContrast
                  ? 'bg-blue-50 border-2 border-blue-600 text-blue-900 font-medium'
                  : 'bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sun className={`h-5 w-5 ${highContrast ? 'text-blue-700' : 'text-slate-500'}`} />
                <div>
                  <div className="font-semibold text-slate-900">Magas Kontraszt</div>
                  <div className="text-xs text-slate-500">Jobban elkülönülő sötét/világos elemek</div>
                </div>
              </div>
              {highContrast && <Check className="h-5 w-5 text-blue-700 flex-shrink-0" />}
            </button>

            {/* 3. Font Size Scaling */}
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200 text-slate-700">
              <div className="flex items-center gap-3">
                <Type className="h-5 w-5 text-slate-500" />
                <div>
                  <div className="font-semibold text-slate-900">Betűméret</div>
                  <div className="text-xs text-slate-500">Jelenleg: {fontSize === 'normal' ? 'Normál (100%)' : fontSize === 'large' ? 'Nagy (115%)' : 'Extra nagy (130%)'}</div>
                </div>
              </div>
              <button
                onClick={cycleFontSize}
                className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 border border-slate-200 hover:bg-blue-50 shadow-sm"
              >
                Váltás (A+)
              </button>
            </div>

            {/* 4. Reading Ruler (Olvasóvonalzó) */}
            <button
              onClick={toggleReadingRuler}
              className={`flex w-full items-center justify-between rounded-xl p-3 text-left transition-all ${
                readingRuler
                  ? 'bg-blue-50 border-2 border-blue-600 text-blue-900 font-medium'
                  : 'bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className={`h-5 w-5 ${readingRuler ? 'text-blue-700' : 'text-slate-500'}`} />
                <div>
                  <div className="font-semibold text-slate-900">Olvasóvonalzó sáv</div>
                  <div className="text-xs text-slate-500">Egérkurzort követő fókuszcsík</div>
                </div>
              </div>
              {readingRuler && <Check className="h-5 w-5 text-blue-700 flex-shrink-0" />}
            </button>

            {/* 5. Reduced Motion (Animációk kikapcsolása) */}
            <button
              onClick={toggleReducedMotion}
              className={`flex w-full items-center justify-between rounded-xl p-3 text-left transition-all ${
                reducedMotion
                  ? 'bg-blue-50 border-2 border-blue-600 text-blue-900 font-medium'
                  : 'bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <ZapOff className={`h-5 w-5 ${reducedMotion ? 'text-blue-700' : 'text-slate-500'}`} />
                <div>
                  <div className="font-semibold text-slate-900">Mozgáscsökkentés</div>
                  <div className="text-xs text-slate-500">Minden animáció és mozgó hatás letiltása</div>
                </div>
              </div>
              {reducedMotion && <Check className="h-5 w-5 text-blue-700 flex-shrink-0" />}
            </button>
          </div>

          {/* Footer actions */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <button
              onClick={resetAll}
              disabled={!hasCustomSettings}
              className={`flex items-center gap-1.5 text-xs font-medium ${
                hasCustomSettings
                  ? 'text-slate-600 hover:text-red-600'
                  : 'text-slate-300 cursor-not-allowed'
              }`}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Alaphelyzet
            </button>
            <span className="text-[11px] text-slate-400 font-mono">PontMás WCAG 2.1 AA</span>
          </div>
        </div>
      )}
    </>
  );
}

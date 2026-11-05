"use client";

import React, { createContext, useContext, useState, useSyncExternalStore } from 'react';

export type FontSizeOption = 'normal' | 'large' | 'larger';

export interface AccessibilityContextType {
  isSensoryFriendly: boolean;
  toggleSensoryMode: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: FontSizeOption;
  setFontSize: (size: FontSizeOption) => void;
  cycleFontSize: () => void;
  readingRuler: boolean;
  toggleReadingRuler: () => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  dyslexicFont: boolean;
  toggleDyslexicFont: () => void;
  resetAll: () => void;
  isPanelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
}

const defaultContext: AccessibilityContextType = {
  isSensoryFriendly: false,
  toggleSensoryMode: () => {},
  highContrast: false,
  toggleHighContrast: () => {},
  fontSize: 'normal',
  setFontSize: () => {},
  cycleFontSize: () => {},
  readingRuler: false,
  toggleReadingRuler: () => {},
  reducedMotion: false,
  toggleReducedMotion: () => {},
  dyslexicFont: false,
  toggleDyslexicFont: () => {},
  resetAll: () => {},
  isPanelOpen: false,
  setPanelOpen: () => {},
};

const AccessibilityContext = createContext<AccessibilityContextType>(defaultContext);

type Prefs = {
  isSensoryFriendly: boolean;
  highContrast: boolean;
  fontSize: FontSizeOption;
  readingRuler: boolean;
  reducedMotion: boolean;
  dyslexicFont: boolean;
};

const STORAGE_KEY = 'pontmas_a11y_prefs';
const DEFAULT_PREFS: Prefs = {
  isSensoryFriendly: false,
  highContrast: false,
  fontSize: 'normal',
  readingRuler: false,
  reducedMotion: false,
  dyslexicFont: false,
};

// The preferences live in a small module-level store read through useSyncExternalStore: the server
// and the hydration pass render the defaults, then the browser's saved values take over. This is
// the same behaviour as the earlier "load in an effect, then setState", without the cascading
// render the react-hooks lint rule flags. If localStorage is unavailable the choice still works
// for the visit, it is just not remembered.
let current: Prefs | null = null;
const listeners = new Set<() => void>();

function load(): Prefs {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    if (parsed && typeof parsed === 'object') {
      const next = { ...DEFAULT_PREFS };
      for (const key of Object.keys(DEFAULT_PREFS) as (keyof Prefs)[]) {
        if (parsed[key] !== undefined && parsed[key] !== null) (next as Record<string, unknown>)[key] = parsed[key];
      }
      return next;
    }
  } catch {
    // Ignore localStorage errors
  }
  return DEFAULT_PREFS;
}

function getSnapshot(): Prefs {
  if (current === null) current = load();
  return current;
}

const getServerSnapshot = (): Prefs => DEFAULT_PREFS;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function update(change: (prev: Prefs) => Partial<Prefs>) {
  const prev = getSnapshot();
  current = { ...prev, ...change(prev) };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // Ignore localStorage errors
  }
  listeners.forEach((l) => l());
}

export function SensoryProvider({ children }: { children: React.ReactNode }) {
  const { isSensoryFriendly, highContrast, fontSize, readingRuler, reducedMotion, dyslexicFont } =
    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleSensoryMode = () => update(p => ({ isSensoryFriendly: !p.isSensoryFriendly }));
  const toggleHighContrast = () => update(p => ({ highContrast: !p.highContrast }));
  const toggleReadingRuler = () => update(p => ({ readingRuler: !p.readingRuler }));
  const toggleReducedMotion = () => update(p => ({ reducedMotion: !p.reducedMotion }));
  const toggleDyslexicFont = () => update(p => ({ dyslexicFont: !p.dyslexicFont }));
  const setFontSize = (size: FontSizeOption) => update(() => ({ fontSize: size }));

  const cycleFontSize = () => {
    update(p => ({ fontSize: p.fontSize === 'normal' ? 'large' : p.fontSize === 'large' ? 'larger' : 'normal' }));
  };

  const resetAll = () => update(() => DEFAULT_PREFS);
  // Not a saved preference: the panel opens from the floating button or, on narrow screens, from the menu
  const [isPanelOpen, setPanelOpen] = useState(false);

  const classNames = [
    isSensoryFriendly ? 'sensory-friendly' : '',
    highContrast ? 'contrast-high' : '',
    fontSize === 'large' ? 'font-large' : '',
    fontSize === 'larger' ? 'font-larger' : '',
    reducedMotion ? 'reduced-motion' : '',
    dyslexicFont ? 'font-dyslexic' : '',
  ].filter(Boolean).join(' ');

  return (
    <AccessibilityContext.Provider
      value={{
        isSensoryFriendly,
        toggleSensoryMode,
        highContrast,
        toggleHighContrast,
        fontSize,
        setFontSize,
        cycleFontSize,
        readingRuler,
        toggleReadingRuler,
        reducedMotion,
        toggleReducedMotion,
        dyslexicFont,
        toggleDyslexicFont,
        resetAll,
        isPanelOpen,
        setPanelOpen,
      }}
    >
      <div className={classNames}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
}

export const useSensory = () => useContext(AccessibilityContext);
export const useAccessibility = () => useContext(AccessibilityContext);

"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

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
};

const AccessibilityContext = createContext<AccessibilityContextType>(defaultContext);

export function SensoryProvider({ children }: { children: React.ReactNode }) {
  const [isSensoryFriendly, setIsSensoryFriendly] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<FontSizeOption>('normal');
  const [readingRuler, setReadingRuler] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pontmas_a11y_prefs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isSensoryFriendly !== undefined) setIsSensoryFriendly(parsed.isSensoryFriendly);
        if (parsed.highContrast !== undefined) setHighContrast(parsed.highContrast);
        if (parsed.fontSize) setFontSize(parsed.fontSize);
        if (parsed.readingRuler !== undefined) setReadingRuler(parsed.readingRuler);
        if (parsed.reducedMotion !== undefined) setReducedMotion(parsed.reducedMotion);
        if (parsed.dyslexicFont !== undefined) setDyslexicFont(parsed.dyslexicFont);
      }
    } catch {
      // Ignore localStorage errors
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('pontmas_a11y_prefs', JSON.stringify({
        isSensoryFriendly,
        highContrast,
        fontSize,
        readingRuler,
        reducedMotion,
        dyslexicFont,
      }));
    } catch {
      // Ignore localStorage errors
    }
  }, [isSensoryFriendly, highContrast, fontSize, readingRuler, reducedMotion, dyslexicFont, isLoaded]);

  const toggleSensoryMode = () => setIsSensoryFriendly(prev => !prev);
  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const toggleReadingRuler = () => setReadingRuler(prev => !prev);
  const toggleReducedMotion = () => setReducedMotion(prev => !prev);
  const toggleDyslexicFont = () => setDyslexicFont(prev => !prev);

  const cycleFontSize = () => {
    setFontSize(prev => {
      if (prev === 'normal') return 'large';
      if (prev === 'large') return 'larger';
      return 'normal';
    });
  };

  const resetAll = () => {
    setIsSensoryFriendly(false);
    setHighContrast(false);
    setFontSize('normal');
    setReadingRuler(false);
    setReducedMotion(false);
    setDyslexicFont(false);
  };

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

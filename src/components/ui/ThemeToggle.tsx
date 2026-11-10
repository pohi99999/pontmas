"use client";

import { useEffect, useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { THEME_KEY, resolveTheme } from '@/lib/theme';

// The <html> class is the source of truth (THEME_SCRIPT sets it before the first paint); this component
// only reads it and flips it. Without a stored choice the page keeps following the device setting.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}
const isDark = () => document.documentElement.classList.contains('dark');

function apply(dark: boolean) {
  const root = document.documentElement;
  root.classList.toggle('dark', dark);
  root.style.colorScheme = dark ? 'dark' : 'light';
}

export function useTheme() {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const follow = () => {
      let stored: string | null = null;
      try { stored = localStorage.getItem(THEME_KEY); } catch {}
      if (!stored) apply(resolveTheme(null, media.matches) === 'dark');
    };
    media.addEventListener('change', follow);
    return () => media.removeEventListener('change', follow);
  }, []);
  const toggle = () => {
    const next = !isDark();
    apply(next);
    try { localStorage.setItem(THEME_KEY, next ? 'dark' : 'light'); } catch {}
  };
  return { dark, toggle };
}

/** Icon button for the desktop header. */
export function ThemeToggleButton() {
  const { dark, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label="Sötét mód"
      title={dark ? 'Sötét mód: be (kattintson a világos módhoz)' : 'Sötét mód bekapcsolása'}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
    >
      {dark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
    </button>
  );
}

/** The phone header's theme switch, right next to the menu button (Péter 14743, 14746): a 44 px target with
 *  the sun/moon icon. Its name stays "Sötét téma" and aria-pressed says whether it is on: a name that flips
 *  ("Világos téma" while dark) together with aria-pressed would read as "Világos téma, pressed" on a dark page. */
export function ThemeToggleIcon() {
  const { dark, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label="Sötét téma"
      title={dark ? 'Sötét téma: be (koppintson a világos témához)' : 'Sötét téma bekapcsolása'}
      className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
    >
      {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  );
}

/** A full-width row for the phone menu. */
export function ThemeToggleRow() {
  const { dark, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50 transition-colors"
    >
      {dark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
      <span>Sötét mód</span>
      <span className="ml-auto text-sm text-slate-500">{dark ? 'be' : 'ki'}</span>
    </button>
  );
}

// Light and dark theme (review 2026-11-10, Marveen 6913, Péter GO 14675).
// The site follows the device setting until the visitor picks one with the switch; the choice is kept
// in localStorage. The class is set before the first paint by THEME_SCRIPT, so the page never flashes
// the other theme. Because the page has its own dark theme and says so (color-scheme meta "light dark"),
// browsers that darken pages on their own (Android Chrome "darken websites", Samsung Internet) leave it
// alone: their algorithm was what made the logo vanish (measured 2026-11-10).

export const THEME_KEY = 'pontmas_theme';
export type ThemeChoice = 'light' | 'dark';

/** The theme the page should show: the stored choice, or the device setting when there is none. */
export function resolveTheme(stored: string | null | undefined, prefersDark: boolean): ThemeChoice {
  if (stored === 'light' || stored === 'dark') return stored;
  return prefersDark ? 'dark' : 'light';
}

/** Runs inline in <head> before the first paint; kept tiny and dependency free. */
export const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem('${THEME_KEY}');var d=s==='dark'||(s!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

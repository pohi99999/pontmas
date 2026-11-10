// Motion on the home page (Péter, Telegram 14677: "Mehet a mozgás, Lágy módban ki"; it overrides the 11-05
// "no motion" decision). Each movement runs once, calmly, with no blinking. It is OFF, and the static page
// shows, when the device asks for reduced motion, or the visitor switched on "Lágy mód" or "Mozgáscsökkentés".
//
// How: MOZGAS_SCRIPT runs in <head> before the first paint and puts "pm-mozgas" on <html> only when motion
// is allowed; the CSS hides the not-yet-shown elements only under that class, so without it (motion off,
// or no JavaScript) everything is simply visible. MozgasKapu then reveals each element once it is on
// screen. Safety: if MozgasKapu does not take over within 3 s, the script removes the class again.

export const PREFS_KEY = 'pontmas_a11y_prefs';

/** Motion is allowed only without reduced motion, soft mode and the panel's motion switch. */
export function mozgasEngedett(reduce: boolean, prefs: unknown): boolean {
  if (reduce) return false;
  const p = (prefs && typeof prefs === 'object' ? prefs : {}) as Record<string, unknown>;
  return !p.isSensoryFriendly && !p.reducedMotion;
}

export const MOZGAS_SCRIPT = `(function(){try{var r=document.documentElement;var p=null;try{p=JSON.parse(localStorage.getItem('${PREFS_KEY}')||'null')}catch(e){}var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduce||(p&&(p.isSensoryFriendly||p.reducedMotion)))return;r.classList.add('pm-mozgas');setTimeout(function(){if(!r.dataset.mozgasKesz)r.classList.remove('pm-mozgas')},3000);}catch(e){}})();`;

/** A number counting up, eased out (fast first, slow at the end): the value at time t of duration d. */
export function szamlalo(from: number, to: number, t: number, d: number): number {
  if (t >= d) return to;
  const x = Math.max(0, t) / d;
  return Math.round(from + (to - from) * (1 - Math.pow(1 - x, 3)));
}

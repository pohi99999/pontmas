// Motion on the home page (Péter, Telegram 14677: "Mehet a mozgás, Lágy módban ki"). Runs once, calmly;
// OFF with reduced motion, "Lágy mód" or "Mozgáscsökkentés". The browser run of both directions is in the
// PR; these guards keep the gate.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { MOZGAS_SCRIPT, PREFS_KEY, mozgasEngedett, szamlalo } from '../src/lib/mozgas.ts';

const read = (f) => fs.readFileSync(f, 'utf8');

test('motion is allowed only without reduced motion, soft mode and the motion switch', () => {
  assert.equal(mozgasEngedett(false, null), true);
  assert.equal(mozgasEngedett(false, { fontSize: 'large' }), true);
  assert.equal(mozgasEngedett(true, null), false);
  assert.equal(mozgasEngedett(false, { isSensoryFriendly: true }), false);
  assert.equal(mozgasEngedett(false, { reducedMotion: true }), false);
});

test('the head script sets pm-mozgas only when allowed, and takes it back if nothing takes over in 3 s', () => {
  const run = (reduce, prefs, taken) => {
    const classes = new Set(); const timers = []; const dataset = {};
    const root = { classList: { add: (c) => classes.add(c), remove: (c) => classes.delete(c) }, dataset };
    vm.runInNewContext(MOZGAS_SCRIPT, {
      localStorage: { getItem: (k) => (k === PREFS_KEY && prefs ? JSON.stringify(prefs) : null) },
      window: { matchMedia: () => ({ matches: reduce }) },
      document: { documentElement: root },
      setTimeout: (f, ms) => timers.push({ f, ms }),
    });
    const before = classes.has('pm-mozgas');
    if (taken) dataset.mozgasKesz = '1';
    timers.forEach((t) => t.f());
    return { before, after: classes.has('pm-mozgas'), ms: timers.map((t) => t.ms) };
  };
  assert.deepEqual(run(false, null, true), { before: true, after: true, ms: [3000] });
  assert.deepEqual(run(false, null, false), { before: true, after: false, ms: [3000] }); // the safety
  assert.deepEqual(run(true, null, true), { before: false, after: false, ms: [] });
  assert.deepEqual(run(false, { isSensoryFriendly: true }, true), { before: false, after: false, ms: [] });
  assert.deepEqual(run(false, { reducedMotion: true }, true), { before: false, after: false, ms: [] });
});

test('the count ends exactly on the final number', () => {
  assert.equal(szamlalo(0, 40, 0, 1100), 0);
  assert.equal(szamlalo(0, 40, 1100, 1100), 40);
  assert.equal(szamlalo(0, 40, 5000, 1100), 40);
  assert.equal(szamlalo(2005, 2015, 1100, 1100), 2015);
  assert.ok(szamlalo(0, 40, 550, 1100) > 20, 'eased out: past the middle at half time');
});

test('every motion rule is behind html.pm-mozgas; without it everything is in its final state', () => {
  const css = read('src/app/globals.css');
  const rules = css.split('\n').filter((l) => l.includes('[data-mozgas'));
  assert.ok(rules.length >= 8);
  for (const r of rules) assert.match(r, /^html\.pm-mozgas \[data-mozgas/, r);
  // the existing global switches still win: soft mode zeroes the durations, reduced motion removes them
  assert.match(css, /\.sensory-friendly \*,[\s\S]*?transition-duration: 0s !important;/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?transition: none !important;/);
});

test('the H1 and the hero text never wait for motion (they are the first paint)', () => {
  const home = read('src/app/page.tsx');
  const hero = home.slice(home.indexOf('<h1'), home.indexOf('</h1>'));
  assert.doesNotMatch(hero, /data-mozgas/);
  const layout = read('src/app/layout.tsx');
  assert.match(layout, /dangerouslySetInnerHTML=\{\{ __html: MOZGAS_SCRIPT \}\}/);
  assert.match(layout, /<MozgasKapu \/>/);
});

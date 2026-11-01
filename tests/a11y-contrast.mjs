// Text contrast and heading order on the BUILT site, in a real browser (npm run test:a11y, after
// npm run build). A class-name check cannot do this: text-slate-400 is fine on the dark footer and
// 2.63:1 on a white card, so the rendered colours are measured instead. Every visible text node on
// a solid background must reach WCAG AA (4.5:1, or 3:1 for large text), and no page may skip a
// heading level. Text over a gradient or image is skipped (no single background colour to measure).
//
// Uses the Chrome already on the machine (CHROME_PATH, or the usual install paths); GitHub's
// ubuntu runners have it, so nothing is downloaded.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const ROUTES = ['/', '/autizmus', '/segitseg', '/rolunk', '/rolunk-irtak', '/hirek', '/programok', '/tamogatas', '/dokumentumok', '/kapcsolat'];
const PORT = process.env.A11Y_PORT || '3999';
const BASE = `http://127.0.0.1:${PORT}`;
const CHROME = [process.env.CHROME_PATH, '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find((p) => p && fs.existsSync(p));
if (!CHROME) { console.error('No Chrome found; set CHROME_PATH.'); process.exit(2); }

const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', PORT], { stdio: 'ignore', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } });
const stop = () => { try { server.kill(); } catch { /* already gone */ } };

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(BASE)).ok) return; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('next start did not come up');
}

// runs in the page
function measure() {
  const cv = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  const rgba = (c) => { cv.clearRect(0, 0, 1, 1); cv.fillStyle = '#000'; cv.fillStyle = c; cv.fillRect(0, 0, 1, 1); const d = cv.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const lum = ([r, g, b]) => [r, g, b].map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
  const solidBg = (el) => {
    const layers = [];
    for (let e = el; e; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.backgroundImage && s.backgroundImage !== 'none') return null;
      const c = rgba(s.backgroundColor);
      if (c[3] > 0) { layers.push(c); if (c[3] >= 0.99) break; }
    }
    let bg = [255, 255, 255];
    for (const [r, g, b, a] of layers.reverse()) bg = [r * a + bg[0] * (1 - a), g * a + bg[1] * (1 - a), b * a + bg[2] * (1 - a)];
    return bg;
  };
  const low = [];
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const el = n.parentElement;
    if (!n.textContent.trim() || seen.has(el)) continue;
    seen.add(el);
    const s = getComputedStyle(el), r = el.getBoundingClientRect();
    if (!r.width || !r.height || s.visibility === 'hidden' || parseFloat(s.opacity) === 0 || el.closest('[aria-hidden="true"],.sr-only')) continue;
    const bg = solidBg(el);
    if (!bg) continue;
    const fg = rgba(s.color);
    const f = [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3]));
    const a = lum(f), b = lum(bg);
    const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const size = parseFloat(s.fontSize), bold = parseInt(s.fontWeight, 10) >= 700;
    const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
    if (ratio < need) low.push(`${ratio.toFixed(2)}:1 < ${need} "${n.textContent.trim().slice(0, 40)}"`);
  }
  const levels = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => Number(h.tagName[1]));
  const skips = levels.flatMap((l, i) => (i && l > levels[i - 1] + 1 ? [`h${levels[i - 1]} -> h${l}`] : []));
  return { low, skips };
}

let failures = 0;
try {
  await waitForServer();
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  for (const width of [1440, 375]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    for (const route of ROUTES) {
      await page.goto(BASE + route, { waitUntil: 'networkidle' });
      const { low, skips } = await page.evaluate(measure);
      for (const m of [...low, ...skips]) { failures++; console.log(`FAIL ${width}px ${route}: ${m}`); }
    }
    await page.close();
  }
  await browser.close();
} finally {
  stop();
}
console.log(failures ? `${failures} contrast/heading problem(s)` : `contrast and heading order OK on ${ROUTES.length} routes at 1440 and 375 px`);
process.exit(failures ? 1 : 0);

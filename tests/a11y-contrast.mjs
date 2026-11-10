// Text contrast, headings and page width on the BUILT site, in a real browser (npm run test:a11y,
// after npm run build). A class-name check cannot do this: text-slate-400 is fine on the dark footer
// and 2.63:1 on a white card, so the rendered colours are measured instead.
// - Every visible text node must reach WCAG AA (4.5:1, or 3:1 for large text). On a solid background
//   against that colour; over a gradient against its WORST colour stop (each stop laid over the solid
//   background underneath), so a pass is a pass everywhere along the gradient. Text over an image is
//   skipped (no colour to measure).
// - Exactly one h1 per page, and no skipped heading level.
// - No horizontal scrolling at any tested width: the desktop header used to overflow 1024-1310 px
//   and push the "Támogatás" button off screen.
// - Where the full desktop header shows (1360 px and up), every item in it stays on one line.
// - The menu (hamburger, 1280 px): opens as a narrow panel, Escape closes it and returns the focus to
//   the menu button; the first Tab on a page lands on the "Ugrás a tartalomra" skip link.
//
// Uses the Chrome already on the machine (CHROME_PATH, or the usual install paths); GitHub's
// ubuntu runners have it, so nothing is downloaded.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const ROUTES = ['/', '/autizmus', '/segitseg', '/rolunk', '/rolunk-irtak', '/hirek', '/programok', '/tamogatas', '/dokumentumok', '/kapcsolat', '/adatkezeles', '/impresszum'];
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
  const over = (top, under) => [0, 1, 2].map((i) => top[i] * top[3] + under[i] * (1 - top[3]));
  const COLOR = /(?:rgba?|hsla?|oklch|oklab|lab|lch|color)\([^()]*\)|#[0-9a-f]{3,8}\b/gi;
  // the background(s) a text sits on: one colour, or every stop of a gradient; null over an image
  const backgrounds = (el) => {
    const layers = [];
    let stops = null;
    for (let e = el; e; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.backgroundImage && s.backgroundImage !== 'none') {
        if (/url\(/.test(s.backgroundImage)) return null;
        if (!stops) stops = (s.backgroundImage.match(COLOR) || []).map(rgba);
        continue;
      }
      const c = rgba(s.backgroundColor);
      if (c[3] > 0) { layers.push(c); if (c[3] >= 0.99) break; }
    }
    let base = [255, 255, 255];
    for (const c of layers.reverse()) base = over(c, base);
    return stops && stops.length ? stops.map((c) => over(c, base)) : [base];
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
    const bgs = backgrounds(el);
    if (!bgs) continue;
    const fg = rgba(s.color);
    const ratio = Math.min(...bgs.map((bg) => {
      const a = lum(over(fg, bg)), b = lum(bg);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    }));
    const size = parseFloat(s.fontSize), bold = parseInt(s.fontWeight, 10) >= 700;
    const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
    if (ratio < need) low.push(`${ratio.toFixed(2)}:1 < ${need}${bgs.length > 1 ? ' (gradient)' : ''} "${n.textContent.trim().slice(0, 40)}"`);
  }
  const levels = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => Number(h.tagName[1]));
  const skips = levels.flatMap((l, i) => (i && l > levels[i - 1] + 1 ? [`h${levels[i - 1]} -> h${l}`] : []));
  const h1 = levels.filter((l) => l === 1).length;
  if (h1 !== 1) skips.push(`${h1} h1 on the page (exactly 1 expected)`);
  if (window.innerWidth >= 1360) {
    const header = document.querySelector('header');
    for (const el of header.querySelectorAll('a, button, span')) {
      if (el.children.length || !el.textContent.trim() || !el.offsetParent || el.closest('.sr-only')) continue;
      const range = document.createRange();
      range.selectNodeContents(el);
      const lines = new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size;
      if (lines > 1) skips.push(`header item on ${lines} lines: "${el.textContent.trim()}"`);
    }
  }
  const width = document.documentElement.scrollWidth, view = document.documentElement.clientWidth;
  if (width > view) skips.push(`horizontal scroll: page ${width} px wide in a ${view} px window`);
  return { low, skips };
}

let failures = 0;
try {
  await waitForServer();
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  for (const width of [1440, 1366, 1280, 1180, 1024, 768, 375]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    for (const route of ROUTES) {
      await page.goto(BASE + route, { waitUntil: 'networkidle' });
      const { low, skips } = await page.evaluate(measure);
      for (const m of [...low, ...skips]) { failures++; console.log(`FAIL ${width}px ${route}: ${m}`); }
    }
    await page.close();
  }

  // the menu and the skip link, driven with the keyboard
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const fail = (m) => { failures++; console.log(`FAIL menu/skip 1280px: ${m}`); };
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  const first = await page.evaluate(() => document.activeElement?.textContent?.trim());
  if (first !== 'Ugrás a tartalomra') fail(`first Tab lands on "${first}", not the skip link`);
  await page.keyboard.press('Enter');
  if (!(await page.evaluate(() => document.activeElement?.id === 'tartalom'))) fail('the skip link does not move the focus to the content');
  const button = page.locator('button[aria-controls="fo-menu"]');
  if (!(await button.count())) fail('menu button without aria-controls="fo-menu"');
  else {
    await button.click();
    const panel = await page.evaluate(() => {
      const m = document.getElementById('fo-menu'); if (!m) return null;
      const r = m.getBoundingClientRect(); return { width: Math.round(r.width), right: Math.round(window.innerWidth - r.right) };
    });
    if (!panel) fail('the menu does not open');
    else if (panel.width > 400) fail(`the open menu is ${panel.width} px wide, not a narrow panel`);
    await page.keyboard.press('Escape');
    const after = await page.evaluate(() => ({
      open: !!document.getElementById('fo-menu'),
      expanded: document.querySelector('button[aria-controls="fo-menu"]')?.getAttribute('aria-expanded'),
      focusOnButton: document.activeElement?.getAttribute('aria-controls') === 'fo-menu',
    }));
    if (after.open || after.expanded !== 'false') fail('Escape does not close the menu');
    if (!after.focusOnButton) fail('after Escape the focus is not back on the menu button');
  }
  await page.close();

  // In the soft and the high contrast mode the accessibility button stays on screen (a filter on the
  // wrapper used to make it the containing block of the fixed elements: the button went to the page bottom)
  const modes = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await modes.goto(BASE + '/', { waitUntil: 'networkidle' });
  for (const mode of ['isSensoryFriendly', 'highContrast']) {
    await modes.evaluate((m) => localStorage.setItem('pontmas_a11y_prefs', JSON.stringify({ [m]: true })), mode);
    await modes.reload({ waitUntil: 'load' });
    await modes.waitForFunction(() => document.querySelector('.sensory-friendly, .contrast-high'));
    const box = await modes.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find((x) => /Akadálymentesítés/.test(x.getAttribute('aria-label') || x.textContent));
      const r = b.getBoundingClientRect();
      return { top: Math.round(r.top), bottom: Math.round(r.bottom), vh: window.innerHeight };
    });
    if (box.top < 0 || box.bottom > box.vh) { failures++; console.log(`FAIL ${mode}: the accessibility button is at ${box.top}-${box.bottom} px in a ${box.vh} px window`); }
  }
  await modes.close();

  // Below 1024 px there is no floating button (it sat on the text): the panel opens from the first row of the
  // menu, with the keyboard as well. From 1024 px the floating button is back and the row is gone.
  const narrow = await browser.newPage({ viewport: { width: 1023, height: 700 } });
  await narrow.goto(BASE + '/', { waitUntil: 'networkidle' });
  const floatingShown = (p) => p.evaluate(() => {
    const b = document.querySelector('button[aria-label^="Akadálymentesítés"]');
    return !!b && b.getClientRects().length > 0;
  });
  if (await floatingShown(narrow)) fail('1023 px: the floating accessibility button is on screen');
  await narrow.locator('[aria-controls="fo-menu"]').focus();
  await narrow.keyboard.press('Enter');
  await narrow.keyboard.press('Tab');
  const onRow = await narrow.evaluate(() => document.activeElement?.getAttribute('aria-controls') === 'accessibility-panel');
  if (!onRow) fail('1023 px: the first stop in the menu is not the accessibility row');
  await narrow.keyboard.press('Enter');
  await narrow.waitForSelector('#accessibility-panel');
  const panel = await narrow.evaluate(() => {
    const r = document.getElementById('accessibility-panel').getBoundingClientRect();
    return { inView: r.top >= 0 && r.bottom <= window.innerHeight, focusInside: document.getElementById('accessibility-panel').contains(document.activeElement), menu: !!document.getElementById('fo-menu') };
  });
  if (!panel.inView) fail('1023 px: the accessibility panel does not fit the window');
  if (!panel.focusInside) fail('1023 px: the focus is not inside the accessibility panel');
  if (panel.menu) fail('1023 px: the menu stayed open behind the panel');
  await narrow.keyboard.press('Escape');
  const closed = await narrow.evaluate(() => ({
    gone: !document.getElementById('accessibility-panel'),
    focusOnButton: document.activeElement?.getAttribute('aria-controls') === 'fo-menu',
  }));
  if (!closed.gone) fail('1023 px: Escape does not close the accessibility panel');
  if (!closed.focusOnButton) fail('1023 px: after Escape the focus is not back on the menu button');
  await narrow.setViewportSize({ width: 1024, height: 700 });
  if (!(await floatingShown(narrow))) fail('1024 px: the floating accessibility button is missing');
  await narrow.locator('[aria-controls="fo-menu"]').click();
  const rowShown = await narrow.evaluate(() => {
    const r = document.querySelector('#fo-menu button[aria-controls="accessibility-panel"]');
    return !!r && r.getClientRects().length > 0;
  });
  if (rowShown) fail('1024 px: the accessibility row is in the menu as well');
  await narrow.close();
  await browser.close();
} finally {
  stop();
}
console.log(failures ? `${failures} contrast/heading/width/menu problem(s)` : `contrast, headings, width, one-line header and menu keyboard OK on ${ROUTES.length} routes at 1440, 1366, 1280, 1180, 1024, 768 and 375 px`);
process.exit(failures ? 1 : 0);

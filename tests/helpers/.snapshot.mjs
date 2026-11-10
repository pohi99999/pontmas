// temporary, not committed: the rendered HTML of every public page and shared component, for a before/after diff
import fs from 'node:fs';
import { renderHtml } from './render.mjs';
const items = ['app/[locale]/page.tsx','app/[locale]/autizmus/page.tsx','app/[locale]/segitseg/page.tsx','app/[locale]/rolunk/page.tsx','app/[locale]/rolunk-irtak/page.tsx','app/[locale]/hirek/page.tsx','app/[locale]/programok/page.tsx','app/[locale]/tamogatas/page.tsx','app/[locale]/dokumentumok/page.tsx','app/[locale]/kapcsolat/page.tsx','app/[locale]/adatkezeles/page.tsx','app/[locale]/impresszum/page.tsx','components/layout/Header.tsx','components/layout/Footer.tsx','components/forms/ContactForm.tsx','components/ui/AccessibilityToolbar.tsx'];
const out = {};
for (const p of items) out[p] = await renderHtml(p);
fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.log(Object.keys(out).length, 'rendered', Object.values(out).reduce((n, s) => n + s.length, 0), 'chars');

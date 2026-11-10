// temporary, not committed: every page's Hungarian metadata, for a before/after comparison
import fs from 'node:fs';
import { src } from './load.mjs';
const pages = ['', 'autizmus', 'segitseg', 'rolunk', 'rolunk-irtak', 'hirek', 'programok', 'tamogatas', 'dokumentumok', 'kapcsolat', 'adatkezeles', 'impresszum'];
const out = {};
for (const p of pages) {
  const dir = p ? `app/[locale]/${p}` : 'app/[locale]';
  let mod = await src(`${dir}/page.tsx`);
  if (!mod.generateMetadata) mod = await src(`${dir}/layout.tsx`);
  out[p || '/'] = await mod.generateMetadata({ params: Promise.resolve({ locale: 'hu' }) });
}
const layout = await (await src('app/[locale]/layout.tsx')).generateMetadata({ params: Promise.resolve({ locale: 'hu' }) });
out.__layout = layout;
if (process.argv[3] === 'compare') {
  const before = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  let same = 0;
  for (const k of Object.keys(before)) {
    const a = JSON.stringify(before[k]); const b = JSON.stringify(out[k]);
    if (a === b) same++; else console.log(`DIFF ${k}\n  before: ${a.slice(0, 300)}\n  now:    ${b.slice(0, 300)}`);
  }
  console.log(`${same}/${Object.keys(before).length} metadata identical`);
} else {
  fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
  console.log(Object.keys(out).length, 'metadata saved');
}

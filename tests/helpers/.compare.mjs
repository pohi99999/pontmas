// temporary, not committed: renders again and compares with the snapshot taken before the extraction
import fs from 'node:fs';
import { renderHtml } from './render.mjs';
const before = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
let same = 0;
for (const [p, html] of Object.entries(before)) {
  const now = await renderHtml(p);
  if (now === html) { same++; continue; }
  let i = 0; while (i < html.length && html[i] === now[i]) i++;
  console.log(`DIFF ${p} at ${i}:\n  before: ${html.slice(Math.max(0, i - 60), i + 80)}\n  now:    ${now.slice(Math.max(0, i - 60), i + 80)}`);
}
console.log(`${same}/${Object.keys(before).length} identical`);

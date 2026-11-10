// The chat's knowledge is the site's own text (card c017f163): the generated file must equal what the
// pages render now, so a page change cannot leave the chat answering from the old text.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { knowledgeFromPages, KNOWLEDGE_PAGES, renderKnowledgeModule, htmlToKnowledgeText } from '../scripts/chat-knowledge-lib.mjs';
import { src } from './helpers/load.mjs';

test('knowledge.generated.ts equals the pages as they render now (run npm run chat:knowledge after a text change)', async () => {
  const fresh = renderKnowledgeModule(await knowledgeFromPages(KNOWLEDGE_PAGES));
  const onDisk = fs.readFileSync(path.resolve('src/lib/chat/knowledge.generated.ts'), 'utf8');
  assert.ok(fresh === onDisk, 'the generated knowledge is out of date: run `npm run chat:knowledge`');
});

test('the knowledge carries the facts from foundation.ts and leaves out what it must not use', async () => {
  const { SITE_KNOWLEDGE } = await src('lib/chat/knowledge.generated.ts');
  const { FOUNDATION } = await src('lib/foundation.ts');
  const all = SITE_KNOWLEDGE.map((p) => p.text).join('\n');
  for (const f of [FOUNDATION.taxNumber, FOUNDATION.bankAccount, FOUNDATION.phone]) assert.ok(all.includes(f), f);
  const routes = SITE_KNOWLEDGE.map((p) => p.route);
  for (const r of ['/adatkezeles', '/impresszum', '/szerkeszto', '/hirek', '/programok']) assert.ok(!routes.includes(r), `${r} is not in the static knowledge`);
  assert.ok(!/<[a-z][^>]*>/i.test(all), 'no HTML left');
});

test('html to text keeps headings and list items, drops markup and forms, decodes entities', () => {
  const t = htmlToKnowledgeText('<section><h2 class="x">Cím</h2><p>Egy &amp; kettő</p><ul><li>első</li><li>második</li></ul><form><input/>titok</form></section>');
  assert.equal(t, '## Cím\nEgy & kettő\n- első\n- második');
});

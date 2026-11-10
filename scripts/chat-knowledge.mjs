// Writes src/lib/chat/knowledge.generated.ts: the chat's knowledge is the text the site already
// publishes, rendered from the pages themselves, not a second text someone has to keep in step.
// Run after a page's text changes: npm run chat:knowledge. tests/chat-knowledge.test.mjs fails
// while the generated file and the pages differ.
//
// Left out on purpose: /hirek and /programok (the chat reads the editor's current items at request
// time), the legal drafts (not approved yet), the editor.
import fs from 'node:fs';
import path from 'node:path';
import { knowledgeFromPages, KNOWLEDGE_PAGES, renderKnowledgeModule } from './chat-knowledge-lib.mjs';

const out = path.resolve('src/lib/chat/knowledge.generated.ts');
const pages = await knowledgeFromPages(KNOWLEDGE_PAGES);
fs.writeFileSync(out, renderKnowledgeModule(pages));
console.log(`${path.relative(process.cwd(), out)}: ${pages.length} pages, ${pages.reduce((n, p) => n + p.text.length, 0)} characters`);

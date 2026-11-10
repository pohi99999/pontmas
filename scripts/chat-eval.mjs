// The chat's evaluation (card c017f163): the 30 questions of tests/chat-eval/questions.json against the
// real model, with the same system prompt the endpoint builds. The answers are for a person to read
// (Péter and the foundation); the script does not grade them.
//
// It spends money (about 30 Haiku 5.5 calls, estimated well under 0.10 USD), so it runs only with an
// explicit --run and a key in PONTMAS_ANTHROPIC_API_KEY. It never uses the HomolaMentor key.
//   PONTMAS_ANTHROPIC_API_KEY=... npm run chat:eval -- --run
// The report goes to tests/chat-eval/out/ (ignored by git): the answers are reviewed, not committed.
import fs from 'node:fs';
import path from 'node:path';
import { src } from '../tests/helpers/load.mjs';

const run = process.argv.includes('--run');
const key = process.env.PONTMAS_ANTHROPIC_API_KEY?.trim();
const questions = JSON.parse(fs.readFileSync(path.resolve('tests/chat-eval/questions.json'), 'utf8'));
if (!run || !key) {
  console.log(`${questions.length} questions. Not run: this spends money. Use --run with PONTMAS_ANTHROPIC_API_KEY set.`);
  process.exit(0);
}

const { claudeCaller } = await src('lib/chat/claude.ts');
const { buildSystem } = await src('lib/chat/prompt.ts');
const { detectPii } = await src('lib/chat/pii.ts');
const { costMicroUsd } = await src('lib/chat/pricing.ts');
const { DEFAULT_MODEL } = await src('lib/chat/config.ts');
const { SEED_CONTENT } = await src('content/seed.ts');
const { splitNews, visiblePrograms } = await src('content/public.ts');

const model = process.env.PONTMAS_CHAT_MODEL?.trim() || DEFAULT_MODEL;
const call = claudeCaller(key, model);
const { featured, rest } = splitNews(SEED_CONTENT.news);
const news = featured ? [featured, ...rest] : rest;
const programs = visiblePrograms(SEED_CONTENT.programs);

let total = 0;
const rows = [];
for (const item of questions) {
  if (detectPii(item.q).length) {
    rows.push({ ...item, answer: '(a személyesadat-szűrő megfogta, a modell nem kapta meg)', cost: 0 });
    continue;
  }
  const r = await call(buildSystem(item.locale, news, programs), [{ role: 'user', content: item.q }]);
  const cost = costMicroUsd(model, r.usage);
  total += cost;
  rows.push({ ...item, answer: r.kind === 'text' ? r.text : `(${r.kind})`, cost, usage: r.usage });
}

const day = new Date().toISOString().slice(0, 10);
const outDir = path.resolve('tests/chat-eval/out');
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `chat-eval-${day}.md`);
fs.writeFileSync(out, [
  `# PontMás chat értékelés, ${day}, ${model}`,
  '',
  `Összköltség: ${(total / 1e6).toFixed(4)} USD (${total} mikro-USD). A válaszokat ember olvassa: megfelel-e a "várt" oszlopnak.`,
  '',
  ...rows.flatMap((r) => [
    `## ${r.id}. ${r.group} (${r.locale})`,
    '', `**Kérdés:** ${r.q}`, '', `**Várt:** ${r.expect}`, '', `**Válasz:**`, '', r.answer, '',
    `_tokenek: ${JSON.stringify(r.usage ?? {})}, ${r.cost} mikro-USD_`, '', '**Megfelel?** [ ] igen  [ ] nem, mert: ', '',
  ]),
].join('\n'));
console.log(`${rows.length} answers, ${(total / 1e6).toFixed(4)} USD -> ${path.relative(process.cwd(), out)}`);

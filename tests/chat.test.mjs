// The AI chat (card c017f163): every gate measured in both directions, without the network.
import test from 'node:test';
import assert from 'node:assert/strict';
import { src } from './helpers/load.mjs';

const { detectPii } = await src('lib/chat/pii.ts');
const { chatConfig, DEFAULT_ORIGINS } = await src('lib/chat/config.ts');
const { CHAT_APPROVALS } = await src('lib/chat/approvals.ts');
const { upstashKv, memoryKv, budgetKeys, budapestDay } = await src('lib/chat/budget.ts');
const { costMicroUsd } = await src('lib/chat/pricing.ts');
const { handleChat, MAX_MESSAGES } = await src('lib/chat/handle.ts');
const { WindowLimiter } = await src('lib/chat/limiter.ts');
const { FIXED, CRISIS_TEXT, RULES } = await src('lib/chat/rules.ts');
const { buildSystem } = await src('lib/chat/prompt.ts');
const { plainText } = await src('lib/chat/claude.ts');
const { FOUNDATION } = await src('lib/foundation.ts');

const ALL_APPROVED = Object.fromEntries(Object.keys(CHAT_APPROVALS).map((k) => [k, true]));
const ON = { PONTMAS_CHAT_ENABLED: 'true', PONTMAS_ANTHROPIC_API_KEY: 'test-key-not-real', KV_REST_API_URL: 'https://kv.example', KV_REST_API_TOKEN: 't', VERCEL_ENV: 'production' };

// ---------- personal data ----------

test('pii: stops e-mail, phone, TAJ, tax id, bank account, birth date and street address', () => {
  const cases = {
    email: 'írjatok a kovacs.anna@gmail.com címre',
    phone: 'hívjatok a 06 30 123 4567 számon',
    phone2: 'telefonom +36-20-555-1234',
    taj: 'a TAJ száma 123 456 789',
    tax_id: 'adóazonosító jelem 8123456789',
    bank_account: 'utaljatok a 12345678-12345678-12345678 számlára',
    birth_date: 'a fiam 2019. 03. 04-én született, szül. dátum: 2019-03-04',
    address: 'lakcímünk 9700 Szombathely, Kossuth Lajos utca 5.',
  };
  for (const [what, text] of Object.entries(cases)) assert.ok(detectPii(text).length > 0, `${what}: ${text}`);
});

test('pii: lets through ordinary questions and the foundation\'s own published facts', () => {
  for (const text of [
    'Mikor lesz a nyári tábor?',
    'A 6 éves fiam nem beszél, hova forduljak?',
    `Jó ez az adószám: ${FOUNDATION.taxNumber}?`,
    `Erre a számlára utalhatok: ${FOUNDATION.bankAccount}?`,
    `Hívhatom a ${FOUNDATION.phone} számot?`,
    'Hol van a 9700 Szombathely, Váci M. utca 12. 3./15. cím?',
    'A 2026. 06. 15-i családi napra jöhetünk?',
    'Is there anything in English? Wie kann ich spenden?',
    '2015 óta működtök?',
  ]) assert.deepEqual(detectPii(text), [], text);
});

// ---------- configuration ----------

test('config: off by default, and each missing condition keeps it off', () => {
  const off = chatConfig({});
  assert.equal(off.enabled, false);
  for (const b of ['switch_off', 'no_key', 'no_hard_cap']) assert.ok(off.blockers.includes(b), b);
  assert.ok(off.blockers.some((b) => b.startsWith('approval_pending:')), 'the approvals in the repository are pending');
  assert.equal(chatConfig(ON, ALL_APPROVED).enabled, true);
  for (const k of ['PONTMAS_CHAT_ENABLED', 'PONTMAS_ANTHROPIC_API_KEY', 'KV_REST_API_URL']) {
    const env = { ...ON };
    delete env[k];
    assert.equal(chatConfig(env, ALL_APPROVED).enabled, false, `without ${k}`);
  }
  assert.equal(chatConfig({ ...ON, PONTMAS_CHAT_ENABLED: 'TRUE ' }, ALL_APPROVED).enabled, false, 'only exactly "true" switches on');
  assert.equal(chatConfig({ ...ON, PONTMAS_CHAT_MODEL: 'claude-opus-5-5' }, ALL_APPROVED).enabled, false, 'a model without a price is refused');
  for (const k of Object.keys(CHAT_APPROVALS)) assert.equal(chatConfig(ON, { ...ALL_APPROVED, [k]: false }).enabled, false, `approval ${k} pending`);
});

test('config: the workspace-limit flag replaces the shared store, with memory counters', () => {
  const env = { PONTMAS_CHAT_ENABLED: 'true', PONTMAS_ANTHROPIC_API_KEY: 'k', PONTMAS_CHAT_WORKSPACE_LIMIT_CONFIRMED: 'true' };
  const c = chatConfig(env, ALL_APPROVED);
  assert.equal(c.enabled, true);
  assert.equal(c.store.kind, 'memory');
  assert.equal(chatConfig({ ...env, UPSTASH_REDIS_REST_URL: 'https://u.example/', UPSTASH_REDIS_REST_TOKEN: 'u' }, ALL_APPROVED).store.url, 'https://u.example');
});

test('config: defaults (Haiku 5.5, 300 calls a day, 10 per 10 minutes, 15 USD a month, the three origins)', () => {
  const c = chatConfig(ON, ALL_APPROVED);
  assert.equal(c.model, 'claude-haiku-5-5');
  assert.equal(c.dailyCap, 300);
  assert.equal(c.perTenMinutes, 10);
  assert.equal(c.monthlyMicroUsd, 15_000_000);
  assert.deepEqual(c.origins, DEFAULT_ORIGINS);
  assert.deepEqual(chatConfig({ ...ON, PONTMAS_CHAT_ORIGINS: 'https://a.example/, https://b.example' }).origins, ['https://a.example', 'https://b.example']);
});

// ---------- cost and counters ----------

test('cost: micro-USD from the usage, rounded up; an unknown model throws', () => {
  // 12 000 cached + 2 000 fresh input + 800 output on Haiku 5.5: 120 + 200 + 400 = 720 micro-USD
  assert.equal(costMicroUsd('claude-haiku-5-5', { input_tokens: 2000, output_tokens: 800, cache_read_input_tokens: 12000, cache_creation_input_tokens: 0 }), 720);
  // the first call writes the cache: 12 000 x 0.125 = 1500 more
  assert.equal(costMicroUsd('claude-haiku-5-5', { input_tokens: 2000, output_tokens: 800, cache_read_input_tokens: 0, cache_creation_input_tokens: 12000 }), 2100);
  assert.equal(costMicroUsd('claude-haiku-5-5', { input_tokens: 1, output_tokens: 0 }), 1);
  assert.throws(() => costMicroUsd('claude-unknown', { input_tokens: 1 }));
});

/** An Upstash REST stand-in: GET, and the INCRBY + EXPIRE pipeline; anything else fails the test. */
function fakeUpstash() {
  const data = new Map();
  const calls = [];
  const fetchFn = async (url, init) => {
    assert.match(String(url), /^https:\/\/kv\.example(\/pipeline)?$/, 'only the configured store is called');
    assert.equal(init.headers.Authorization, 'Bearer t');
    const body = JSON.parse(init.body);
    calls.push(body);
    const run = ([cmd, key, arg]) => {
      if (cmd === 'GET') return { result: data.has(key) ? String(data.get(key)) : null };
      if (cmd === 'INCRBY') { data.set(key, (data.get(key) ?? 0) + Number(arg)); return { result: data.get(key) }; }
      if (cmd === 'EXPIRE') return { result: 1 };
      throw new Error(`unexpected ${cmd}`);
    };
    const out = String(url).endsWith('/pipeline') ? body.map(run) : run(body);
    return new Response(JSON.stringify(out), { status: 200 });
  };
  return { fetchFn, data, calls };
}

test('budget: the Upstash store counts across calls, keys carry the environment and the Budapest date', async () => {
  const u = fakeUpstash();
  const kv = upstashKv('https://kv.example', 't', u.fetchFn);
  assert.equal(await kv.get('k'), 0);
  assert.equal(await kv.incrBy('k', 5, 60), 5);
  assert.equal(await kv.incrBy('k', 2, 60), 7);
  assert.equal(await kv.get('k'), 7);
  // 2026-11-30 23:30 UTC is already 2026-12-01 in Budapest
  const ms = Date.UTC(2026, 10, 30, 23, 30);
  assert.equal(budapestDay(ms), '2026-12-01');
  assert.deepEqual(budgetKeys('preview', ms), { daily: 'pontmas:chat:preview:calls:2026-12-01', monthly: 'pontmas:chat:preview:usd-micro:2026-12' });
});

test('budget: a failing store throws (the handler then closes), and memory counters expire', async () => {
  const kv = upstashKv('https://kv.example', 't', async () => new Response('no', { status: 500 }));
  await assert.rejects(() => kv.get('k'));
  let now = 0;
  const m = memoryKv(() => now);
  await m.incrBy('k', 3, 10);
  assert.equal(await m.get('k'), 3);
  now = 11_000;
  assert.equal(await m.get('k'), 0);
});

// ---------- the endpoint's logic ----------

const ORIGIN = 'https://pontmas.vercel.app';
const ask = (text, extra = {}) => ({ origin: ORIGIN, ip: '1.2.3.4', body: { locale: 'hu', messages: [{ role: 'user', content: text }] }, ...extra });

function deps(over = {}) {
  const u = fakeUpstash();
  const lines = [];
  let called = 0;
  const d = {
    env: ON,
    now: () => Date.UTC(2026, 10, 10, 12),
    fetch: u.fetchFn,
    caller: () => async () => { called++; return { kind: 'text', text: '**Szia!** A tábor nyáron lesz.', usage: { input_tokens: 2000, output_tokens: 800, cache_read_input_tokens: 12000, cache_creation_input_tokens: 0 } }; },
    content: async () => ({ news: [], programs: [] }),
    limiter: new WindowLimiter(10, 600_000),
    memoryKv: memoryKv(),
    log: (l) => lines.push(l),
    approvals: ALL_APPROVED,
    ...over,
  };
  return { d, u, lines, called: () => called };
}

test('handle: a foreign or missing Origin is refused before anything else', async () => {
  for (const origin of ['https://evil.example', null, 'https://pontmas.hu.evil.example']) {
    const t = deps();
    const r = await handleChat(ask('Szia', { origin }), t.d);
    assert.equal(r.status, 403);
    assert.equal(t.called(), 0);
  }
  for (const origin of DEFAULT_ORIGINS) assert.equal((await handleChat(ask('Szia', { origin }), deps().d)).status, 200, origin);
});

test('handle: malformed requests are 400, an over-long conversation gets the fixed text', async () => {
  for (const body of [null, {}, { messages: [] }, { messages: [{ role: 'system', content: 'x' }] }, { messages: [{ role: 'assistant', content: 'x' }] }])
    assert.equal((await handleChat({ origin: ORIGIN, ip: 'x', body }, deps().d)).status, 400, JSON.stringify(body));
  const long = await handleChat(ask('x'.repeat(1001)), deps().d);
  assert.equal(long.body.reply, FIXED.tooLong.hu);
  const many = Array.from({ length: MAX_MESSAGES + 1 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', content: 'k' }));
  assert.equal((await handleChat({ origin: ORIGIN, ip: 'x', body: { messages: many } }, deps().d)).body.reply, FIXED.tooLong.hu);
});

test('handle: switched off, the model is never called and the visitor gets the phone number', async () => {
  const t = deps({ env: {} });
  const r = await handleChat(ask('Mikor lesz tábor?'), t.d);
  assert.equal(r.body.reply, FIXED.off.hu);
  assert.ok(r.body.reply.includes(FOUNDATION.phone));
  assert.equal(t.called(), 0);
  assert.equal(t.u.calls.length, 0, 'no store call either');
  // with the repository's own approvals (pending today) it is off even with every env set
  const t2 = deps({ approvals: undefined });
  assert.equal((await handleChat(ask('Szia'), t2.d)).body.reason.startsWith('off:'), true);
});

test('handle: personal data never reaches the model', async () => {
  const t = deps();
  const r = await handleChat(ask('A számom 06 30 123 4567, hívjatok vissza'), t.d);
  assert.equal(r.body.reply, FIXED.pii.hu);
  assert.equal(t.called(), 0);
  // an earlier turn counts too
  const t2 = deps();
  const body = { locale: 'en', messages: [{ role: 'user', content: 'my mail is a@b.co' }, { role: 'assistant', content: 'x' }, { role: 'user', content: 'ok?' }] };
  assert.equal((await handleChat({ origin: ORIGIN, ip: 'x', body }, t2.d)).body.reply, FIXED.pii.en);
  assert.equal(t2.called(), 0);
});

test('handle: per-visitor brake, daily cap, monthly cap, and a failing store all close without a model call', async () => {
  const t = deps({ limiter: new WindowLimiter(1, 600_000) });
  await handleChat(ask('egy'), t.d);
  assert.equal((await handleChat(ask('kettő'), t.d)).body.reason, 'rate');
  assert.equal(t.called(), 1);

  const daily = deps({ env: { ...ON, PONTMAS_CHAT_DAILY_CAP: '2' } });
  for (let i = 0; i < 2; i++) await handleChat(ask(`k${i}`, { ip: `ip${i}` }), daily.d);
  assert.equal((await handleChat(ask('k3', { ip: 'ip3' }), daily.d)).body.reason, 'cap_daily');
  assert.equal(daily.called(), 2);

  const month = deps({ env: { ...ON, PONTMAS_CHAT_MONTHLY_USD: '0.001' } }); // 1000 micro-USD: the first call (720) fits, the second not
  await handleChat(ask('a', { ip: 'a' }), month.d);
  await handleChat(ask('b', { ip: 'b' }), month.d);
  assert.equal((await handleChat(ask('c', { ip: 'c' }), month.d)).body.reason, 'cap_month');
  assert.equal(month.called(), 2);

  const broken = deps({ fetch: async () => { throw new Error('down'); } });
  const r = await handleChat(ask('x'), broken.d);
  assert.equal(r.body.reason, 'budget_store_error');
  assert.equal(broken.called(), 0);
});

test('handle: a good answer is plain text, its cost is recorded, and the log carries no text', async () => {
  const t = deps();
  const r = await handleChat(ask('Mikor lesz a titkos-kerdes-123 tábor?'), t.d);
  assert.equal(r.body.source, 'claude');
  assert.equal(r.body.reply, 'Szia! A tábor nyáron lesz.');
  assert.equal(t.u.data.get('pontmas:chat:production:usd-micro:2026-11'), 720);
  assert.equal(t.u.data.get('pontmas:chat:production:calls:2026-11-10'), 1);
  assert.equal(t.lines.length, 1);
  assert.match(t.lines[0], /^chat outcome=claude reason=ok in=2000 out=800 cache_read=12000 cache_write=0 usd_micro=720 recorded=yes ms=\d+$/);
  assert.ok(!t.lines.join('\n').includes('titkos-kerdes-123') && !t.lines.join('\n').includes('1.2.3.4'), 'neither the question nor the IP is logged');
});

test('handle: refusal, an empty answer and an API error give fixed texts; refused calls are still paid for', async () => {
  const refusal = deps({ caller: () => async () => ({ kind: 'refusal', usage: { input_tokens: 100, output_tokens: 0 } }) });
  const r = await handleChat(ask('x'), refusal.d);
  assert.equal(r.body.reply, FIXED.refusal.hu);
  assert.equal(refusal.u.data.get('pontmas:chat:production:usd-micro:2026-11'), 10);
  const empty = deps({ caller: () => async () => ({ kind: 'empty', usage: { output_tokens: 2000 } }) });
  assert.equal((await handleChat(ask('x'), empty.d)).body.reply, FIXED.error.hu);
  const apiErr = deps({ caller: () => async () => { throw Object.assign(new Error('x'), { status: 529 }); } });
  const e = await handleChat(ask('x'), apiErr.d);
  assert.equal(e.body.reply, FIXED.error.hu);
  assert.equal(e.body.reason, 'api_error:529');
});

// ---------- prompt and texts ----------

test('prompt: rules and knowledge first and cached, current items next, the language last', () => {
  const s = buildSystem('de', [{ title: 'Családi nap', date: 'jún. 6.', location: 'Skanzen', description: 'Közös nap' }], []);
  assert.equal(s.length, 3);
  assert.deepEqual(s[0].cache_control, { type: 'ephemeral' });
  assert.ok(s[0].text.startsWith(RULES) && s[0].text.includes('### Page /tamogatas') && s[0].text.includes(FOUNDATION.taxNumber));
  assert.ok(!s[1].cache_control && s[1].text.includes('Családi nap | jún. 6. | Skanzen'));
  assert.equal(s[2].text, 'Reply in German.');
  // the cached block does not depend on the language or the items
  assert.equal(buildSystem('hu', [], [])[0].text, s[0].text);
});

test('texts: every fixed text exists in the three languages, the busy and error texts give the phone', () => {
  for (const [k, v] of Object.entries(FIXED)) for (const l of ['hu', 'en', 'de']) assert.ok(v[l]?.length > 10, `${k}.${l}`);
  for (const k of ['busy', 'off', 'error']) for (const l of ['hu', 'en', 'de']) assert.ok(FIXED[k][l].includes(FOUNDATION.phone), `${k}.${l}`);
  for (const l of ['hu', 'en', 'de']) assert.ok(CRISIS_TEXT[l].includes('112') && RULES.includes(CRISIS_TEXT[l]));
  assert.equal(plainText('## Cím\n**félkövér** és *dőlt* szöveg'), 'Cím\nfélkövér és dőlt szöveg');
});

test('the endpoint as deployed today answers "off" without a network call', async () => {
  const realFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('network used'); };
  try {
    const saved = { ...process.env };
    for (const k of Object.keys(process.env)) if (k.startsWith('PONTMAS_') || k.startsWith('KV_') || k.startsWith('UPSTASH_')) delete process.env[k];
    const { POST } = await src('app/api/chat/route.ts');
    const res = await POST(new Request('https://pontmas.vercel.app/api/chat', { method: 'POST', headers: { origin: ORIGIN, 'content-type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: 'Szia' }] }) }));
    assert.equal(res.status, 200);
    const j = await res.json();
    assert.equal(j.reply, FIXED.off.hu);
    assert.equal(res.headers.get('cache-control'), 'no-store');
    Object.assign(process.env, saved);
  } finally {
    globalThis.fetch = realFetch;
  }
});

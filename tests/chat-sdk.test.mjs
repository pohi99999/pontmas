// The model call through the real @anthropic-ai/sdk, with a stand-in for the network (card c017f163):
// what goes out, and how each kind of answer comes back.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { src } from './helpers/load.mjs';

const { claudeCaller, MAX_TOKENS } = await src('lib/chat/claude.ts');
const { buildSystem } = await src('lib/chat/prompt.ts');
const { detectPii } = await src('lib/chat/pii.ts');

function fakeApi(reply) {
  const sent = [];
  const fetchFn = async (url, init) => {
    assert.equal(String(url), 'https://api.anthropic.com/v1/messages', 'only the Messages API');
    const h = new Headers(init.headers);
    // SDK 1.x sends the API key as a bearer token (measured on 1.3.0)
    assert.equal(h.get('authorization'), 'Bearer test-key-not-real');
    sent.push(JSON.parse(init.body));
    return new Response(JSON.stringify({ id: 'msg_1', type: 'message', role: 'assistant', model: 'claude-haiku-5-5', stop_details: null, usage: { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 }, ...reply }), { status: 200, headers: { 'content-type': 'application/json', 'request-id': 'req_1' } });
  };
  return { fetchFn, sent };
}

test('the request: model, max_tokens, cached system blocks, effort low, no sampling parameters', async () => {
  const api = fakeApi({ stop_reason: 'end_turn', content: [{ type: 'thinking', thinking: '', signature: 's' }, { type: 'text', text: 'Válasz.' }] });
  const r = await claudeCaller('test-key-not-real', 'claude-haiku-5-5', api.fetchFn)(buildSystem('hu', [], []), [{ role: 'user', content: 'Szia' }]);
  assert.deepEqual(r, { kind: 'text', text: 'Válasz.', usage: { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } });
  const body = api.sent[0];
  assert.equal(body.model, 'claude-haiku-5-5');
  assert.equal(body.max_tokens, MAX_TOKENS);
  assert.deepEqual(body.output_config, { effort: 'low' });
  assert.deepEqual(body.system[0].cache_control, { type: 'ephemeral' });
  assert.deepEqual(body.messages, [{ role: 'user', content: 'Szia' }]);
  for (const k of ['temperature', 'top_p', 'top_k', 'thinking']) assert.ok(!(k in body), `${k} is not sent`);
});

test('refusal and a reply cut at max_tokens are not shown as answers', async () => {
  const refused = fakeApi({ stop_reason: 'refusal', content: [] });
  assert.equal((await claudeCaller('test-key-not-real', 'claude-haiku-5-5', refused.fetchFn)(buildSystem('hu', [], []), [{ role: 'user', content: 'x' }])).kind, 'refusal');
  const cut = fakeApi({ stop_reason: 'max_tokens', content: [{ type: 'text', text: 'félbe' }] });
  assert.equal((await claudeCaller('test-key-not-real', 'claude-haiku-5-5', cut.fetchFn)(buildSystem('hu', [], []), [{ role: 'user', content: 'x' }])).kind, 'empty');
});

test('the evaluation set: 30 questions, the two personal-data ones are stopped by the guard, no other is', () => {
  const q = JSON.parse(fs.readFileSync(path.resolve('tests/chat-eval/questions.json'), 'utf8'));
  assert.equal(q.length, 30);
  assert.deepEqual(q.filter((x) => detectPii(x.q).length).map((x) => x.id), [20, 21]);
  for (const x of q) assert.ok(['hu', 'en', 'de'].includes(x.locale) && x.expect.length > 5, `#${x.id}`);
});

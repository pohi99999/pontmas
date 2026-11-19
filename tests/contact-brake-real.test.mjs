// The contact form's brake with REAL timers (Ellenőr 8187, Marveen 8202). Mocked time cannot show it: a
// real timer may fire a millisecond before Date.now() says the message is a full window old, and the
// address then stayed in memory for good. Here the same code (createBrake) runs with a 300 ms window
// behind a real HTTP handler that does what the route does, with real time.
import './helpers/load.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { src } from './helpers/load.mjs';

const { createBrake } = await src('lib/contactBrake.ts');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

test('real timers, a 300 ms window, 600 addresses with one message each and nothing after: none is held once the window has passed', async () => {
  const WINDOW = 300;
  const brake = createBrake({ windowMs: WINDOW, max: 5 });
  // What the route does: the first address of x-forwarded-for, then the brake.
  const server = http.createServer((req, res) => {
    const ip = String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() || 'unknown';
    res.writeHead(brake.limited(ip) ? 429 : 200);
    res.end('{}');
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  const ips = Array.from({ length: 600 }, (_, i) => `198.18.${Math.floor(i / 250)}.${i % 250}`);
  try {
    for (const ip of ips) {
      const r = await fetch(`http://127.0.0.1:${port}/`, { method: 'POST', headers: { 'x-forwarded-for': ip } });
      assert.equal(r.status, 200);
      await r.arrayBuffer();
      await sleep(Math.floor(Math.random() * 4));
    }
  } finally {
    server.close();
    server.closeAllConnections?.();
  }
  // Right after the last message it is held: the test would pass for a brake that holds nothing.
  assert.equal(brake.holds(ips.at(-1)), true, 'the last address is held right after its message');
  await sleep(WINDOW + 700);
  const held = ips.filter((ip) => brake.holds(ip));
  assert.deepEqual(held, [], `${held.length} of ${ips.length} addresses still held after the window`);
});

test('the brake\'s timers do not keep the process alive: a process that used the 10-minute brake exits on its own', () => {
  const load = fileURLToPath(new URL('./helpers/load.mjs', import.meta.url));
  const code = `const { src } = await import(${JSON.stringify(load)}); const b = await src('lib/contactBrake.ts'); b.limited('192.0.2.200'); b.limited('192.0.2.201');`;
  const started = Date.now();
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', code], { timeout: 8000, encoding: 'utf8' });
  const took = Date.now() - started;
  assert.equal(r.error?.code, undefined, `the process did not exit by itself within 8 s (${r.error?.code}): a timer keeps it alive`);
  assert.equal(r.status, 0, r.stderr);
  assert.ok(took < 8000, `took ${took} ms`);
});

// How long the contact form's brake keeps an address (Ellenőr 8180, Marveen 8185). The data notice
// (/adatkezeles) says: the sender's IP address is kept in memory for at most 10 minutes. Before this
// change an address that never came back stayed in memory for good (measured: still there after 11, 60
// and 600 minutes). Time is mocked, Date and the timers together; each test uses addresses of its own.
import './helpers/load.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { src } from './helpers/load.mjs';

const { limited, holds, WINDOW_MS, MAX } = await src('lib/contactBrake.ts');
const clock = (t) => t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.UTC(2026, 10, 19, 12, 0, 0) });

test('one message, no other traffic: the address is held for the window and gone 10 minutes after it', (t) => {
  clock(t);
  assert.equal(limited('192.0.2.1'), false);
  assert.equal(holds('192.0.2.1'), true, 'held right after the message');
  t.mock.timers.tick(WINDOW_MS - 1);
  assert.equal(holds('192.0.2.1'), true, 'still held one millisecond before 10 minutes');
  t.mock.timers.tick(1);
  assert.equal(holds('192.0.2.1'), false, 'gone at 10 minutes, with no request in between');
});

test('the address is gone 10 minutes after its LAST counted message', (t) => {
  clock(t);
  limited('192.0.2.2');
  t.mock.timers.tick(4 * 60_000);
  limited('192.0.2.2');
  t.mock.timers.tick(WINDOW_MS - 1);
  assert.equal(holds('192.0.2.2'), true, 'the second message is not 10 minutes old yet');
  t.mock.timers.tick(1);
  assert.equal(holds('192.0.2.2'), false, 'gone 10 minutes after the second message');
});

test('a refused message does not keep the address longer (Ellenőr gap A)', (t) => {
  clock(t);
  for (let i = 0; i < MAX; i++) assert.equal(limited('192.0.2.3'), false, `message ${i + 1} counted`);
  t.mock.timers.tick(9 * 60_000);
  assert.equal(limited('192.0.2.3'), true, 'refused at 9 minutes');
  t.mock.timers.tick(60_000);
  assert.equal(holds('192.0.2.3'), false, 'gone at 10 minutes after the counted ones, the refused one added nothing');
  assert.equal(limited('192.0.2.3'), false, 'and it may send again');
});

test('an address seen again after its window starts fresh, it is not refused for the old messages', (t) => {
  clock(t);
  for (let i = 0; i < MAX; i++) limited('192.0.2.4');
  assert.equal(limited('192.0.2.4'), true);
  t.mock.timers.tick(WINDOW_MS);
  for (let i = 0; i < MAX; i++) assert.equal(limited('192.0.2.4'), false, `message ${i + 1} of the new window`);
  assert.equal(limited('192.0.2.4'), true);
});

test('many addresses that never come back are all gone after 10 minutes', (t) => {
  clock(t);
  for (let i = 0; i < 300; i++) limited(`198.51.100.${i % 250}-${i}`);
  t.mock.timers.tick(WINDOW_MS);
  const left = Array.from({ length: 300 }, (_, i) => `198.51.100.${i % 250}-${i}`).filter(holds);
  assert.deepEqual(left, []);
});

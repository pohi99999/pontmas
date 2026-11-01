// Button colours (2026-11-01): the className a page passes must override the variant's colours.
// Before, the classes were only concatenated, so "bg-white text-blue-700" on a primary button kept
// the variant's text-white as well, and seven buttons rendered white text on a white background.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { buttonClasses } from '../src/components/ui/buttonClasses.ts';

// plain (unprefixed) text-/bg- colour utilities, e.g. text-white, bg-slate-900, bg-white/10
const colours = (cls, kind) => cls.split(/\s+/).filter((c) => new RegExp(`^${kind}-(white|black|transparent|[a-z]+-\\d{2,3})(/\\d+)?$`).test(c));

test('a className colour replaces the variant colour instead of competing with it', () => {
  const cls = buttonClasses({ variant: 'secondary', className: 'bg-white text-slate-900 hover:bg-slate-100 border-0' });
  assert.deepEqual(colours(cls, 'text'), ['text-slate-900']);
  assert.deepEqual(colours(cls, 'bg'), ['bg-white']);
});

// Every <Button ... className="..."> in the pages: after merging, exactly one text colour and at most
// one background colour may remain, and never white text on a white background.
const usages = fs.readdirSync(path.resolve('src/app'), { recursive: true })
  .filter((f) => f.endsWith('.tsx'))
  .flatMap((f) => {
    const src = fs.readFileSync(path.join('src/app', f), 'utf8');
    return [...src.matchAll(/<Button\b([^>]*?)className="([^"]*)"/gs)].map((m) => ({
      where: f,
      variant: (m[1].match(/variant="(\w+)"/) || [, 'primary'])[1],
      className: m[2],
    }));
  });

test('every page Button with a className resolves to one colour pair', () => {
  assert.ok(usages.length >= 7, `expected the known overrides, found ${usages.length}`);
  for (const u of usages) {
    const cls = buttonClasses({ variant: u.variant, className: u.className });
    const text = colours(cls, 'text'), bg = colours(cls, 'bg');
    assert.equal(text.length, 1, `${u.where} "${u.className}": text colours ${text}`);
    assert.ok(bg.length <= 1, `${u.where} "${u.className}": background colours ${bg}`);
    const light = ['text-white', 'text-slate-50', 'text-slate-100', 'text-slate-200'];
    assert.ok(!(light.includes(text[0]) && bg[0] === 'bg-white'), `${u.where}: light text on a white button`);
  }
});

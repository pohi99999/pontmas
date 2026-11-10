// The NAV figure in the home page's 1% band (Marveen 6931, 6994): the values as measured in the NAV's 2026
// list, the sentence as agreed (the OFFERED amount: "ajánlott fel"), the source visible under it, and the
// hyphenated words kept whole.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { EGYSZAZALEK, forint } from '../src/content/egyszazalek.ts';

const figure = () => {
  const page = fs.readFileSync('src/app/page.tsx', 'utf8');
  return page.slice(page.indexOf('<figure'), page.indexOf('</figure>'));
};

test('the values are the NAV 2026 row of the foundation', () => {
  assert.equal(EGYSZAZALEK.ev, 2026);
  assert.equal(EGYSZAZALEK.osszeg, 822407);
  assert.equal(EGYSZAZALEK.felajanlok, 77);
  assert.equal(EGYSZAZALEK.kozzeteve, '2026.09.15.');
  assert.ok(EGYSZAZALEK.evben.startsWith(String(EGYSZAZALEK.ev) + '-'), 'the suffixed year is the same year');
  const src = fs.readFileSync('src/content/egyszazalek.ts', 'utf8');
  assert.match(src, /https:\/\/nav\.gov\.hu\/\S*egyszaz_kiut_2026\S*/, 'the source URL is in the file');
});

test('the amount never breaks across lines', () => {
  assert.equal(forint(822407), '822 407 Ft');
  assert.equal(forint(1234567), '1 234 567 Ft');
  assert.equal(forint(999), '999 Ft');
});

test('the sentence reads as agreed (offered, not paid), and the source is shown', () => {
  const fig = figure();
  const p = fig.slice(fig.indexOf('<p'), fig.indexOf('</p>'));
  const text = p
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\{EGYSZAZALEK\.evben\}/g, EGYSZAZALEK.evben)
    .replace(/\{EGYSZAZALEK\.felajanlok\}/g, String(EGYSZAZALEK.felajanlok))
    .replace(/\{forint\(EGYSZAZALEK\.osszeg\)\}/g, forint(EGYSZAZALEK.osszeg).replace(/ /g, ' '))
    .replace(/\{' '\}/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  assert.equal(text, '2026-ban 77 adózó összesen 822 407 Ft-ot ajánlott fel 1%-ából a vasi autista gyermekek és családjaik támogatására.');
  assert.doesNotMatch(text, /támogatta/, 'the NAV figure is offered, not paid');
  assert.match(fig, /<figcaption[^>]*>Forrás: NAV, \{EGYSZAZALEK\.kozzeteve\}<\/figcaption>/);
});

test('every word with a hyphenated suffix is kept whole', () => {
  const fig = figure();
  assert.match(fig, /<strong className="[^"]*whitespace-nowrap[^"]*">\{forint\(EGYSZAZALEK\.osszeg\)\}-ot<\/strong>/);
  assert.match(fig, /<span className="whitespace-nowrap">\{EGYSZAZALEK\.evben\}<\/span>/);
  assert.match(fig, /<span className="whitespace-nowrap">1%-ából<\/span>/);
});

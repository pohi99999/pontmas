// The Hungarian texts after the i18n extraction (card c017f163): the visible text of a page is now its
// source plus its keys in messages/hu.json. Tests that look for a text read both, so their meaning does
// not change when a string moves into the message file.
import fs from 'node:fs';
import path from 'node:path';

const flatten = (v) => (typeof v === 'string' ? [v] : v && typeof v === 'object' ? Object.values(v).flatMap(flatten) : []);

export const HU_MESSAGES = JSON.parse(fs.readFileSync(path.resolve('messages/hu.json'), 'utf8'));
/** Every Hungarian string in the message file. */
export const HU_VALUES = flatten(HU_MESSAGES);
export const HU_TEXT = HU_VALUES.join('\n');

/** A source file's text plus the Hungarian messages: what a "the page says X" check should search. */
export function readWithMessages(rel) {
  return `${fs.readFileSync(path.resolve(rel), 'utf8')}\n${HU_TEXT}`;
}

/** A page's source plus only its own namespaces of messages/hu.json: a text found here is this page's. */
export function readWithNamespaces(rel, ...namespaces) {
  return [fs.readFileSync(path.resolve(rel), 'utf8'), ...namespaces.flatMap((ns) => flatten(HU_MESSAGES[ns] ?? {}))].join('\n');
}

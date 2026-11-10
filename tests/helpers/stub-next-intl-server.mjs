// next-intl/server outside a Next server: the request's language is whatever setRequestLocale set
// (Hungarian by default), and the messages come from messages/<locale>.json, as src/i18n/request.ts does.
import fs from 'node:fs';
import path from 'node:path';
import { createTranslator } from 'use-intl/core';

let current = 'hu';
const messagesOf = (locale) => JSON.parse(fs.readFileSync(path.resolve(`messages/${locale}.json`), 'utf8'));

export function setRequestLocale(locale) {
  current = locale;
}
export async function getLocale() {
  return current;
}
export async function getMessages(opts) {
  return messagesOf(opts?.locale ?? current);
}
export async function getTranslations(arg) {
  const { locale = current, namespace } = typeof arg === 'string' || arg === undefined ? { namespace: arg } : arg;
  return createTranslator({ locale, messages: messagesOf(locale), namespace });
}
export function getRequestConfig(fn) {
  return fn;
}

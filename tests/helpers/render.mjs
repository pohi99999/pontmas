// Renders a page or component of the site to static HTML and to its visible text, for tests that
// check what a visitor sees rather than how the source spells it. Async server pages are awaited with
// their route params; everything renders inside the language provider, as under src/app/[locale].
import fs from 'node:fs';
import path from 'node:path';
import { src } from './load.mjs';

const { renderToStaticMarkup } = await import('react-dom/server');
const { createElement: h } = await import('react');
const { NextIntlClientProvider } = await import('next-intl');
const intlServer = await import('./stub-next-intl-server.mjs');

const messagesOf = (locale) => JSON.parse(fs.readFileSync(path.resolve(`messages/${locale}.json`), 'utf8'));

/** One element inside the language provider (a component that uses the locale-aware Link needs it). */
export function renderElement(el, locale = 'hu') {
  return renderToStaticMarkup(h(NextIntlClientProvider, { locale, messages: messagesOf(locale), timeZone: 'Europe/Budapest' }, el));
}

export async function renderHtml(p, props = {}, locale = 'hu') {
  intlServer.setRequestLocale(locale);
  const f = (await src(p)).default;
  const all = { params: Promise.resolve({ locale }), ...props };
  const el = f.constructor.name === 'AsyncFunction' ? await f(all) : h(f, all);
  return renderElement(el, locale);
}

/** The text a visitor reads: tags out, entities decoded, whitespace collapsed. */
export function visibleText(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

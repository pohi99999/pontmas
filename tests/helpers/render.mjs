// Renders a page or component of the site to static HTML and to its visible text, for tests that
// check what a visitor sees rather than how the source spells it. Async server pages are awaited;
// client components ("use client", hooks) are rendered as elements.
import { src } from './load.mjs';

const { renderToStaticMarkup } = await import('react-dom/server');
const { createElement: h } = await import('react');

export async function renderHtml(p, props = {}) {
  const f = (await src(p)).default;
  return renderToStaticMarkup(f.constructor.name === 'AsyncFunction' ? await f(props) : h(f, props));
}

/** The text a visitor reads: tags out, entities decoded, whitespace collapsed. */
export function visibleText(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

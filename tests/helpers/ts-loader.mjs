// Module hooks for the editor tests: lets node:test load the site's .ts/.tsx modules the way Next
// does (the "@/" alias, imports without an extension, JSX), by transpiling them with the
// TypeScript compiler already in devDependencies. These modules are replaced:
// - next/cache: a pass-through (unstable_cache needs a running Next server);
// - next/link, next/image: the real component, unwrapped from its CommonJS default export;
// - next/navigation: the hooks answer as on "/" with no query string (stub-next-navigation.mjs);
// - next/server: the real module, unwrapped from its CommonJS export (stub-next-server.mjs);
// - next-intl/server: the language and messages without a request (stub-next-intl-server.mjs);
// - next/font/*: a class name and a CSS variable (stub-next-font.mjs); a .css import: an empty module;
// - @vercel/blob: a module that throws when loaded, so no test can reach the real service.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const ROOT = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
const SRC = path.join(ROOT, 'src');
const here = (f) => pathToFileURL(path.join(ROOT, 'tests', 'helpers', f)).href;
const STUBS = {
  'next/cache': here('stub-next-cache.mjs'),
  'next/link': here('stub-next-link.mjs'),
  'next/image': here('stub-next-image.mjs'),
  'next/navigation': here('stub-next-navigation.mjs'),
  'next/server': here('stub-next-server.mjs'),
  'next-intl/server': here('stub-next-intl-server.mjs'),
  'next/font/google': here('stub-next-font.mjs'),
  'next/font/local': here('stub-next-font.mjs'),
  '@vercel/blob': here('stub-vercel-blob.mjs'),
};
const EXTS = ['', '.ts', '.tsx', '/index.ts', '/index.tsx'];

function findFile(base) {
  for (const e of EXTS) {
    const f = base + e;
    if (fs.existsSync(f) && fs.statSync(f).isFile()) return f;
  }
  return null;
}

export async function resolve(specifier, context, next) {
  if (STUBS[specifier]) return { url: STUBS[specifier], shortCircuit: true };
  // a stylesheet import (the page frame imports globals.css) is an empty module in a test
  if (specifier.endsWith('.css')) return { url: 'data:text/javascript,export default {}', shortCircuit: true };
  let base = null;
  if (specifier.startsWith('@/')) base = path.join(SRC, specifier.slice(2));
  else if ((specifier.startsWith('./') || specifier.startsWith('../')) && context.parentURL?.startsWith('file:')) {
    const parent = fileURLToPath(context.parentURL);
    if (parent.startsWith(ROOT) && !parent.includes(`${path.sep}node_modules${path.sep}`)) base = path.resolve(path.dirname(parent), specifier);
  }
  if (base) {
    const f = findFile(base);
    if (f) return { url: pathToFileURL(f).href, shortCircuit: true };
  }
  return next(specifier, context);
}

export async function load(url, context, next) {
  if (url.startsWith('file:') && /\.tsx?$/.test(url)) {
    const file = fileURLToPath(url);
    if (file.startsWith(ROOT) && !file.includes(`${path.sep}node_modules${path.sep}`)) {
      const out = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
        fileName: file,
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
      });
      return { format: 'module', source: out.outputText, shortCircuit: true };
    }
  }
  return next(url, context);
}

// Registers ts-loader.mjs; import this first, then load the site's modules with `await import()`.
import { register } from 'node:module';
register('./ts-loader.mjs', import.meta.url);

export const src = (p) => import(new URL(`../../src/${p}`, import.meta.url).href);

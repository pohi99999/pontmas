// The real next/link, unwrapped from its CommonJS default export.
import mod from 'next/dist/client/link.js';
export default mod.default ?? mod;

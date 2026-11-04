// Shared helpers of the editor tests. Every secret is generated at runtime; the addresses are on
// example.org, so nothing here can reach a real person or service.
import { randomBytes } from 'node:crypto';

export const NOW = Date.UTC(2026, 10, 4, 9, 0, 0);
export const SITE = 'https://pontmas.example.org';
export const EDITOR = 'szerkeszto@example.org';
export const OTHER_EDITOR = 'masik@example.org';
export const STRANGER = 'idegen@example.org';
export const NOTIFY_TO = 'ertesites@example.org';

export function makeEnv(over = {}) {
  return {
    EDITOR_EMAILS: `${EDITOR}, ${OTHER_EDITOR}`,
    EDITOR_SESSION_SECRET: randomBytes(32).toString('hex'),
    EDITOR_NOTIFY_TO: NOTIFY_TO,
    RESEND_API_KEY: randomBytes(16).toString('hex'),
    CONTACT_FROM: 'PontMás <urlap@example.org>',
    ...over,
  };
}

/** A fetch that records every mail; `mode` 'ok' | 'error' | 'throw'. */
export function fakeMailer(mode = 'ok') {
  const mails = [];
  const fn = async (url, init) => {
    if (mode === 'throw') throw new Error('network down');
    mails.push({ url, body: JSON.parse(init.body) });
    return mode === 'ok'
      ? { ok: true, status: 200, json: async () => ({ id: `m${mails.length}` }) }
      : { ok: false, status: 500, json: async () => ({}) };
  };
  return { fn, mails };
}

// ---- image bytes built at runtime (no image file in the repository)
const seg = (marker, payload) => [0xff, marker, (payload.length + 2) >> 8, (payload.length + 2) & 255, ...payload];
const bytes = (s) => [...Buffer.from(s, 'latin1')];

export function jpeg({ width = 800, height = 600, exif = false, pad = 0 } = {}) {
  const app0 = seg(0xe0, [...bytes('JFIF\0'), 1, 1, 0, 0, 1, 0, 1, 0, 0]);
  const app1 = seg(0xe1, [...bytes('Exif\0\0MM\0*'), ...bytes('GPS 47.23N 16.62E')]);
  const sof = seg(0xc0, [8, height >> 8, height & 255, width >> 8, width & 255, 3, 1, 0x22, 0, 2, 0x11, 1, 3, 0x11, 1]);
  const sos = seg(0xda, [3, 1, 0, 2, 0x11, 3, 0x11, 0, 63, 0]);
  const head = [0xff, 0xd8, ...app0, ...(exif ? app1 : []), ...sof, ...sos];
  const out = new Uint8Array(head.length + pad + 3);
  out.set(head);
  out.set([0x00, 0xff, 0xd9], head.length + pad);
  return out;
}

export function png({ width = 640, height = 480, exif = false } = {}) {
  const u32 = (n) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
  const chunk = (type, data) => [...u32(data.length), ...bytes(type), ...data, 0, 0, 0, 0];
  return Uint8Array.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ...chunk('IHDR', [...u32(width), ...u32(height), 8, 6, 0, 0, 0]),
    ...(exif ? chunk('eXIf', bytes('MM\0*GPS')) : []),
    ...chunk('IEND', []),
  ]);
}

export function webp({ width = 1200, height = 900 } = {}) {
  const u24 = (n) => [n & 255, (n >> 8) & 255, (n >> 16) & 255];
  const vp8x = [...bytes('VP8X'), 10, 0, 0, 0, 0, 0, 0, 0, ...u24(width - 1), ...u24(height - 1)];
  const size = 4 + vp8x.length;
  return Uint8Array.from([...bytes('RIFF'), size & 255, (size >> 8) & 255, 0, 0, ...bytes('WEBP'), ...vp8x]);
}

/** A valid image object as the editor would send it. */
export function imageFor(store, { declared = true } = {}) {
  const url = `https://teszt-tarolo.public.blob.vercel-storage.com/media/${randomBytes(18).toString('base64url')}.jpg`;
  store?.files?.set(url, { bytes: jpeg(), contentType: 'image/jpeg' });
  return {
    url, alt: 'Közös kézműves foglalkozás', width: 800, height: 600,
    ...(declared ? { childPhotoDeclaration: { declaredBy: EDITOR, at: '2026-11-04T09:00:00.000Z' } } : {}),
  };
}

export function htmlText(html) {
  return html
    .replace(/<[^>]+>/g, '\n')
    .replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

/** Asserts that every string appears in `text`, in this order. */
export function inOrder(assert, text, strings) {
  let at = 0;
  for (const s of strings) {
    const i = text.indexOf(s, at);
    assert.ok(i >= 0, `missing or out of order: ${s.slice(0, 60)}`);
    at = i + s.length;
  }
}

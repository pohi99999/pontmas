// Server-side checks of an uploaded image, on the bytes themselves (never the name or the claimed
// type): which format the first bytes say, the pixel size from the header, and whether a metadata
// block (EXIF, which can hold GPS coordinates, or XMP) is still inside. The editor redraws every
// photo on a canvas, which leaves no such block; a file that still has one did not come through
// the editor and is refused.
import type { ImageExt } from '../content/store';

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const MAX_SIDE = 1600;

export type ImageKind = { ext: ImageExt; contentType: 'image/jpeg' | 'image/png' | 'image/webp' };

const ascii = (b: Uint8Array, at: number, len: number) => String.fromCharCode(...b.subarray(at, at + len));

export function sniffImage(b: Uint8Array): ImageKind | null {
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { ext: 'jpg', contentType: 'image/jpeg' };
  if (b.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((v, i) => b[i] === v)) return { ext: 'png', contentType: 'image/png' };
  if (b.length >= 12 && ascii(b, 0, 4) === 'RIFF' && ascii(b, 8, 4) === 'WEBP') return { ext: 'webp', contentType: 'image/webp' };
  return null;
}

const u16be = (b: Uint8Array, i: number) => (b[i] << 8) | b[i + 1];
const u32be = (b: Uint8Array, i: number) => ((b[i] << 24) >>> 0) + (b[i + 1] << 16) + (b[i + 2] << 8) + b[i + 3];
const u24le = (b: Uint8Array, i: number) => b[i] | (b[i + 1] << 8) | (b[i + 2] << 16);
const u32le = (b: Uint8Array, i: number) => (b[i] | (b[i + 1] << 8) | (b[i + 2] << 16) | (b[i + 3] << 24)) >>> 0;

interface Inspection {
  width: number;
  height: number;
  metadata: boolean;
}

function inspectJpeg(b: Uint8Array): Inspection | null {
  let i = 2, width = 0, height = 0, metadata = false;
  while (i + 4 <= b.length) {
    if (b[i] !== 0xff) return null;
    const marker = b[i + 1];
    if (marker === 0xff) { i++; continue; }
    if (marker === 0xd9 || marker === 0xda) break; // end of image, start of scan
    if (marker >= 0xd0 && marker <= 0xd7) { i += 2; continue; }
    const len = u16be(b, i + 2);
    if (len < 2 || i + 2 + len > b.length) return null;
    // APP1 holds EXIF (and GPS) or XMP; APP13 holds Photoshop/IPTC data
    if (marker === 0xe1 || marker === 0xed) metadata = true;
    const sof = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (sof && len >= 7) { height = u16be(b, i + 5); width = u16be(b, i + 7); }
    i += 2 + len;
  }
  return width && height ? { width, height, metadata } : null;
}

function inspectPng(b: Uint8Array): Inspection | null {
  if (b.length < 33 || ascii(b, 12, 4) !== 'IHDR') return null;
  const width = u32be(b, 16), height = u32be(b, 20);
  let metadata = false;
  for (let i = 8; i + 12 <= b.length;) {
    const len = u32be(b, i), type = ascii(b, i + 4, 4);
    if (type === 'eXIf' || type === 'iTXt' || type === 'tEXt' || type === 'zTXt') metadata = true;
    if (type === 'IEND') break;
    i += 12 + len;
  }
  return width && height ? { width, height, metadata } : null;
}

function inspectWebp(b: Uint8Array): Inspection | null {
  let width = 0, height = 0, metadata = false;
  for (let i = 12; i + 8 <= b.length;) {
    const type = ascii(b, i, 4), len = u32le(b, i + 4), d = i + 8;
    if (type === 'EXIF' || type === 'XMP ') metadata = true;
    if (type === 'VP8X' && len >= 10) { width = 1 + u24le(b, d + 4); height = 1 + u24le(b, d + 7); }
    if (type === 'VP8 ' && len >= 10 && !width) { width = (b[d + 6] | (b[d + 7] << 8)) & 0x3fff; height = (b[d + 8] | (b[d + 9] << 8)) & 0x3fff; }
    if (type === 'VP8L' && len >= 5 && !width) {
      const b0 = b[d + 1], b1 = b[d + 2], b2 = b[d + 3], b3 = b[d + 4];
      width = 1 + (((b1 & 0x3f) << 8) | b0);
      height = 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
    }
    i = d + len + (len % 2);
  }
  return width && height ? { width, height, metadata } : null;
}

export type ImageCheck =
  | { ok: true; kind: ImageKind; width: number; height: number }
  | { ok: false; status: 413 | 415 | 422; error: 'too_large' | 'not_an_image' | 'unreadable' | 'too_big_dimensions' | 'has_metadata' };

export function checkImage(b: Uint8Array): ImageCheck {
  if (b.length > MAX_UPLOAD_BYTES) return { ok: false, status: 413, error: 'too_large' };
  const kind = sniffImage(b);
  if (!kind) return { ok: false, status: 415, error: 'not_an_image' };
  const info = kind.ext === 'jpg' ? inspectJpeg(b) : kind.ext === 'png' ? inspectPng(b) : inspectWebp(b);
  if (!info) return { ok: false, status: 422, error: 'unreadable' };
  if (Math.max(info.width, info.height) > MAX_SIDE) return { ok: false, status: 422, error: 'too_big_dimensions' };
  if (info.metadata) return { ok: false, status: 422, error: 'has_metadata' };
  return { ok: true, kind, width: info.width, height: info.height };
}

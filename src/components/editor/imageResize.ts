// Runs in the editor's browser before an upload. Every photo is redrawn on a canvas at most
// 1600 px on its long side and saved as a new JPEG. The new file holds only the pixels: the EXIF
// block of the original (camera data and GPS coordinates) is not copied. The server refuses a file
// that still has such a block (src/lib/imageCheck.ts).
export const MAX_SIDE = 1600;
export const MAX_BYTES = 5 * 1024 * 1024;

async function decode(file: Blob): Promise<{ source: CanvasImageSource; width: number; height: number; done: () => void }> {
  try {
    // honours the orientation of phone photos
    const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
    return { source: bmp, width: bmp.width, height: bmp.height, done: () => bmp.close() };
  } catch {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    await img.decode();
    return { source: img, width: img.naturalWidth, height: img.naturalHeight, done: () => URL.revokeObjectURL(url) };
  }
}

export async function resizeForUpload(file: Blob, maxSide = MAX_SIDE): Promise<{ blob: Blob; width: number; height: number }> {
  const img = await decode(file);
  try {
    const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
    const width = Math.max(1, Math.round(img.width * scale));
    const height = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('no canvas');
    ctx.fillStyle = '#ffffff'; // a transparent PNG gets a white background in the JPEG
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img.source, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85));
    if (!blob) throw new Error('encode failed');
    return { blob, width, height };
  } finally {
    img.done();
  }
}

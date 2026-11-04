import { handleUpload } from '@/lib/editorApi';
import { editorDeps } from '@/lib/editorServer';

// POST the image bytes as the body (the editor has already resized it); answers { url, width, height }.
export async function POST(request: Request) {
  return handleUpload(request, await editorDeps());
}

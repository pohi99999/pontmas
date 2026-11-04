import { handleContentGet, handleContentPut } from '@/lib/editorApi';
import { editorDeps } from '@/lib/editorServer';

// GET: the content and its history for the editor. PUT { base, content } or { base, restore }.
export async function GET(request: Request) {
  return handleContentGet(request, await editorDeps());
}

export async function PUT(request: Request) {
  return handleContentPut(request, await editorDeps());
}

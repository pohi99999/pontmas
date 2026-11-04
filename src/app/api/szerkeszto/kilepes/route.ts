import { handleLogout } from '@/lib/editorApi';
import { editorDeps } from '@/lib/editorServer';

export async function POST(request: Request) {
  return handleLogout(request, await editorDeps());
}

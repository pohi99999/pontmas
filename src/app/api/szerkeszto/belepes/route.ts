import { handleRedeem } from '@/lib/editorApi';
import { editorDeps } from '@/lib/editorServer';

// POST { token }: the "Belépés" button of the link page; sets the session cookie.
export async function POST(request: Request) {
  return handleRedeem(request, await editorDeps());
}

import { handleLogin } from '@/lib/editorApi';
import { editorDeps } from '@/lib/editorServer';

// POST { email }: mails a login link if the address is allowed; the same answer either way.
export async function POST(request: Request) {
  return handleLogin(request, await editorDeps());
}

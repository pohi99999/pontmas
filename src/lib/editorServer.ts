// Wires the editor API (editorApi.ts) to the real services: the environment, the Blob store,
// fetch for Resend, next/cache revalidation and next/server after(). Only the route files import it.
import { revalidatePath, revalidateTag } from 'next/cache';
import { after } from 'next/server';
import { createContentStore } from '@/content/createStore';
import { CONTENT_TAG } from '@/content/types';
import { createEditorLimiters, type EditorDeps } from './editorApi';

// in memory, so per server instance (see rateLimit.ts)
const limiters = createEditorLimiters();
const usedTokens = new Map<string, number>();

export async function editorDeps(): Promise<EditorDeps> {
  const env = process.env;
  return {
    env: {
      EDITOR_EMAILS: env.EDITOR_EMAILS,
      EDITOR_SESSION_SECRET: env.EDITOR_SESSION_SECRET,
      EDITOR_NOTIFY_TO: env.EDITOR_NOTIFY_TO,
      RESEND_API_KEY: env.RESEND_API_KEY,
      CONTACT_FROM: env.CONTACT_FROM,
    },
    store: await createContentStore({
      BLOB_CONTENT_READ_WRITE_TOKEN: env.BLOB_CONTENT_READ_WRITE_TOKEN,
      BLOB_READ_WRITE_TOKEN: env.BLOB_READ_WRITE_TOKEN,
    }),
    fetchFn: fetch,
    now: () => new Date(),
    limiters,
    usedTokens,
    revalidate: () => {
      revalidateTag(CONTENT_TAG, { expire: 0 });
      revalidatePath('/hirek');
      revalidatePath('/programok');
    },
    defer: (task) => after(task),
    log: (msg) => console.warn(msg),
  };
}

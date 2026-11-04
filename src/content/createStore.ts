// Picks the store from the environment. Without BLOB_CONTENT_READ_WRITE_TOKEN (the PRIVATE store of the
// content and its history) there is no store (null): the public pages show the seed and the editor says
// that saving is not available. BLOB_READ_WRITE_TOKEN (the PUBLIC store of the images) is optional for
// the content itself: without it the pages and the editor work, only photo uploads are refused.
import type { ContentStore } from './store';

export interface StoreEnv {
  BLOB_CONTENT_READ_WRITE_TOKEN?: string;
  BLOB_READ_WRITE_TOKEN?: string;
}

export async function createContentStore(env: StoreEnv): Promise<ContentStore | null> {
  const content = env.BLOB_CONTENT_READ_WRITE_TOKEN?.trim();
  if (!content) return null;
  const media = env.BLOB_READ_WRITE_TOKEN?.trim() || undefined;
  const [{ blobApi }, { BlobContentStore }] = await Promise.all([import('./blobApi'), import('./blobStore')]);
  return new BlobContentStore(blobApi, { content, media });
}

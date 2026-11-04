// Picks the store from the environment. Without BLOB_READ_WRITE_TOKEN there is no store (null):
// the public pages show the seed and the editor says that saving is not available.
import type { ContentStore } from './store';

export async function createContentStore(env: { BLOB_READ_WRITE_TOKEN?: string }): Promise<ContentStore | null> {
  const token = env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) return null;
  const [{ blobApi }, { BlobContentStore }] = await Promise.all([import('./blobApi'), import('./blobStore')]);
  return new BlobContentStore(blobApi, token);
}

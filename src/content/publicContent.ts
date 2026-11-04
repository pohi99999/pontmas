// The public pages read the content through here: cached under CONTENT_TAG, revalidated by the
// save route. A failed read throws inside the cached function, so a failure is never cached; the
// page then shows the seed, and the next render tries the store again.
import { unstable_cache } from 'next/cache';
import { createContentStore } from './createStore';
import { readContentSafely } from './public';
import { CONTENT_TAG } from './types';

const readCached = unstable_cache(
  async (configured: boolean) => {
    if (!configured) return null;
    const store = await createContentStore({
      BLOB_CONTENT_READ_WRITE_TOKEN: process.env.BLOB_CONTENT_READ_WRITE_TOKEN,
      BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return store ? await store.read() : null;
  },
  ['site-content-v1'],
  { tags: [CONTENT_TAG] },
);

export function getPublicContent() {
  const configured = !!process.env.BLOB_CONTENT_READ_WRITE_TOKEN?.trim();
  return readContentSafely(() => readCached(configured));
}

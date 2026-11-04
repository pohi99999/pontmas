// The only module that loads @vercel/blob. createContentStore() imports it on demand, and only
// when BLOB_CONTENT_READ_WRITE_TOKEN is set, so the tests (which use fakes) never load it.
import { del, get, head, list, put } from '@vercel/blob';
import type { BlobApi } from './blobStore';

export const blobApi: BlobApi = {
  put: (pathname, body, options) => put(pathname, body instanceof Uint8Array ? Buffer.from(body) : body, options),
  get: async (pathname, options) => {
    const res = await get(pathname, options);
    return res ? { statusCode: res.statusCode, stream: res.stream } : null;
  },
  list: (options) => list(options),
  del: (urlOrPathname, options) => del(urlOrPathname, options),
  head: (urlOrPathname, options) => head(urlOrPathname, options),
};

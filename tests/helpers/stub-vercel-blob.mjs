// The tests must never reach Vercel Blob. Loading this module is a test failure.
const no = () => { throw new Error('@vercel/blob was loaded in a test'); };
export const put = no, get = no, list = no, del = no, head = no;
no();

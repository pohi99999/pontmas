// next/navigation outside a Next server: the hooks the site uses, answering as on the home page
// with no query string, so a page that reads them (the contact form, the header) can be rendered.
export const useSearchParams = () => new URLSearchParams();
export const usePathname = () => '/';
export const useRouter = () => ({ push() {}, replace() {}, refresh() {}, back() {}, prefetch() {} });
// next-intl's navigation and the [locale] pages also import these; in a test they only throw, like
// Next does when a render is cut short.
export const notFound = () => { throw new Error('NEXT_NOT_FOUND'); };
export const redirect = (url) => { throw new Error(`NEXT_REDIRECT ${url}`); };
export const permanentRedirect = (url) => { throw new Error(`NEXT_REDIRECT ${url}`); };

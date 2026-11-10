// next/navigation outside a Next server: the hooks the site uses, answering as on the home page
// with no query string, so a page that reads them (the contact form, the header) can be rendered.
export const useSearchParams = () => new URLSearchParams();
export const usePathname = () => '/';
export const useRouter = () => ({ push() {}, replace() {}, refresh() {}, back() {}, prefetch() {} });

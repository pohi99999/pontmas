import { alternatesFor } from '@/i18n/page';

// The page itself is a client component and cannot export metadata: its canonical address and
// hreflang links come from here (src/i18n/page.ts alternatesFor).
export const generateMetadata = alternatesFor('/autizmus');

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

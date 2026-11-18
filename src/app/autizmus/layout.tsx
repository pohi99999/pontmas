import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';

// The page is a client component and cannot export metadata; this layout carries its canonical link and og:url.
export const metadata: Metadata = pageMetadata('/autizmus');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

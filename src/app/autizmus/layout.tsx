import type { Metadata } from 'next';
import { titledPage } from '@/lib/site';

// The page is a client component and cannot export metadata; this layout carries it. The description is the
// page's own opening sentence (its header's subtitle).
export const metadata: Metadata = titledPage(
  '/autizmus',
  "Mi az az autizmus? | PontMás Alapítvány",
  "Az autizmus nem betegség, hanem egy eltérő fejlődésmenet és észlelési sajátosság. Ismerje meg a spektrum működését szakmai, mégis közérthető formában.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

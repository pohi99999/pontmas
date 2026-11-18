import type { Metadata } from 'next';
import { titledPage } from '@/lib/site';

// The page is a client component and cannot export metadata; this layout carries it. The description is the
// page's own opening sentence (its header's subtitle).
export const metadata: Metadata = titledPage(
  '/tamogatas',
  "Támogatás és adó 1% | PontMás Alapítvány",
  "Az Ön támogatása közvetlenül hozzájárul a Vas vármegyei autizmussal élő gyermekek képességfejlesztéséhez, a szülői közösség megtartásához és a krízishelyzetbe került családok segítéséhez.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

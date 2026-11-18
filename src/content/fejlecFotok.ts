// The photo in the sphere of a subpage's header (L2, Lumen's plan of 2026-11-18, Péter 16967).
//
// Which page gets which photo is Lumen's choice (lumen.md, and Lumen's answer of 2026-11-18): six
// pages get one, each a different one; the pages where a visitor comes to get something done
// (Dokumentumok, Kapcsolat, Irodánk) and Rólunk, Rólunk írták keep the foundation's mark.
//
// Only a photo that is already published in a gallery of the site can be named here: the entry is
// looked up in the galleries' own lists and takes its text from there, so a header cannot show a
// photo that was never approved for the site. None is a community photo: those three are for the
// home page's band (L3), and the two do not repeat each other.
import { CAMP_PHOTOS, WORK_PHOTOS } from '@/components/content/Gallery';

const PUBLISHED = [...CAMP_PHOTOS, ...WORK_PHOTOS];

/** The gallery photo with this file name, with its caption as text; throws for a photo no gallery has. */
export function published(file: string): { src: string; alt: string } {
  const photo = PUBLISHED.find((p) => p.src === `/images/galeria/${file}.webp`);
  if (!photo) throw new Error(`"${file}" is not a photo of the site's galleries (Gallery.tsx)`);
  // the caption the photo has in its gallery: one text, in one place
  return { src: photo.src, alt: photo.caption };
}

export const FEJLEC_FOTO = {
  '/segitseg': published('tabor-kepkartyak-a-falon'),
  '/hirek': published('tabor-vaszontaska-az-asztalnal'),
  '/tamogatas': published('kezzel-keszult-szivek'),
  '/kisfilmek': published('tabor-rajzolt-arcok'),
  '/autizmus': published('noveny-lenyomatok'),
  '/programok': published('bogrefestes'),
} as const;

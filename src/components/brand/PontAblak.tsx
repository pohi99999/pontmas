import Image from 'next/image';
import { INK_PATH, RIBBON_PATH } from './PontJel';

// The hero mark with a photo inside the sphere (concept "A kék pont", 11-05, its sixth step; review
// 2026-11-10, Péter GO 14675). The photo is one already on the site with consent (#26). The circle is the
// sphere of the vector logo: centre 326.5/279.5, radius 134 in the viewBox 100 25 369 398, so the window
// sits at 25.07 % / 30.28 % and is 72.63 % x 67.34 % of the box. Over the photo a light veil of the
// sphere's own gradient, over that the ink (ring, P arc, smile) and the white ribbon, paths unchanged.
// Motion (Péter 14677): the ink and the ribbon rise once from the bottom (data-mozgas="iv"); off in the
// soft mode and with reduced motion, then the mark simply stands.
export default function PontAblak({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  return (
    <div className="relative w-full" style={{ aspectRatio: '369 / 398' }}>
      <div
        className="absolute overflow-hidden rounded-full bg-blue-100"
        style={{ left: '25.07%', top: '30.28%', width: '72.63%', height: '67.34%' }}
      >
        <Image src={src} alt={alt} fill preload sizes={sizes} className="object-cover" />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{ background: 'radial-gradient(circle at 36% 30%, rgb(245 246 251 / 0) 0, rgb(151 173 213 / .16) 62%, rgb(114 144 196 / .34) 100%)' }}
        />
      </div>
      <svg viewBox="100 25 369 398" data-mozgas="iv" className="pm-tinta pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
        <path fill="currentColor" fillRule="evenodd" d={INK_PATH} />
        <path fill="#fff" d={RIBBON_PATH} />
      </svg>
    </div>
  );
}

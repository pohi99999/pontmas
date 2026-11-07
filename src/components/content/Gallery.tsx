import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';

// The photos on /programok. Only images without a recognisable person, cropped so that no name, badge or
// paper shows. Captions and alt texts say what is visible: no name, year, headcount or diagnosis.
export const WORK_PHOTOS = [
  {
    src: '/images/galeria/noveny-lenyomatok.webp',
    width: 830,
    height: 466,
    caption: 'Növénylenyomatok a táborból',
    alt: 'Két lap szürke asztalon: narancssárgára festett alapon sötétvörös levelek és virágok lenyomata.',
  },
  {
    src: '/images/galeria/bogrefestes.webp',
    width: 1100,
    height: 618,
    caption: 'Bögrefestés a táborban',
    alt: 'Két kéz egy fehér bögrénél: az egyik a bögre fülét fogja, a másik tollal szürke mintát rajzol rá. A bögrén rózsaszín minta is van.',
  },
  {
    src: '/images/galeria/tengeri-falikep.webp',
    width: 1200,
    height: 676,
    caption: 'Tengeri falikép gyerekmunkákból',
    alt: 'Kék függöny előtt kékre festett, hosszú lap, rajta zsinóron lógó, kivágott figurák: halak, rák, csikóhal és tengeri csillag.',
  },
  {
    src: '/images/galeria/kezzel-keszult-szivek.webp',
    width: 1060,
    height: 596,
    caption: 'Kézzel készült szívek egy jótékonysági standon',
    alt: 'Fonott kosár tele kék horgolt és varrott szívekkel, a kosarat egy kéz tartja. Mögötte egy másik kosárban kék kulcstartók.',
  },
];

type Photo = (typeof WORK_PHOTOS)[number];

function Figure({ photo, sizes }: { photo: Photo; sizes: string }) {
  return (
    <figure className="mb-8 break-inside-avoid">
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        className="foto w-full h-auto rounded-2xl"
      />
      <figcaption className="mt-3 text-sm text-slate-600 leading-relaxed">{photo.caption}</figcaption>
    </figure>
  );
}

const TWO_COLUMNS = '(min-width: 1120px) 496px, (min-width: 768px) 50vw, 100vw';

export default function Gallery() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <SectionHeader
        badge="Képek"
        title="Kézzel készült munkák"
        subtitle="Néhány pillanat a nyári táborokból és egy jótékonysági standról."
      />
      <div className="max-w-5xl mx-auto gap-8 md:columns-2">
        {WORK_PHOTOS.map((photo) => <Figure key={photo.src} photo={photo} sizes={TWO_COLUMNS} />)}
      </div>
    </section>
  );
}

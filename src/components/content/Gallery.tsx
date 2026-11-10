import Image from 'next/image';
import { useTranslations } from 'next-intl';
import SectionHeader from '@/components/ui/SectionHeader';

// The photos on /programok and /rolunk. Photos of people are shown whole, as approved; the works are cropped so
// that no name, badge or paper shows. Captions and alt texts say what is visible: no name (only the credited
// photographer), year, headcount or diagnosis. The captions and alt texts are in messages/<locale>.json
// (Gallery.photos.<id>), keyed by the file name.
export const CAMP_PHOTOS = [
  {
    id: 'tabor-korjatek',
    src: '/images/galeria/tabor-korjatek.webp',
    width: 900,
    height: 1200,
  },
  {
    id: 'tabor-vaszontaska-az-asztalnal',
    src: '/images/galeria/tabor-vaszontaska-az-asztalnal.webp',
    width: 1000,
    height: 750,
  },
  {
    id: 'tabor-tal-folott',
    src: '/images/galeria/tabor-tal-folott.webp',
    width: 900,
    height: 1200,
  },
  {
    id: 'tabor-rajzolt-arcok',
    src: '/images/galeria/tabor-rajzolt-arcok.webp',
    width: 1200,
    height: 900,
  },
  {
    id: 'tabor-kepkartyak-a-falon',
    src: '/images/galeria/tabor-kepkartyak-a-falon.webp',
    width: 900,
    height: 1200,
  },
  {
    id: 'tabor-pihenes-babzsakon',
    src: '/images/galeria/tabor-pihenes-babzsakon.webp',
    width: 1200,
    height: 675,
  },
];

export const WORK_PHOTOS = [
  {
    id: 'noveny-lenyomatok',
    src: '/images/galeria/noveny-lenyomatok.webp',
    width: 830,
    height: 466,
  },
  {
    id: 'bogrefestes',
    src: '/images/galeria/bogrefestes.webp',
    width: 1100,
    height: 618,
  },
  {
    id: 'tengeri-falikep',
    src: '/images/galeria/tengeri-falikep.webp',
    width: 1200,
    height: 676,
  },
  {
    id: 'kezzel-keszult-szivek',
    src: '/images/galeria/kezzel-keszult-szivek.webp',
    width: 1060,
    height: 596,
  },
];

export const COMMUNITY_COVER = {
  id: 'kozosseg-osszeallitas',
  src: '/images/galeria/kozosseg-osszeallitas.webp',
  width: 1600,
  height: 901,
};

export const COMMUNITY_PHOTOS = [
  {
    id: 'kozosseg-felvonulas',
    src: '/images/galeria/kozosseg-felvonulas.webp',
    width: 1200,
    height: 799,
  },
  {
    id: 'kozosseg-kek-feny',
    src: '/images/galeria/kozosseg-kek-feny.webp',
    width: 1200,
    height: 799,
  },
  {
    id: 'kozosseg-regisztracio',
    src: '/images/galeria/kozosseg-regisztracio.webp',
    width: 900,
    height: 1351,
  },
];

type Photo = (typeof WORK_PHOTOS)[number];

function Figure({ photo, sizes }: { photo: Photo; sizes: string }) {
  const t = useTranslations('Gallery.photos');
  return (
    <figure className="mb-8 break-inside-avoid">
      <Image
        src={photo.src}
        alt={t(`${photo.id}.alt`)}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        className="foto w-full h-auto rounded-2xl"
      />
      <figcaption className="mt-3 text-sm text-slate-600 leading-relaxed">{t(`${photo.id}.caption`)}</figcaption>
    </figure>
  );
}

const TWO_COLUMNS = '(min-width: 1120px) 496px, (min-width: 768px) 50vw, 100vw';
const THREE_COLUMNS = '(min-width: 1120px) 320px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw';

export default function Gallery() {
  const t = useTranslations('Gallery');
  return (
    <>
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <SectionHeader
          badge={t('badge')}
          title={t('camp.title')}
          subtitle={t('camp.subtitle')}
        />
        <div className="max-w-5xl mx-auto gap-8 md:columns-2 lg:columns-3">
          {CAMP_PHOTOS.map((photo) => <Figure key={photo.src} photo={photo} sizes={THREE_COLUMNS} />)}
        </div>
      </section>
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <SectionHeader
          badge={t('badge')}
          title={t('works.title')}
          subtitle={t('works.subtitle')}
        />
        <div className="max-w-5xl mx-auto gap-8 md:columns-2">
          {WORK_PHOTOS.map((photo) => <Figure key={photo.src} photo={photo} sizes={TWO_COLUMNS} />)}
        </div>
      </section>
    </>
  );
}

export function CommunityGallery() {
  const t = useTranslations('Gallery');
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <SectionHeader
        badge={t('badge')}
        title={t('community.title')}
        subtitle={t('community.subtitle')}
      />
      <div className="max-w-5xl mx-auto">
        <Figure photo={COMMUNITY_COVER} sizes="(min-width: 1120px) 1024px, 100vw" />
        <div className="gap-8 md:columns-2">
          {COMMUNITY_PHOTOS.map((photo) => <Figure key={photo.src} photo={photo} sizes={TWO_COLUMNS} />)}
        </div>
      </div>
    </section>
  );
}

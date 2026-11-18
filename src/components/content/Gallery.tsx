import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

// The photos on /programok and /rolunk. Photos of people are shown whole, as approved; the works are cropped so
// that no name, badge or paper shows. Captions and alt texts say what is visible: no name (only the credited
// photographer), year, headcount or diagnosis.
export const CAMP_PHOTOS = [
  {
    src: '/images/galeria/tabor-korjatek.webp',
    width: 900,
    height: 1200,
    caption: 'Közös játék körben',
    alt: 'Felnőttek és gyerekek ülnek körben a fekete padlón, kezüket maguk elé teszik. Mögöttük karikák, labdák és kék függöny.',
  },
  {
    src: '/images/galeria/tabor-vaszontaska-az-asztalnal.webp',
    width: 1000,
    height: 750,
    caption: 'Vászontáska és lapok az asztalnál',
    alt: 'Egy gyerek kék pólóban asztalnál ül, előtte vászontáska és egy lap. Mellette felnőttek: egyikük a táskát fogja, másikuk nevet, egy PontMás-pólós a kamerába néz.',
  },
  {
    src: '/images/galeria/tabor-tal-folott.webp',
    width: 900,
    height: 1200,
    caption: 'Kézzel dolgozva, egy tál fölött',
    alt: 'Egy gyerek oldalról, fehér trikóban, fém tál fölött tartja a kezét, a tálban barna, morzsás massza. A háttérben kék függöny és a tengeri falikép.',
  },
  {
    src: '/images/galeria/tabor-rajzolt-arcok.webp',
    width: 1200,
    height: 900,
    caption: 'Rajzolt arcok az asztalon, közös beszélgetés',
    alt: 'Hosszú asztalnál felnőttek és gyerekek beszélgetnek. Az asztalon lapok, mindegyiken egy rajzolt arc más-más arckifejezéssel. Az egyik gyerek kék babzsákot tart.',
  },
  {
    src: '/images/galeria/tabor-kepkartyak-a-falon.webp',
    width: 900,
    height: 1200,
    caption: 'Képkártyák a falon',
    alt: 'Egy gyerek hátulról, mellette egy felnőtt guggol: együtt nyúlnak a falra tett, kartonra tűzött képkártyákhoz. Elöl és oldalt további emberek.',
  },
  {
    src: '/images/galeria/tabor-pihenes-babzsakon.webp',
    width: 1200,
    height: 675,
    caption: 'Pihenő babzsákokon',
    alt: 'Két gyerek fekszik piros-narancs babzsákokon egy tágas terem padlóján, arcuk nem látszik. Körülöttük újságok, mögöttük kék függönyös ablakok.',
  },
];

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

export const COMMUNITY_COVER = {
  src: '/images/galeria/kozosseg-osszeallitas.webp',
  width: 1600,
  height: 901,
  caption: 'Összeállítás egy szabadtéri közös programról',
  alt: 'Hat képből álló összeállítás: PontMás-pólós felnőttek és egy kisgyerek csoportképe egy fa alatt, jelentkezés hosszú asztalnál, kosár kék horgolt szívekkel, két kék pólós ember lendíti a lábát, egy póló hátán a PontMás felirat, és sokan tornáznak a füvön.',
};

export const COMMUNITY_PHOTOS = [
  {
    src: '/images/galeria/kozosseg-felvonulas.webp',
    width: 1200,
    height: 799,
    caption: 'Kék sálas felvonulás a városban. Fotó: Nagy Jácint',
    alt: 'Kék sálas emberek hosszú menete halad egy színes homlokzatú utcán, elöl kék táblát visznek, mellettük harmonikás zenél. A járdáról ketten fényképeznek.',
  },
  {
    src: '/images/galeria/kozosseg-kek-feny.webp',
    width: 1200,
    height: 799,
    caption: 'Kék fénnyel megvilágított épület. Fotó: Nagy Jácint',
    alt: 'Borús ég alatt kék fénnyel megvilágított toronyház, előtte bronz szoborcsoport. Az épület előtti téren emberek beszélgetnek, többen kék ruhában.',
  },
  {
    src: '/images/galeria/kozosseg-regisztracio.webp',
    width: 900,
    height: 1351,
    caption: 'Jelentkezés a hosszú asztalnál',
    alt: 'Szabadban álló hosszú faasztal két oldalán sokan hajolnak papírok fölé és töltik ki azokat, többen kék pólóban. A háttérben nádfedeles házak és fenyők.',
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
const THREE_COLUMNS = '(min-width: 1120px) 320px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw';

export default function Gallery() {
  return (
    <>
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <SectionHeader
          badge="Képek"
          title="A nyári táborból"
          subtitle="Játék, közös munka és pihenés a táborban."
        />
        <div className="max-w-5xl mx-auto gap-8 md:columns-2 lg:columns-3">
          {CAMP_PHOTOS.map((photo) => <Figure key={photo.src} photo={photo} sizes={THREE_COLUMNS} />)}
        </div>
      </section>
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
    </>
  );
}

export function CommunityGallery() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <SectionHeader
        badge="Képek"
        title="A közösségünk képekben"
        subtitle="Néhány pillanat közös eseményekről."
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

/**
 * The home page's band (L3, Lumen's plan of 2026-11-18): three of the community photos of /rolunk, with the captions
 * and alt texts they have there, staggered like a contact sheet. Nothing moves; the photos load lazily.
 */
export function CommunityBand() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="kozosseg-cim">
      <div className="grid lg:grid-cols-12 gap-10 items-end mb-10">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-4"><span className="pont" aria-hidden="true" />Képek</p>
          <h2 id="kozosseg-cim" className="text-4xl md:text-5xl leading-[1.1] text-slate-900">A közösségünk képekben</h2>
          <p className="mt-4 text-lg text-slate-600">Néhány pillanat közös eseményekről.</p>
        </div>
        <div className="lg:col-span-5 lg:text-right">
          <Link href="/rolunk" className="inline-flex items-center gap-2 font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:decoration-blue-700">
            További képek a Rólunk oldalon <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-3 sm:items-start">
        {[COMMUNITY_PHOTOS[0], COMMUNITY_PHOTOS[2], COMMUNITY_PHOTOS[1]].map((photo, i) => (
          <figure key={photo.src} className={i === 1 ? 'sm:mt-16' : i === 2 ? 'sm:mt-8' : ''}>
            <div className="relative overflow-hidden rounded-[1.75rem] ring-1 ring-slate-900/10" style={{ aspectRatio: '4 / 5' }}>
              <Image src={photo.src} alt={photo.alt} fill loading="lazy" sizes="(min-width: 1280px) 400px, (min-width: 640px) 31vw, 92vw" className="foto object-cover" />
            </div>
            <figcaption className="mt-3 text-sm text-slate-600 leading-relaxed">{photo.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

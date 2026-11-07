import Image from 'next/image';
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

// The content the site showed before the editor existed, moved here verbatim from
// src/app/hirek/page.tsx and src/app/programok/page.tsx (only id, publishedAt and hidden are new).
// The public pages show this whenever the store is empty, not configured or unreachable.
// tests/editor-content.test.mjs compares it with a copy of main's arrays.
import type { NewsItem, ProgramItem, SiteContent } from './types';

export const SEED_NEWS: NewsItem[] = [
    {
      id: "szuloklub-2024-10-26",
      publishedAt: "2024-10-26",
      hidden: false,
      featured: true,
      badge: "Kiemelt Esemény • Szülőklub",
      title: "Meghívó: Szülőklub – „Foglald el magad egy kicsit! Önálló szabadidős tevékenységek tervezése, tanítása”",
      date: "2024. október 26. (Szombat) 14:00 - 16:30",
      location: "9700 Szombathely, Sugár út 9. (PontMás Alapítvány Irodája)",
      speaker: "Bárdosi Emőke – Az Aranyhíd EGYMI szakirányos gyógypedagógusa",
      description: "A PontMás Vas Megyei Autista Gyermekekért Alapítvány szeretettel meghívja az érintett szülőket, hozzátartozókat és szakembereket soron következő szakmai szülőklub rendezvényére. A részvétel ingyenes, de regisztrációhoz kötött.",
      highlights: [
        "Gyakorlati módszerek az önálló otthoni szabadidő eltöltéséhez",
        "Vizuális napirendek és tevékenység-tervezők alkalmazása",
        "Kötetlen szülői tapasztalatcsere és tanácsadás",
      ],
      actionText: "Regisztráció a Szülőklubra",
      actionHref: "/kapcsolat?topic=szulo",
      googleFormHref: "https://forms.gle/1gBnMZHoTn3DuZ189",
    },
    {
      id: "csaladi-nap-2024-skanzen",
      publishedAt: "2024-09-28",
      hidden: false,
      featured: false,
      badge: "Közösségi Élet • Beszámoló",
      title: "Családi Nap 2024 a Vasi Skanzenben – Közösségépítés és Szülőklub a természetben",
      date: "2024. szeptember 28.",
      location: "Vasi Skanzen, Szombathely",
      speaker: "Temesi Patrícia pszichológus & Pohánka Edit kuratóriumi elnök",
      description: "Hagyományos őszi családi napunkon a változékony idő ellenére is nagyszerű hangulatban gyűltek össze a családok. A gyermekek gyógypedagógusok és asszisztensek segítségével agyagozhattak, körmöcskézhettek, fát ültethettek, nyúlkuglizhattak és akadálypályán vehettek részt, míg a szülőknek Temesi Patrícia pszichológus vezetett interaktív és feltöltő csapatépítő beszélgetést.",
      highlights: [
        "Gyógypedagógusok által felügyelt kreatív állomások",
        "Pszichológiai támogatás és tapasztalatcsere az iskolakezdésről",
        "Közös pizza-parti és kötetlen barátkozás",
      ],
      actionText: "Részletes beszámoló",
      actionHref: "/programok",
    },
    {
      id: "tovabbkepzes-2024",
      publishedAt: "2024-04-01",
      hidden: false,
      featured: false,
      badge: "Szakmai Fejlesztés • Támogatás",
      title: "Továbbképzés gyógypedagógusok és asszisztensek részére (Szombathely MJV támogatásával)",
      date: "2024. április - május",
      location: "Autizmus Alapítvány Képzési Központ",
      speaker: "13 szombathelyi pedagógus az Aranyhíd EGYMI, Micimackó Óvoda és Váci Mihály Ált. Iskolából",
      description: "Alapítványunk a Szombathely Megyei Jogú Város Önkormányzati Támogatási Rendszerén keresztül elnyert 800.000 Ft támogatás segítségével 100%-ban finanszírozta a helyi szakemberek akkreditált 30 órás alapozó és kommunikációs-szociális képzéseit.",
      highlights: [
        "11 fő végezte el az Autizmussal élő gyermekek célzott pedagógiai ellátása 30 órás képzést",
        "2 fő végezte el a Szociális és kommunikációs készségek fejlesztése kurzust",
        "A képzések teljes 715.000 Ft-os díját az alapítvány finanszírozta",
      ],
      actionText: "Pályázati dokumentumok",
      actionHref: "/dokumentumok",
    },
    {
      id: "onkentes-felhivas",
      publishedAt: "2024-01-01",
      hidden: false,
      featured: false,
      badge: "Önkéntesség • Felhívás",
      title: "Önkéntes segítőket és aktivistákat keresünk!",
      date: "Folyamatosan",
      location: "Szombathely és környéke",
      speaker: "PontMás Alapítvány Kuratóriuma",
      description: "Munkánk bővülésével és a növekvő igényekkel párhuzamosan elkötelezett önkénteseket keresünk rendezvényeink lebonyolításához, szülőklubok szervezéséhez, kommunikációhoz és adminisztrációhoz.",
      highlights: [
        "Rendezvényszervezés (Kék Séta, Családi Nap, Szülőklubok)",
        "Gyermekfelügyelet és segítői közreműködés programokon",
        "Közösségi média és szemléletformáló kampányok támogatása",
      ],
      actionText: "Jelentkezem önkéntesnek",
      actionHref: "/kapcsolat?topic=onkentes",
    },
];

export const SEED_PROGRAMS: ProgramItem[] = [
    {
      id: 'kek-seta',
      publishedAt: '2024-04-02',
      hidden: false,
      category: 'event',
      title: 'Autizmus Világnapi "Kék Séta"',
      date: 'Minden év április 2. körül',
      location: 'Szombathely Fő tér és belváros',
      badge: 'Kiemelt éves esemény',
      description: 'Hagyományos és nagyszabású figyelemfelhívó sétánk, amellyel az autizmussal élők társadalmi elfogadását, láthatóságát hirdetjük. Célunk az előítéletek lebontása és a helyi közösség összefogása.',
      highlights: ['Kék lufik és szalagok', 'Közös séta érintett családokkal', 'Szakmai és szülői felszólalások']
    },
    {
      id: 'nyari-taborok',
      publishedAt: '2024-07-01',
      hidden: false,
      category: 'camp',
      title: 'Képességfejlesztő Nyári Táborok',
      date: 'Július - Augusztus (évente több turnusban)',
      location: 'Vas vármegyei élményhelyszínek',
      badge: 'Fejlesztő tábor',
      description: 'Kifejezetten autizmussal élő gyermekek számára megálmodott táboraink kiszámítható, biztonságos és elfogadó közeget nyújtanak. Gyógypedagógusok és képzett asszisztensek felügyeletével biztosítunk játékos készségfejlesztést és igazi kikapcsolódást.',
      highlights: ['Alacsony gyermek-felnőtt arány', 'Egyéni szenzoros igényekhez igazított programok', 'Közösségi élmények']
    },
    {
      id: 'szuloklub',
      publishedAt: '2024-01-01',
      hidden: false,
      category: 'family',
      title: 'Szülőklub és Tapasztalatcsere',
      date: 'Havonta rendszeresen',
      location: 'Szombathely',
      badge: 'Sorstársi közösség',
      description: 'Biztonságos és támogató beszélgetőfórum az érintett szülők számára. Meghívott szakemberek, gyógypedagógusok és egymást segítő szülők segítségével vitatjuk meg a mindennapi kihívásokat, intézményi kérdéseket.',
      highlights: ['Ingyenes részvétel', 'Szakértői témák és kötetlen beszélgetések', 'Érzelmi és gyakorlati támasz']
    },
    {
      id: 'csaladi-napok',
      publishedAt: '2024-04-01',
      hidden: false,
      category: 'family',
      title: 'Autizmus-barát Családi Napok',
      date: 'Tavaszi és őszi időszakban',
      location: 'Szombathely és környéke',
      badge: 'Családi program',
      description: 'Olyan kötetlen szabadidős programok, ahol a testvérek, szülők és a spektrumon lévő gyermekek együtt tölthetnek el egy élménydús napot, anélkül, hogy a környezet ítélkezésétől kellene tartaniuk.',
      highlights: ['Nyugtató pihenősátrak', 'Kreatív és mozgásos játékok', 'Családi kapcsolatépítés']
    }
];

export const SEED_CONTENT: SiteContent = {
  version: 1,
  updatedAt: null,
  news: SEED_NEWS,
  programs: SEED_PROGRAMS,
};

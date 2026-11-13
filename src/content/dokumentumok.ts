// /dokumentumok: the foundation's documents and its grants (Edina's shared files, 2026-11-13; Péter, Telegram
// 15490, 15492, 15500; Marveen 7367-7372). Every date, number and amount below is written as it stands in the
// PDFs under public/dokumentumok/, which go out unchanged; `forras` says where. A document without a file shows
// "Hamarosan elérhető".

export type Dokumentum = {
  title: string;
  category: string;
  /** the date line on the card, from the document itself */
  date: string;
  description: string;
  /** path under public/, when the file is on the site */
  file?: string;
};

export type Tamogatas = {
  title: string;
  badge: string;
  amount: string;
  description: string;
  details: { text: string; href?: string }[];
};

export const BESZAMOLO_2025 = '/dokumentumok/pontmas-beszamolo-2025.pdf';
export const BESZAMOLO_2024 = '/dokumentumok/pontmas-beszamolo-2024.pdf';
export const SZAKMAI_BESZAMOLO_2023 = '/dokumentumok/pontmas-szakmai-beszamolo-2023.pdf';
export const ADATVEDELMI_SZABALYZAT = '/dokumentumok/pontmas-adatvedelmi-szabalyzat-2024.pdf';

export const DOKUMENTUMOK: readonly Dokumentum[] = [
  {
    // the deed holds private persons' data; a redacted copy waits for Edina's approval (Péter 15500)
    title: 'Alapító okirat és határozatok',
    category: 'Jogi alapdokumentum',
    date: '', // the page fills in the registration number
    description: 'A PontMás Vas Megyei Autista Gyermekekért Alapítvány hivatalos alapító okirata, célkitűzései és kuratóriumi működési rendje.',
  },
  {
    // the policy's own first page: "Hatályos: 2024.09.13."
    title: 'Adatvédelmi szabályzat',
    category: 'Adatvédelem',
    date: 'Hatályos: 2024. szeptember 13-tól',
    description: 'Az alapítvány adatkezelési elvei, az adatkezelés alapjai (a weboldal látogatóira vonatkozó résszel) és az érintettek jogai.',
    file: ADATVEDELMI_SZABALYZAT,
  },
  {
    // first page: "Érkezés dátuma: 2026.08.05.", PK-1142
    title: '2025. évi beszámoló és közhasznúsági melléklet',
    category: 'Közhasznúsági jelentés',
    date: 'Érkezett a bírósághoz: 2026. augusztus 5.',
    description: 'Az egyszerűsített éves beszámoló és közhasznúsági melléklet (PK-1142), a 2025. évi szakmai beszámolóval és a kiegészítő melléklettel.',
    file: BESZAMOLO_2025,
  },
  {
    // first page: "Érkezés dátuma: 2025-06-27", PK-1042
    title: '2024. évi beszámoló és közhasznúsági melléklet',
    category: 'Közhasznúsági jelentés',
    date: 'Érkezett a bírósághoz: 2025. június 27.',
    description: 'Az egyszerűsített éves beszámoló és közhasznúsági melléklet (PK-1042), a szöveges beszámolóval és a kiegészítő melléklettel.',
    file: BESZAMOLO_2024,
  },
  {
    // last page: "Szombathely, 2024. június 24."
    title: '2023. évi szakmai beszámoló',
    category: 'Szakmai beszámoló',
    date: 'Kelt: 2024. június 24.',
    description: 'A 2023. év tevékenysége: intézménytámogatás, szülőklubok, Kék séta, nyári tábor, Kék futás és Családi nap, pedagógus-továbbképzés.',
    file: SZAKMAI_BESZAMOLO_2023,
  },
];

export const TAMOGATASOK: readonly Tamogatas[] = [
  {
    // 2025. évi szakmai beszámoló, 8. pont
    title: 'Szülősegítő szolgáltatások támogatása 2025 (SZÜLŐ2025)',
    badge: 'Megvalósult pályázat',
    amount: '481 800 Ft vissza nem térítendő támogatás',
    description: 'A SZÜLŐ2025-B-4764 azonosítószámú, „Kezdeti segítség nyújtása az autizmussal élő szülőknek, nevelőknek” című projekt célja egy háromrészes, online hozzáférhető, közérthető és szakmailag megalapozott kisfilmsorozat elkészítése volt.',
    details: [
      { text: 'Támogató: Slachta Margit Nemzeti Szociálpolitikai Intézet' },
      { text: 'Eredmény: a háromrészes kisfilmsorozat', href: '/kisfilmek' },
      { text: 'Forrás: 2025. évi szakmai beszámoló, 8. pont', href: BESZAMOLO_2025 },
    ],
  },
  {
    // 2024. évi beszámoló, szöveges beszámoló 10. pont
    title: 'Szombathely MJV Önkormányzati Támogatás – Pedagógus Képzések',
    badge: 'Önkormányzati támogatás',
    amount: '800.000 Ft önkormányzati támogatás',
    description: 'Az Aranyhíd EGYMI, a Micimackó Óvoda, a Szombathelyi EBI Napraforgó Bölcsőde, a Váci Mihály Általános Iskola és a Rum Kastély EGYMI összesen 22 gyógypedagógusa, illetve gyógypedagógiai asszisztense vett részt az Autizmus Alapítvány 30 órás Alapozó képzésén, további 2 pedagógus végezte el az Autizmussal élő gyermekek szociális és kommunikációs készségeinek fejlesztése című 30 órás képzést.',
    details: [
      { text: 'Megvalósítás: 2024. április, május és november' },
      { text: 'A képzések költsége összesen 1.320.000 Ft: ebből 800.000 Ft a Szombathely Megyei Jogú Város Önkormányzati Támogatási Rendszeréből, a fennmaradó rész saját forrásból (támogatásokból)' },
      { text: 'Forrás: 2024. évi beszámoló, szöveges beszámoló 10. pont', href: BESZAMOLO_2024 },
    ],
  },
  {
    // 2023. évi szakmai beszámoló, 11. pont
    title: 'Pedagógus-továbbképzés alapítványi forrásból',
    badge: 'Saját forrásból',
    amount: '715.000 Ft',
    description: 'Az Aranyhíd EGYMI, a Micimackó Óvoda és a Váci Mihály Általános Iskola 13 gyógypedagógusa, illetve gyógypedagógiai asszisztense vett részt az Autizmus Alapítvány 30 órás Alapozó képzésein. A négynapos képzések költségét az alapítvány állta.',
    details: [
      { text: 'Megvalósítás: 2023. október és november' },
      { text: 'Forrás: 2023. évi szakmai beszámoló, 11. pont', href: SZAKMAI_BESZAMOLO_2023 },
    ],
  },
];

/** "1,8 MB" / "216 KB", for the link text. */
export function meretSzoveg(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

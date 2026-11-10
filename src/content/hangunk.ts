// The foundation's own voice on /rolunk (Péter, Telegram 14682 "a) és b)"; Marveen 6928).
//
// "Amiért dolgozunk": sentences the foundation already says elsewhere on the site, word for word, with
// the file they come from. No new claim, no name, no quotation marks: they are the foundation's own words,
// not anybody's quote. To change one, change it at its source too.
export type Mondat = { szoveg: string; forras: string };

export const AMIERT_DOLGOZUNK: readonly Mondat[] = [
  { szoveg: 'Közösséget formálunk, élményeket adunk és intézményeket támogatunk Vas vármegyében.', forras: 'src/app/programok/page.tsx (az oldal alcíme)' },
  { szoveg: 'Nemcsak közvetlenül a családokat segítjük, hanem azokat a szakmai intézményeket is, ahol a gyermekek a mindennapjaikat töltik.', forras: 'src/app/programok/page.tsx (intézményi támogatás)' },
  { szoveg: 'Az autizmus nem betegség, hanem idegrendszeri fejlődési sajátosság.', forras: 'src/app/autizmus/page.tsx (tények és tévhitek)' },
  { szoveg: 'Mint minden ember, az autizmussal élők is egyedi profilúak: mindenkinek megvannak az egyéni erősségei és a támogatást igénylő területei.', forras: 'src/app/autizmus/page.tsx (tények és tévhitek)' },
];

// Parents' thoughts: only real ones, from the foundation (Edina; the request is waiting for approval).
// While this list is empty, the block does not render at all. Each entry needs the parent's consent;
// shown without a name unless the parent asks otherwise.
export type SzuloiGondolat = { szoveg: string; forras: string; hozzajarulas: string };
export const SZULOI_GONDOLATOK: readonly SzuloiGondolat[] = [];

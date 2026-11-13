// The people of the foundation shown on /rolunk (Marveen 6921, 6928; Péter, Telegram 14680). The board can
// change, so this list is the one place to edit: name, role as the foundation states it, the source of the
// role, the portrait file. A person shows when `publikus` is true; without a portrait the card shows the
// initials in the same 4:5 frame (the other board members' photos come later from Edina).
export type CsapatTag = {
  nev: string;
  szerep: string;
  /** where the role comes from */
  forras: string;
  /** /public path of the portrait (4:5, 480x600 webp, head and shoulders, the same framing for everyone) */
  foto?: string;
  publikus: boolean;
};

export const CSAPAT: readonly CsapatTag[] = [
  {
    nev: 'Pohánka Edit',
    // Edina 2026-11-13: Edit is no longer AOSZ vice-president, so that role was taken out (Péter 15449).
    szerep: 'A kuratórium elnöke',
    forras: 'src/app/rolunk/page.tsx ("A kuratórium elnöke Pohánka Edit"); Edina 2026-11-13-i levele',
    // Drive "2. Portrék" / Pohánka Edit.png, cropped (Péter 14680: may go up now)
    foto: '/csapat/pohanka-edit.webp',
    publikus: true,
  },
  {
    nev: 'Rumi Edina',
    szerep: 'Alapítványi munkatárs',
    forras: 'Edina 2026-11-08-i levele (Marveen 6928)',
    // 2026-11-13 Edina sent a new photo (1049x1500, plain wall; Péter 15449): a 928x1160 crop from (86, 180),
    // the face about as wide as on Edit's card, the whole head in with some air above.
    foto: '/csapat/rumi-edina.webp',
    publikus: true,
  },
];

/** The people the page shows: the published ones, with or without a portrait. */
export function lathatoCsapat(csapat: readonly CsapatTag[]): readonly CsapatTag[] {
  return csapat.filter((t) => t.publikus);
}

/** Initials for the card without a portrait: "Pohánka Edit" -> "PE". */
export function monogram(nev: string): string {
  return nev.split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0].toLocaleUpperCase('hu')).join('');
}

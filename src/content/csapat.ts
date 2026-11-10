// The people of the foundation shown on /rolunk (Marveen 6928). The board can change, so this list is the
// one place to edit: name, role as the foundation states it, the source of the role, the portrait file.
// A person shows only with a portrait AND `publikus: true` (the portraits wait for Edina's uniform format
// and each person's consent; Marveen 6913: they are not put up for now), so today nothing renders.
export type CsapatTag = {
  nev: string;
  szerep: string;
  /** where the role comes from */
  forras: string;
  /** /public path of the portrait (4:5, head and shoulders, the same framing for everyone) */
  foto?: string;
  publikus: boolean;
};

export const CSAPAT: readonly CsapatTag[] = [
  {
    nev: 'Pohánka Edit',
    szerep: 'A kuratórium elnöke, az Autisták Országos Szövetségének (AOSZ) alelnöke',
    forras: 'src/app/rolunk/page.tsx ("A kuratórium elnöke Pohánka Edit, aki egyben az AOSZ alelnöke")',
    publikus: false,
  },
  {
    nev: 'Rumi Edina',
    szerep: 'Alapítványi munkatárs',
    forras: 'Edina 2026-11-08-i levele (Marveen 6928)',
    publikus: false,
  },
];

/** The people the page shows: published and with a portrait. */
export function lathatoCsapat(csapat: readonly CsapatTag[]): readonly CsapatTag[] {
  return csapat.filter((t) => t.publikus && !!t.foto);
}

// What the 1% offers brought, from the NAV's own list (Marveen 6931, card c017f163). Measured by Aura and
// re-measured by Brunella in the 2026 file (the foundation's row, by FOUNDATION.taxNumber).
// Source: NAV, "Közlemény a 2026. évben SZJA 1%-os felajánlásban részesült civil kedvezményezettekről",
// published 2026-09-15:
// https://nav.gov.hu/ado/szja1_1/kimutatasok_elszamolasok/civil-szervezetek/egyszaz_kiut_2026/kozlemeny-a-2026.-evben-szja-1-os-felajanlasban-reszesult-civil-kedvezmenyezettekrol
// file: https://nav.gov.hu/pfile/file?path=/ado/szja1_1/kimutatasok_elszamolasok/civil-szervezetek/egyszaz_kiut_2026/Szja_1-os_felajanlasban_reszesult_regisztralt_civil_kedvezmenyezettek_2026.xlsx
// This is the OFFERED amount (the paid amount can be lower if there was a tax debt). Next September the
// NAV publishes the new year: update all five values together, from the new file.
export const EGYSZAZALEK = {
  /** the year of the offers (the tax return year) */
  ev: 2026,
  /** the year with its suffix as it stands in the sentence (2026-ban, 2027-ben: the suffix changes) */
  evben: '2026-ban',
  /** offered amount, Ft */
  osszeg: 822407,
  /** number of taxpayers who offered */
  felajanlok: 77,
  /** NAV publication date, as shown under the line */
  kozzeteve: '2026.09.15.',
} as const;

/** "822 407 Ft": groups of three with a no-break space, so the amount never breaks across lines. */
export function forint(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Ft';
}

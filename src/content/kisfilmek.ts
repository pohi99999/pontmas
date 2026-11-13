// The foundation's short films on /kisfilmek (Edina's mail "Kisfilmek", 2026-11-13 15:45; Péter, Telegram 15469).
// The videos live on the foundation's own YouTube channel. A new film is one more line in KISFILMEK, in the
// order it should show. Titles as on YouTube (oEmbed, 2026-11-13); the page plays a film only after a click.

export type Kisfilm = {
  /** the YouTube video id (the part after watch?v=) */
  youtubeId: string;
  cim: string;
  /** optional still from public/, 16:9; without it the card shows the title on the brand background */
  poster?: string;
};

export const YOUTUBE_CSATORNA = 'https://www.youtube.com/@PontM%C3%A1sVasMegyeiAutistaGyermek';

/** "Autizmus – Szülői kisfilmsorozat", the playlist with all three parts (oEmbed, 2026-11-13). */
export const SZULOI_SOROZAT_LISTA = 'https://www.youtube.com/playlist?list=PLREtV1vomjYE';

export const KISFILMEK: readonly Kisfilm[] = [
  { youtubeId: 'aCihJ-XHJQ4', cim: '1. rész: A kommunikációs nehézségek megértése, alternatív segédeszközök' },
  { youtubeId: 'jaZbHRAE0vI', cim: '2. rész: Társas viselkedés, kapcsolatok segítése' },
  { youtubeId: 'hqIW0lrcB30', cim: '3. rész: A viselkedés szervezés nehézségei' },
];

// The series in the foundation's own words: the italic paragraphs of Edina's mail, word for word.
export const SZULOI_SOROZAT = {
  palyazat:
    'A Belügyminisztérium felkérésére a Slachta Margit Nemzeti Szociálpolitikai Intézet pályázatot hirdetett "Szülősegítő szolgáltatások támogatása 2025" (SZÜLŐ2025) címmel. A PontMás Vas Megyei Autista Gyermekekért Alapítvány a pályázat keretében „Kezdeti segítség nyújtása az autizmussal élők szüleinek, nevelőinek” címmel, SZÜLŐ2025-B-4764 számon támogatásban részesült. Az ajánlott kisfilmek ennek a programnak a keretében készültek.',
  cel: 'Sok szülő és nevelő nem tudja, hová forduljon, mit tegyen, amikor kézhez kapja gyermeke autizmus diagnózisát. A háromrészes kisfilmsorozat célja, hogy segítséget nyújtson ebben a kezdeti időszakban a magyar családok és szakemberek számára.',
  tartalom:
    'A filmek közérthető formában mutatják be az autizmus legfontosabb jellemzőit, segítenek megérteni a gyermek viselkedése mögött álló okokat, valamint gyakorlati ötleteket és eszközöket kínálnak a mindennapokhoz.',
  reszekCim: 'A sorozat részei:',
  reszek: [
    'A kommunikációs nehézségek megértése, alternatív segédeszközök',
    'Társas viselkedés, kapcsolatok segítése',
    'A viselkedésszervezés nehézségei',
  ],
  elony:
    'A kisfilmek előnye, hogy bármikor megtekinthetők és többször visszanézhetők, így a szülők és nevelők saját időbeosztásukhoz igazodva juthatnak hozzá a számukra fontos információkhoz és gyakorlati segítséghez.',
} as const;

/** The player URL, loaded only after the visitor clicks: the privacy-enhanced domain, no related videos
 *  from other channels at the end. */
export function lejatszoUrl(youtubeId: string): string {
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1&rel=0`;
}

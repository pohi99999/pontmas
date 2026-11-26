// What a news item shows beyond its plain-text fields, set here in the code (a reviewed pull request), by id:
// a poster from this repository and the parts of the text the author set in bold. Plain functions, no Next
// imports, so node:test can run them.
//
// Why not through the content model: the model takes images only from the editor's Blob store with the child
// photo declaration, and its texts are plain text. A poster that came by e-mail (no child on it) and a text
// whose bold parts are the author's own are added the same way as LEZARULT in public.ts: by id, in the code.

export interface NewsPoster {
  /** The larger file (900 px wide); `srcSmall` is the 560 px one for phones. */
  src: string;
  srcSmall: string;
  alt: string;
  width: number;
  height: number;
}

export const HIR_PLAKAT: ReadonlyMap<string, NewsPoster> = new Map([
  // Edina 2026-11-26 (Marveen 9386, Péter 18477): the poster of the charity cake sale, 1122x1402 PNG -> WebP.
  ['sutivasar-2026-12-19', {
    src: '/plakatok/sutivasar-2026-12-19.webp',
    srcSmall: '/plakatok/sutivasar-2026-12-19-560.webp',
    width: 900,
    height: 1125,
    alt: 'Plakát: Jótékonysági sütivásár, PontMás Vas Megyei Autista Gyermekekért Alapítvány. Időpont: 2026. december 19. (szombat). Aki jelezte, hogy süt és a helyszínre hozza a süteményt, azt 9:00–9:30 között várjuk. A vásár ideje: 10:00–16:00. Helyszín: Family Center Szombathely. Cím: 9700 Szombathely, Varasd u. 1. A sütemény vásárlásával a PontMás Alapítványt támogatod! Minden vásárlás segítség!',
  }],
]);

/** The exact parts of the description that the author set in bold (Edina's *stars*). */
export const HIR_KIEMELES: ReadonlyMap<string, readonly string[]> = new Map([
  ['sutivasar-2026-12-19', [
    '10:00 és 16:00 óra között',
    'Family Center Szombathelyben, 9700 Szombathely, Varasd u. 1.',
    '9:00–9:30 között',
    'Találkozzunk december 19-én a Family Centerben!',
    'Rumi Edina',
  ]],
]);

export interface Segment { text: string; bold: boolean }

/**
 * The description as paragraphs (split at blank lines) of lines (split at single newlines) of segments,
 * with every occurrence of a `bold` string marked. A text without newlines and without bold parts is one
 * paragraph of one line of one segment: it renders exactly as the single <p> it always was.
 */
export function descriptionBlocks(text: string, bold: readonly string[] = []): Segment[][][] {
  const paragraphs = text.split(/\n[ \t]*\n+/).map((p) => p.trim()).filter(Boolean);
  return paragraphs.map((p) => p.split('\n').map((line) => markBold(line, bold)));
}

function markBold(line: string, bold: readonly string[]): Segment[] {
  const out: Segment[] = [];
  let rest = line;
  while (rest) {
    let at = -1, hit = '';
    for (const b of bold) {
      const i = b ? rest.indexOf(b) : -1;
      if (i >= 0 && (at < 0 || i < at || (i === at && b.length > hit.length))) { at = i; hit = b; }
    }
    if (at < 0) { out.push({ text: rest, bold: false }); break; }
    if (at > 0) out.push({ text: rest.slice(0, at), bold: false });
    out.push({ text: hit, bold: true });
    rest = rest.slice(at + hit.length);
  }
  return out;
}

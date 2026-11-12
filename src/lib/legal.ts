// The legal pages (/adatkezeles, /impresszum) are drafts until the foundation and its lawyer approve
// the text (card c017f163). While LEGAL_DRAFT is true:
// - both pages carry a visible "Tervezet" banner and every open point is marked in the text
//   ([JOGI ÁTNÉZÉS] = wording to be approved, [KÉRDÉS] = a fact we do not have a source for);
// - they are not indexed (robots noindex) and stay out of the sitemap.
// Approval = the markers are resolved, then this flag is set to false in a reviewed pull request.
// tests/legal.test.mjs checks that a page with a marker is never published as final.
export const LEGAL_DRAFT = true;

export const REVIEW_MARKERS = ['[JOGI ÁTNÉZÉS]', '[KÉRDÉS]'] as const;

/** Where each fact in the drafts came from, shown at the bottom of the draft pages for the reviewer. */
export const LEGAL_SOURCES = [
  'Az alapítvány 2024.09.13-án kelt adatvédelmi szabályzata (a régi pontmas.hu-ról, adatvedelmi_szabalyzat.pdf).',
  'A weboldal forráskódja (mit gyűjt az űrlap, mit tárol a böngésző, milyen szolgáltatón fut), 2026-11-10-i állapot.',
  'Az alapítvány adatai: src/lib/foundation.ts.',
] as const;

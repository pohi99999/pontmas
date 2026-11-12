// The foundation's fixed facts, in one place (card c017f163, 2026-11-10). Before this file the tax
// number, the bank account, the address and the phone were typed into eleven files; a change had to
// find every copy. Every page, the footer, the JSON-LD and (later) the chat's knowledge read them
// from here, and tests/foundation.test.mjs fails if a copy of a number reappears anywhere else.
//
// Source of each value: the foundation's own data as published on the site before this change
// (README "Jogi és Támogatási Adatok"); the bank name and the contact phone from Rumi Edina's answer
// of 2026-11-03 (card 92c278ae). These are changed only through a reviewed pull request: the editor
// (/szerkeszto) has no field for them, on purpose (src/content/types.ts).

export const FOUNDATION = {
  /** The registered name. */
  name: 'PontMás Vas Megyei Autista Gyermekekért Alapítvány',
  shortName: 'PontMás Alapítvány',
  /** Adószám, also the beneficiary number of the 1% offer. */
  taxNumber: '18654996-1-18',
  /** Nyilvántartási szám. */
  registrationNumber: '18-01-0001850',
  bankName: 'Erste Bank',
  bankAccount: '11600006-00000000-75701521',
  address: {
    postalCode: '9700',
    city: 'Szombathely',
    street: 'Váci M. utca 12. 3./15.',
    country: 'HU',
  },
  /**
   * The seat as the tax authority writes it (NAV 2026 list of 1% beneficiaries: "9700 SZOMBATHELY VÁCI M.
   * UTCA 12. 3.em. 15.a.", measured by Aura on 2026-11-10). The same address as `address`, in the
   * official notation; used on the legal pages. The pages already live keep `ADDRESS_LINE`.
   * Confirmed by Péter on 2026-11-10 (Telegram 14695).
   */
  registeredSeat: '9700 Szombathely, Váci M. utca 12. 3. em. 15. a.',
  contactPerson: 'Rumi Edina',
  /** As shown on the page. */
  phone: '+36 20 969 8715',
} as const;

/** "9700 Szombathely, Váci M. utca 12. 3./15." */
export const ADDRESS_LINE = `${FOUNDATION.address.postalCode} ${FOUNDATION.address.city}, ${FOUNDATION.address.street}`;

/** "tel:+36209698715": the shown number without spaces. */
export const PHONE_HREF = `tel:${FOUNDATION.phone.replace(/\s+/g, '')}`;

/** The schema.org NGO block of the root layout. */
export function foundationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: FOUNDATION.name,
    url: 'https://pontmas.hu',
    telephone: FOUNDATION.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: FOUNDATION.address.street,
      addressLocality: FOUNDATION.address.city,
      postalCode: FOUNDATION.address.postalCode,
      addressCountry: FOUNDATION.address.country,
    },
  };
}

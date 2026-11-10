// The personal-data guard of the chat (card c017f163). Families of autistic children write here, so
// a message that carries an e-mail address, a phone number, a TAJ or personal tax number, a bank
// account, a birth date or a street address is never sent to the model: the browser stops it before
// it leaves the page, and the server stops it again (the browser check can be bypassed).
//
// What a regex cannot catch ("the 6 year old Bence was diagnosed last year") is the system prompt's
// job (rules.ts): never ask for, never repeat personal details.
//
// The foundation's own published facts (its phone, tax number, account, address) are not personal
// data: a visitor quoting them back is let through.
import { ADDRESS_LINE, FOUNDATION } from '../foundation';

export type PiiKind = 'email' | 'phone' | 'taj' | 'tax_id' | 'bank_account' | 'birth_date' | 'address';

const OWN_FACTS = [FOUNDATION.phone, FOUNDATION.phone.replace(/\s+/g, ''), FOUNDATION.taxNumber, FOUNDATION.bankAccount, ADDRESS_LINE, FOUNDATION.address.street];

const DETECTORS: [PiiKind, RegExp][] = [
  ['email', /[^\s@]+@[^\s@]+\.[^\s@]{2,}/],
  // +36 / 06, an area or mobile code of 1-2 digits, then 6-7 digits in any grouping
  ['phone', /(?:\+\s?36|\b06)[\s\-/().]*\d{1,2}[\s\-/().]*\d{3}[\s\-]?\d{3,4}\b/],
  // bank account: 2 or 3 groups of 8 digits
  ['bank_account', /\b\d{8}[\s-]\d{8}(?:[\s-]\d{8})?\b/],
  // personal tax id (adóazonosító jel): 10 digits starting with 8
  ['tax_id', /\b8\d{9}\b/],
  // TAJ: 9 digits, often in groups of three
  ['taj', /\b\d{3}[\s-]?\d{3}[\s-]?\d{3}\b/],
  // a date next to a word about birth ("született 2019. 03. 04", "szül. dátum: 2019-03-04", "born", "geboren")
  ['birth_date', /(szület|szül\.|születés|born|birth|geboren|geburt)[^\n]{0,25}?\b(19|20)\d{2}\s*[.\-/]\s*\d{1,2}\s*[.\-/]\s*\d{1,2}/i],
  // a postal code, a place name, a street word and a house number
  ['address', /\b\d{4}\s+[A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű-]+,?\s+[^\n,]{1,40}?\b(utca|u\.|út|útja|tér|köz|körút|krt\.?|sor|fasor|dűlő|lakótelep|ltp\.?)\s*\d+/i],
];

/** The kinds of personal data found in a message; empty when there is none. */
export function detectPii(text: string): PiiKind[] {
  let t = text;
  for (const own of OWN_FACTS) t = t.split(own).join(' ');
  return DETECTORS.filter(([, re]) => re.test(t)).map(([kind]) => kind);
}

// /irodank: the office, in Edina's words (her mail "Elmaradt anyagok", 2026-11-13 16:12; Péter, Telegram 15487).
// The text runs from "AZ AOSZ Info-pont…" to the phone number, word for word. The two hearts after the first
// sentence are left out (the site uses no emoji); the phone comes from src/lib/foundation.ts, the one place
// for it, shown in the same format as everywhere else on the site.
// The hours are the ones in her text (Tuesday 9-13, Friday 9-12). Her poster says Tuesday and Friday 9-13, so
// the poster stays off the page until she settles it. No e-mail address: the foundation's own info@ address
// receives no mail yet (no MX record, 2026-11-13).

export const IRODA_CIM = 'Szombathely, Sugár út 9. 3. emelet';

export const IRODANK = {
  bevezeto: 'AZ AOSZ Info-pont a régi formájában és névvel szeptembertől már nem elérhető, de nem hagyunk magatokra benneteket!',
  hely: 'A régi helyünkön (Szombathely, Sugár út 9. 3. emelet) ismét van személyes ügyfélfogadás, Rumi Edina várja a családokat a személyes megkeresésekkel.',
  bovites: 'Szeretnénk bővíteni szolgáltatásainkat, erről hamarosan be is fogunk számolni.',
  fogadasCim: 'Ügyfélfogadás:',
  fogadas: [
    { nap: 'Kedd', ido: '9.00-13.00' },
    { nap: 'Péntek', ido: '9.00-12.00' },
  ],
  egyeztetes: 'Telefonos egyeztetés alapján természetesen más időpontot is tudunk találni!',
  elerhetosegCim: 'Elérhetőségünk:',
} as const;

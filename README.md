# PontMás Alapítvány - Hivatalos Weboldal & Portál

A **PontMás Vas Megyei Autista Gyermekekért Alapítvány** (székhely: 9700 Szombathely, Váci M. utca 12. 3./15.) hivatalos, akadálymentesített (WCAG 2.1 AA), modern Next.js 16 (App Router) és Tailwind CSS 4 alapú weboldala és információs központja.

---

## 🌟 Fő Funkciók és Megújult Információs Architektúra

- **Interaktív Akadálymentességi & Szenzoros Eszköztár (`AccessibilityToolbar`):**
  - **Szenzoros / Nyugtató mód:** Lágy színek, minimális kontraszt és ingerek a túlterhelés elkerülésére.
  - **Magas kontraszt mód:** WCAG AAA szintű erős kontraszt, kiemelt link-aláhúzások.
  - **Betűméret-skálázás:** Normál (100%), Nagy (115%), Extra nagy (130%).
  - **Olvasóvonalzó sáv (`ReadingRuler`):** Egérkurzort követő fókuszcsík autizmussal, ADHD-val élő olvasóknak.
  - **Mozgáscsökkentés:** Animációk és átmenetek azonnali letiltása.
  - **Perzisztencia:** A látogató beállításai a böngésző `localStorage`-ében tárolódnak.

- **Kezdőlap (`/`):** Kiemelt küldetés, 4 alappillér, mérőszámok, AOSZ tagszervezeti státusz és közvetlen adó 1% gyorsdoboz.
- **Autizmusról Ismerettár (`/autizmus`):** A spektrum 3 fő pillére, interaktív Gyakran Ismételt Kérdések (FAQ), Tények és Tévhitek összehasonlítás, gyakorlati útmutató szülőknek.
- **Amiben segíteni tudunk (`/segitseg`):** Mentorszülői hálózat, szombathelyi AOSZ Info-Pont iroda (Sugár út 9.), DATA applikáció támogatás, Vas vármegyei szakkönyvtár, intézményi eligazítás és 3-lépéses teendőlista a gyanú felmerülésekor.
- **Alapítványunkról (`/rolunk`):** Alapítványi történet (2015 óta), kuratórium és Pohánka Edit AOSZ alelnöki munkájának bemutatása, alapértékek és szervezeti mérföldkövek.
- **Rólunk írták (`/rolunk-irtak`):** Sajtómegjelenések (VAOL, Szombathelyi Televízió), köszönőlevelek, szakmai elismerések és intézményi visszajelzések (Aranyhíd EGYMI).
- **Hírek & Aktualitások (`/hirek`):** Részletes szülőklub meghívók (pl. Bárdosi Emőke gyógypedagógus előadása), Családi Nap 2024 (Vasi Skanzen) beszámoló, továbbképzési tudósítások és önkéntes toborzás.
- **Programok & Események (`/programok`):** Kategóriaszűrős naptár (Kék Séta, Nyári Táborok, Szülőklubok), valamint a támogatott Vas vármegyei intézmények listája (Aranyhíd EGYMI, Micimackó Óvoda stb.).
- **Támogatási Központ (`/tamogatas`):** Egykattintásos vágólapra másoló gombok az adószámhoz (`18654996-1-18`) és CIB számlaszámhoz (`11600006-00000000-75701521`), 4-lépéses eSZJA útmutató és vállalati CSR adókedvezmény tájékoztatás.
- **Dokumentumtár & Pályázatok (`/dokumentumok`):** Alapító okirat, Közhasznúsági beszámolók, Szombathely MJV Önkormányzati Támogatási Rendszer elszámolás (800.000 Ft önkormányzati támogatás, 13 pedagógus képzése) és `DocDownloadButton`.
- **Kapcsolat & AOSZ Info-Pont (`/kapcsolat`):** Szombathelyi irodai elérhetőségek, nyitvatartás és dinamikus téma-előválasztós (`?topic=...`) kapcsolatfelvételi űrlap.

---

## 🛠 Technológiai Stack

- **Keretrendszer:** Next.js 16.3 (App Router, Turbopack)
- **UI & Stílus:** Tailwind CSS v4 (`@tailwindcss/postcss`), Lucide React ikonok
- **Nyelv & Típusbiztonság:** TypeScript 5 (szigorú típusellenőrzés)
- **Tesztelés:** Node.js beépített test runner (`node --test tests/**/*.test.mjs`), 20 automatizált egységteszt
- **Strukturált Adatok (SEO):** JSON-LD Schema.org (`NGO`, `PostalAddress`)

---

## 🚀 Fejlesztési Parancsok

```bash
# Függőségek telepítése
npm install

# Helyi fejlesztői szerver indítása
npm run dev

# Automatizált tesztcsomag futtatása (20 teszt)
npm test

# Kódstílus és linter ellenőrzés
npm run lint

# Típusellenőrzés
npx tsc --noEmit

# Éles verzió fordítása (Turbopack)
npm run build
```

---

## 📑 Jogi és Támogatási Adatok

- **Szervezet:** PontMás Vas Megyei Autista Gyermekekért Alapítvány
- **Székhely:** 9700 Szombathely, Váci M. utca 12. 3./15.
- **AOSZ Info-Pont:** 9700 Szombathely, Sugár út 9.
- **Adószám (Adó 1%):** `18654996-1-18`
- **Bankszámlaszám (CIB Bank):** `11600006-00000000-75701521`
- **E-mail:** `info@pontmas.hu`

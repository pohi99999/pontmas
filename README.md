# PontMás Alapítvány - Hivatalos Weboldal (Prémium Megújítás)

A **PontMás Vas Megyei Autista Gyermekekért Alapítvány** modern, akadálymentesített, Next.js (App Router) és Tailwind CSS alapú hivatalos weboldala.

---

## 🌟 Fő Funkciók és Jellemzők

- **Autizmus-barát és szenszoros mód:** Nyugtató színpaletta, letisztult vizuális hierarchia, és egykattintásos lágy/szenszoros mód kapcsoló az érzékszervi túlterhelés elkerülésére.
- **Akadálymentesség (WCAG 2.1 AA):** Kiváló kontrasztarányok, billentyűzetes fókusz-állapotok (`:focus-visible`), szemantikus HTML5 struktúra és ARIA címkék.
- **Kezdőlap (Home):** Kiemelt küldetés, 4 alappillér, mérőszámok, és közvetlen 1% adományozási gyorsdoboz.
- **Rólunk (`/rolunk`):** Alapítványi történet (2015 óta), kuratórium és Pohánka Edit AOSZ alelnöki szerepének bemutatása, alapértékek és szervezeti hitelesség.
- **Autizmus Tudástár (`/autizmus`):** A spektrum 3 fő pillére, interaktív Gyakran Ismételt Kérdések (FAQ), Tények és Tévhitek összehasonlítás, gyakorlati útmutató szülőknek.
- **Programok & Események (`/programok`):** Kategóriaszűrős naptár (Kék Séta, Nyári Táborok, Szülőklubok), valamint a támogatott Vas vármegyei intézmények listája (Aranyhíd EGYMI, Micimackó Óvoda stb.).
- **Támogatási Központ (`/tamogatas`):** Egykattintásos vágólapra másoló gombok az adószámhoz (`18654996-1-18`) és bankszámlaszámhoz (`11600006-00000000-75701521`), 4-lépéses eSZJA útmutató és vállalati CSR adókedvezmény tájékoztatás.
- **Kapcsolat & AOSZ Info-Pont (`/kapcsolat`):** Szombathelyi AOSZ Info-Pont irodai adatok, nyitvatartási útmutató, és validált, interaktív kapcsolatfelvételi űrlap.

---

## 🛠 Technológiai Stack

- **Keretrendszer:** Next.js 16.3 (App Router, Turbopack)
- **UI & Stílus:** Tailwind CSS v4, Lucide React ikonok
- **Nyelv & Típusbiztonság:** TypeScript 5 (szigorú típusellenőrzés)
- **Tesztelés:** Node.js beépített test runner (`node --test`)
- **Strukturált Adatok (SEO):** JSON-LD Schema.org (`NGO`, `PostalAddress`)

---

## 🚀 Fejlesztési Parancsok

```bash
# Függőségek telepítése
npm install

# Helyi fejlesztői szerver indítása
npm run dev

# Automatizált tesztcsomag futtatása
npm test

# Kódstílus és linter ellenőrzés
npm run lint

# Típusellenőrzés
npx tsc --noEmit

# Éles verzió fordítása
npm run build
```

---

## 📑 Jogi és Támogatási Adatok

- **Szervezet:** PontMás Vas Megyei Autista Gyermekekért Alapítvány
- **Székhely:** 9700 Szombathely, Váci M. utca 12. 3./15.
- **Adószám (Adó 1%):** `18654996-1-18`
- **Bankszámlaszám (CIB Bank):** `11600006-00000000-75701521`
- **E-mail:** `info@pontmas.hu`

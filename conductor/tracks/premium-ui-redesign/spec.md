# Track Spec: Prémium UI/UX és aloldalak megújítása

## 1. Context & Objectives
A PontMás Vas Megyei Autista Gyermekekért Alapítvány weboldalának prémium szintre emelése az `elemzes_es_terv.md` és a Conductor `product-guidelines.md` szerint.

### Fő célkitűzések:
1. **Design rendszer és alapelemek:** Letisztult, autizmus-barát színek, modern tipográfia, egységes komponensek (gombok, kártyák, hero szekciók, navigáció, lábléc).
2. **Kezdőlap (Home) prémium élmény:** Erős vizuális narratíva, egyértelmű CTA gombok (Támogatás, Autizmus ismerettár, Események), statisztikai kiemelések és hitelességi elemek (AOSZ tagság).
3. **Rólunk aloldal (`/rolunk`):** Alapítványi történet, kuratórium bemutatása, küldetés, partnerek.
4. **Autizmus tudástár (`/autizmus`):** Tiszta kártyás elrendezés, infografikák, letölthető segédanyagok szülőknek és pedagógusoknak.
5. **Programok & Események (`/programok`):** Idővonal / eseménynaptár, Kék séta és nyári táborok bemutatása képekkel és beszámolókkal.
6. **Támogatási központ (`/tamogatas`):** 1% adatok egykattintásos másolással és letölthető rendelkező nyilatkozattal, banki átutalási adatok, céges CSR partnerség.
7. **Kapcsolat & AOSZ Info-Pont (`/kapcsolat`):** Interaktív/modern kapcsolatfelvételi űrlap, AOSZ Info-Pont nyitvatartás, térképes megjelenítés.

## 2. Acceptance Criteria
- [ ] Teljes WCAG 2.1 AA akadálymentességi megfelelőség (kontraszt, billentyűzetes fókusz, ARIA).
- [ ] Mobil-első és teljesen reszponzív nézetek (320px - 4k).
- [ ] Szemantikus Next.js 16 App Router felépítés TypeScripttel és Tailwind CSS-szel.
- [ ] 95+ pontszám Lighthouse auditon (Performance, Accessibility, Best Practices, SEO).

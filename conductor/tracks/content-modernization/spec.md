# Track Specification: Teljes Valós Tartalomátültetés és Prémium Portál (pontmas.hu)

## 1. Áttekintés
A PontMás Vas Megyei Autista Gyermekekért Alapítvány hivatalos weboldalának (`https://pontmas.hu/`) teljes tartalmi migrációja és modernizálása. A cél az összes valós történet, szakmai beszámoló, szülőklub meghívó, sajtómegjelenés, segítségnyújtási szolgáltatás és hivatalos dokumentum integrálása a modern Next.js 14 portálba csúcsminőségű UI/UX, animációk és akadálymentességi funkciók kíséretében.

## 2. Funkcionális Követelmények
- **Amiben segíteni tudunk (`/segitseg`):**
  - Mentorszülői hálózat bemutatása és közvetlen kapcsolat
  - AOSZ Info-Pont iroda személyes tanácsadás (Sugár út 9., Szombathely)
  - DATA applikáció támogatási információk és letöltési segédlet
  - Vas vármegyei szakkönyvtár és kölcsönzési lehetőség
  - Intézményi tájékoztató (Aranyhíd EGYMI, Micimackó Óvoda, Váci Mihály Ált. Isk.)
- **Rólunk írták & Sajtómegjelenések (`/rolunk-irtak`):**
  - Köszönőlevelek, elismerések, sajtóhírek kártyás/idővonalas elrendezésben
  - Támogatói és közösségi visszajelzések, médiavisszhangok
- **Hírek, Aktualitások & Események (`/hirek` & `/programok` frissítés):**
  - Szülőklub alkalmak és előadások (pl. „Foglald el magad egy kicsit!”, Bárdosi Emőke előadása)
  - Családi Nap beszámoló (Vasi Skanzen élménynap, kézműves foglalkozások, pszichológiai szülőcsoport)
  - Szakmai pedagógus-továbbképzések (Autizmus Alapítvány 30 órás képzései, 800.000 Ft önkormányzati támogatás felhasználásával)
  - Önkéntes toborzási felhívás interaktív jelentkezési lehetőséggel
- **Pályázatok és Dokumentumtár (`/dokumentumok`):**
  - Szombathely MJV Önkormányzati Támogatási Rendszer elszámolások és támogatások
  - Közhasznúsági és szakmai beszámolók, letölthető PDF-ek
- **Globális Szenzoros / Akadálymentességi Vezérlőpanel (Accessibility Toolbar):**
  - Kontrasztmód váltás, betűméret-szabályozás, mozgáscsökkentés (reduced motion), olvasóvonalzó segéd

## 3. Nem-funkcionális Követelmények
- WCAG 2.1 AA szintű akadálymentesség
- Hibátlan típusbiztonság (TypeScript), szigorú linting és Next.js 14 App Router architektúra
- Teljes körű mobil, tablet és asztali reszponzivitás

## 4. Elfogadási Kritériumok
- Az eredeti pontmas.hu minden releváns szöveges tartalma, híre és programja elérhető a modern portálon.
- Minden hivatkozás, gomb, űrlap és letöltés tesztelt és működőképes.
- Az akadálymentességi eszköztár azonnal és perzisztensen fejti ki hatását az oldal egészére.

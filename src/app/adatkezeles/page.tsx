import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from '@/components/ui/PageHeader';
import { DraftBanner, DraftSources, Review, Section } from '@/components/legal/LegalParts';
import { ADDRESS_LINE, FOUNDATION } from '@/lib/foundation';
import { LEGAL_DRAFT } from '@/lib/legal';
import { LOGIN_TOKEN_TTL_MS, SESSION_TTL_MS } from '@/lib/editorAuth';

// Adatkezelési tájékoztató, DRAFT (src/lib/legal.ts). Every statement about what the site does is
// read from the code (the comment next to it says where; read again on 2026-11-18); the foundation's
// 2024 policy is the source of the rest. What has no source is a [KÉRDÉS], every legal judgement a
// [JOGI ÁTNÉZÉS]. It describes only what the site does today: nothing about a chat, which it has not.

export const metadata: Metadata = {
  title: "Adatkezelési tájékoztató | PontMás Alapítvány",
  description: "Hogyan kezeli a PontMás Alapítvány a weboldal látogatóinak és a kapcsolatfelvételi űrlapot kitöltőknek a személyes adatait.",
  robots: LEGAL_DRAFT ? { index: false, follow: false } : undefined,
};

export default function AdatkezelesPage() {
  return (
    <>
      <PageHeader
        badge="Adatvédelem"
        title="Adatkezelési tájékoztató"
        subtitle="Milyen adatot kezelünk, miért, meddig, és milyen jogai vannak."
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <article className="mx-auto max-w-3xl">
          <DraftBanner />

          <p className="text-lg text-slate-700 leading-relaxed">
            Röviden: a weboldal nem használ sütit a látogatóknál, nem mér látogatottságot és nem követi Önt hirdetési
            célból. Személyes adatot akkor kapunk, ha Ön ír nekünk a kapcsolatfelvételi űrlapon.
          </p>

          <Section id="adatkezelo" title="1. Az adatkezelő">
            <ul className="space-y-1">
              <li><strong>Név:</strong> {FOUNDATION.name}</li>
              <li><strong>Székhely:</strong> {ADDRESS_LINE}</li>
              {/* Edina, 2026-11-13: the number in the foundation's rules is the right one (src/lib/foundation.ts) */}
              <li><strong>Nyilvántartási szám:</strong> {FOUNDATION.registrationNumber}</li>
              <li><strong>Adószám:</strong> {FOUNDATION.taxNumber}</li>
              <li><strong>Telefon:</strong> {FOUNDATION.phone} ({FOUNDATION.contactPerson})</li>
              <li>
                <strong>E-mail:</strong>
                <Review kind="kerdes">
                  Melyik postafiók fogadja az adatvédelmi kérelmeket? A pontmas.hu-s cím mögött még nincs postafiók, a 2024-es
                  szabályzatban álló Gmail-címet pedig az alapítvány kérésére nem tesszük ki.
                </Review>
              </li>
              <li>
                <strong>Képviselő:</strong> {/* Péter's confirmation, 2026-11-10 (Telegram 14695) */}
                Pohánka Edit, a kuratórium elnöke
              </li>
              <li>
                <strong>Adatvédelmi tisztviselő:</strong>
                <Review kind="jogi">Kell-e kijelölni (GDPR 37. cikk)? Ha igen, a neve és az elérhetősége.</Review>
              </li>
            </ul>
          </Section>

          <Section id="latogatas" title="2. A weboldal látogatása">
            {/* measured: the site runs on Vercel (project "pontmas", functions in iad1); no analytics package
                in package.json; no cookie set for visitors (the only cookie is the editor's, section 5) */}
            <p>
              A weboldalt a Vercel Inc. tárhelyszolgáltató szerverei szolgálják ki. A szerver minden kérésnél
              műszaki naplót vezet (például IP-cím, időpont, a kért oldal, a böngésző típusa); ez a biztonságos
              működéshez és a hibák felderítéséhez kell. A naplót mi nem kapcsoljuk össze más adattal, és
              nem használjuk látogatottság mérésére.
              <Review kind="kerdes">
                A napló pontos tartalma és megőrzési ideje a jelenlegi csomagban, a Vercel saját leírásából (a fenti felsorolás
                nem a szolgáltató dokumentumából való).
              </Review>
              <Review kind="kerdes">
                A Vercel-projektben a látogatottságmérés (Web Analytics, Speed Insights) kikapcsolt állapota a projekt
                beállításaiból ellenőrizendő; a weboldal kódjában ilyen mérés nincs.
              </Review>
              <Review kind="jogi">Jogalap: jogos érdek (GDPR 6. cikk (1) f)); érdekmérlegelés szükséges-e írásban?</Review>
            </p>
            <p>
              Az alapítvány 2024-es szabályzata szerint az oldal látogatásakor „sem a felhasználó IP címét, sem más
              személyes adatot nem” rögzítünk. Az új oldal tárhelyének műszaki naplója miatt ez a mondat
              így már nem pontos; ezt a tájékoztatót ehhez igazítottuk.
            </p>
            <p>
              <strong>Böngészőben tárolt beállítások.</strong> A látogatóknál a választott témát (világos vagy sötét) és az akadálymentességi
              beállításokat (például betűméret, nyugtató mód, magas kontraszt) az Ön böngészője tárolja (localStorage),
              hogy a következő látogatáskor is érvényesek legyenek. Ezek nem jutnak el hozzánk, és a böngésző adatainak törlésével bármikor
              törölhetők.
            </p>
            <p>
              <strong>Külső hivatkozások.</strong> A Facebook-csoportunkra és az irodánk térképére mutató link csak
              hivatkozás: az oldal nem tölt be Facebook- vagy Google-tartalmat. Ha a linkre kattint, a Facebook, illetve a
              Google saját adatkezelése érvényes.
            </p>
            {/* read in the code: src/content/kisfilmek.ts and components/content/Kisfilm.tsx (the player loads on a click) */}
            <p>
              <strong>Kisfilmek.</strong> A <Link href="/kisfilmek" className="underline">kisfilmek</Link> oldalán a videók csak
              a lejátszás gombra kattintva töltődnek be a YouTube-ról (youtube-nocookie.com); addig az oldal nem
              kapcsolódik a YouTube-hoz. A lejátszás elindítása után a YouTube (Google) saját adatkezelése érvényes.
            </p>
          </Section>

          <Section id="kapcsolat" title="3. Kapcsolatfelvételi űrlap">
            {/* measured: src/lib/contact.ts validateContact (fields) and sendContact (Resend, plain-text mail,
                nothing stored by the site, nothing logged) */}
            <p>
              Ha Ön a <Link href="/kapcsolat" className="underline">kapcsolat</Link> oldalon ír nekünk, ezeket az adatokat
              kapjuk meg: név, e-mail-cím, telefonszám (nem kötelező), a választott téma és az üzenet szövege.
            </p>
            <p>
              <strong>Cél:</strong> hogy válaszolni tudjunk, és segíteni tudjunk abban, amiben megkeresett.
              <Review kind="jogi">Jogalap: az Ön hozzájárulása (GDPR 6. cikk (1) a)), illetve a kérése alapján tett lépés.</Review>
            </p>
            <p>
              <strong>Hogyan jut el hozzánk:</strong> a weboldal az üzenetet e-mailben továbbítja az alapítvány
              postafiókjába a Resend e-mail-küldő szolgáltatáson keresztül. A weboldal maga az üzenetet nem tárolja és
              nem naplózza.
            </p>
            {/* read in the code: src/app/api/kapcsolat/route.ts (5 sends per 10 minutes per IP, in memory only) */}
            <p>
              <strong>Visszaélés elleni fék:</strong> hogy az űrlapot ne lehessen tömeges küldésre használni, a szerver a
              küldő IP-címét legfeljebb 10 percig a memóriájában tartja (ennyi idő alatt egy címről 5 üzenet küldhető).
              Ezt nem írja lemezre és nem naplózza.
            </p>
            <p>
              <strong>Meddig őrizzük:</strong>
              <Review kind="kerdes">Meddig marad meg az e-mail az alapítvány postafiókjában (például az ügy lezárása után 1 év)?</Review>
            </p>
            <p>
              <strong>Kérjük:</strong> ha nem szükséges, ne írjon az üzenetbe egészségügyi adatot (például diagnózist)
              gyermekéről. Ha mégis ír, azt csak a megkeresés megválaszolására használjuk.
              <Review kind="jogi">
                Egészségügyi adat különleges adat (GDPR 9. cikk). Kell-e ehhez külön, kifejezett hozzájárulás az űrlapon?
              </Review>
            </p>
          </Section>

          <Section id="kepek" title="4. Fényképek a weboldalon">
            {/* measured: src/content/types.ts CHILD_PHOTO_DECLARATION_TEXT; publicImage() shows an image only with it */}
            <p>
              Gyermekről készült, felismerhető fényképet csak a szülő írásos hozzájárulásával teszünk közzé. A
              weboldal szerkesztője minden feltöltött képnél nyilatkozik arról, hogy a képen nincs felismerhető gyermek,
              vagy van írásos szülői hozzájárulás; nyilatkozat nélkül a kép nem jelenik meg. A nyilatkozatot a
              nyilatkozó szerkesztő megjelölésével és az időponttal együtt rögzítjük a kép mellett.
            </p>
            <p>
              Ha egy képen felismeri magát vagy gyermekét, és szeretné, hogy levegyük, kérjük, jelezze: haladéktalanul
              eltávolítjuk.
              <Review kind="jogi">A hozzájárulások megőrzésének helye és ideje.</Review>
            </p>
          </Section>

          <Section id="szerkesztok" title="5. A weboldal szerkesztői">
            {/* read in the code: src/lib/editorAuth.ts (the two times below are its constants, so the text cannot drift
                from them), editorMail.ts (Resend), editorApi.ts (the brakes, the change notice), EditorApp.tsx (the draft) */}
            <p>
              Ez a pont csak az alapítvány munkatársaira vonatkozik, akik a híreket és programokat szerkesztik. A
              belépéshez e-mailben kapnak egy {LOGIN_TOKEN_TTL_MS / 60_000} percig érvényes linket (Resenden keresztül),
              belépés után pedig a böngészőjük egy {SESSION_TTL_MS / 3_600_000} óráig érvényes, csak a belépést igazoló
              sütit kap. Más célra ezt nem használjuk.
            </p>
            <p>
              <strong>Belépési fék:</strong> a belépési kísérleteket a visszaélések ellen korlátozzuk. Ehhez a szerver a
              kérés IP-címét és a megadott e-mail-címet legfeljebb egy óráig a memóriájában tartja; lemezre nem írja.
            </p>
            <p>
              <strong>Piszkozat:</strong> a félbehagyott szerkesztést a szerkesztő saját böngészője tárolja (localStorage);
              ez nem jut el hozzánk.
            </p>
            <p>
              <strong>Értesítés a változásról:</strong> ha az alapítvány ezt beállította, minden mentésről és
              képfeltöltésről e-mail megy az erre kijelölt címére (Resenden keresztül): ki végezte, mi változott, mikor,
              és képfeltöltésnél a kép címe.
            </p>
          </Section>

          <Section id="adatfeldolgozok" title="6. Adatfeldolgozók">
            {/* measured: Vercel project "pontmas" (functions iad1, Blob stores fra1); Resend (RESEND_API_KEY, api.resend.com) */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-300">
                    <th scope="col" className="py-2 pr-4">Szolgáltató</th>
                    <th scope="col" className="py-2 pr-4">Mire használjuk</th>
                    <th scope="col" className="py-2">Hol</th>
                  </tr>
                </thead>
                <tbody className="align-top">
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-4">Vercel Inc. <Review kind="kerdes">cím, a DPA-ból</Review></td>
                    <td className="py-2 pr-4">tárhely, a weboldal futtatása, a hírek képeinek tárolása</td>
                    <td className="py-2">
                      a szerverfunkciók az USA-ban (Washington DC), a képek és a tartalom Frankfurtban
                      <Review kind="kerdes">A hely a 2026. november 10-i lekérdezésből való; hatálybalépés előtt újra ellenőrizendő.</Review>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Resend <Review kind="kerdes">a cég hivatalos neve és címe, a DPA-ból</Review></td>
                    <td className="py-2 pr-4">a kapcsolati üzenetek, a szerkesztői belépőlinkek és a szerkesztői változás-értesítők e-mailes kézbesítése</td>
                    <td className="py-2"><Review kind="kerdes">a szolgáltató adatközpontjának helye</Review></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              <Review kind="jogi">Az USA-ba történő adattovábbítás jogalapja szolgáltatónként (például EU–USA adatvédelmi keretrendszer vagy általános szerződési feltételek).</Review>
            </p>
          </Section>

          <Section id="jogok" title="7. Az Ön jogai">
            <p>
              Kérhet tájékoztatást arról, milyen adatát kezeljük; kérheti az adat helyesbítését, törlését vagy a kezelés
              korlátozását; tiltakozhat az adatkezelés ellen; és ha hozzájárulás alapján kezeljük, a hozzájárulást
              bármikor visszavonhatja. A kérelmére legfeljebb egy hónapon belül válaszolunk.
              <Review kind="jogi">A 2024-es szabályzat 25 napot és 15 napot ír; a GDPR 12. cikke egy hónapot. Melyik legyen?</Review>
            </p>
            <p>
              Ha úgy érzi, hogy megsértettük a jogait, panaszt tehet a Nemzeti Adatvédelmi és Információszabadság
              Hatóságnál, vagy bírósághoz fordulhat.
            </p>
            {/* from the foundation's 2024 policy */}
            <ul className="space-y-1">
              <li><strong>Nemzeti Adatvédelmi és Információszabadság Hatóság</strong></li>
              <li>Cím: 1055 Budapest, Falk Miksa u. 9–11.</li>
              <li>Telefon: 06-1-391-1400</li>
              <li>E-mail: ugyfelszolgalat@naih.hu</li>
              <li>Weboldal: www.naih.hu</li>
            </ul>
            <p><Review kind="kerdes">A hatóság adatai a 2024-es szabályzatból; a naih.hu-n ellenőrizendő, hogy aktuálisak-e.</Review></p>
          </Section>

          <Section id="hataly" title="8. Hatály">
            <p>
              <Review kind="kerdes">A hatálybalépés napja.</Review>
            </p>
            <p>
              Az alapítvány 2024. szeptember 13-án kelt adatvédelmi szabályzata a{' '}
              <Link href="/dokumentumok" className="underline">Dokumentumtárban</Link> letölthető.
            </p>
          </Section>

          <DraftSources />
        </article>
      </div>
    </>
  );
}

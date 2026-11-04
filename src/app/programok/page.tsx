import { Sparkles, School, GraduationCap, Heart } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import ProgramFilter from '@/components/content/ProgramFilter';
import { getPublicContent } from '@/content/publicContent';
import { visiblePrograms } from '@/content/public';

// A server page now, so it can read the editor's store (or the seed); only the category filter
// runs in the browser (ProgramFilter).
export const revalidate = 3600;

export default async function ProgramokPage() {
  const { content } = await getPublicContent();
  const programok = visiblePrograms(content.programs);
  const tamogatottIntezmenyek = [
    { nev: "Aranyhíd EGYMI (Szombathely)", reszlet: "Speciális oktatási-nevelési fejlesztőeszközök, szenzoros szobák felszerelésének támogatása." },
    { nev: "Micimackó Óvoda (Szombathely)", reszlet: "Autizmus-specifikus korai fejlesztő játékok és vizuális támogató eszközök biztosítása." },
    { nev: "Vas Vármegyei Pedagógiai Szakszolgálat", reszlet: "Szakmai együttműködés, diagnosztikai és tanácsadási folyamatok támogatása." },
    { nev: "Integráló általános és középiskolák", reszlet: "Módszertani segítségnyújtás és érzékenyítő előadások a pedagógusok és osztályközösségek számára." }
  ];

  return (
    <div className="pb-20">
      
      {/* 1. Fejléc szekció */}
      <section className="bg-gradient-to-b from-blue-50/80 to-slate-50 pt-16 pb-16 md:pt-20 md:pb-20 border-b border-slate-200/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            as="h1"
            badge="Események & Kezdeményezések"
            badgeIcon={<Sparkles size={14} />}
            title="Programjaink és Rendezvényeink"
            subtitle="Közösséget formálunk, élményeket adunk és intézményeket támogatunk Vas vármegyében. Ismerje meg legfontosabb éves kezdeményezéseinket!"
            align="center"
          />
        </div>
      </section>

      {/* 2. Programok és Események Kategóriaválasztóval */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <ProgramFilter programs={programok} />

      </section>

      {/* 3. Intézményi Támogatások Modul */}
      <section className="bg-gradient-to-b from-slate-100/80 to-slate-50 border-y border-slate-200/80 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <SectionHeader
            badge="Együttműködés"
            badgeIcon={<School size={14} />}
            title="Támogatott intézmények Vas vármegyében"
            subtitle="Nemcsak közvetlenül a családokat segítjük, hanem azokat a szakmai intézményeket is, ahol a gyermekek a mindennapjaikat töltik."
          />

          <div className="grid md:grid-cols-2 gap-6">
            {tamogatottIntezmenyek.map((intezmeny, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{intezmeny.nev}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{intezmeny.reszlet}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-3xl mx-auto space-y-4 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">
              Szeretné, hogy az Ön intézménye is részesüljön támogatásban?
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xl mx-auto">
              Vegye fel velünk a kapcsolatot a konkrét szakmai igények, eszközbeszerzések és érzékenyítő tréningek egyeztetéséhez.
            </p>
            <div className="pt-2">
              <Button href="/kapcsolat" variant="primary" size="md">
                Intézményi megkeresés
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Támogatási felhívás */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-700 to-sky-700 rounded-3xl p-8 sm:p-12 text-white text-center shadow-lg space-y-6">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto text-white">
            <Heart size={24} className="fill-white/30" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Segítsen megvalósítani programjainkat!
          </h2>
          <p className="max-w-2xl mx-auto text-white text-base leading-relaxed">
            Adója 1%-ával vagy közvetlen támogatással Ön is hozzájárulhat a táborok, a Kék séta és a szülőklubok sikeres megszervezéséhez.
          </p>
          <div className="flex justify-center pt-2">
            <Button href="/tamogatas" variant="secondary" size="lg" className="bg-white text-blue-900 hover:bg-blue-50 border-0">
              Támogatási tudnivalók (1%)
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}

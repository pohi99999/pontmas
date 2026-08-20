import Link from 'next/link';
import { Heart, Users, Sparkles, ShieldCheck, HandHeart, School, HelpCircle, ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import FeatureCard from '@/components/ui/FeatureCard';
import Button from '@/components/ui/Button';
import CopyButton from '@/components/ui/CopyButton';

export default function Home() {
  const stats = [
    { value: '2015 óta', label: 'Segítjük a családokat', icon: <Sparkles size={20} className="text-blue-600" /> },
    { value: '40+', label: 'Érintett család hálózatunkban', icon: <Users size={20} className="text-blue-600" /> },
    { value: 'AOSZ', label: 'Országos szövetségi alelnökség', icon: <ShieldCheck size={20} className="text-blue-600" /> },
    { value: '100%', label: 'Közhasznú elhivatottság', icon: <Heart size={20} className="text-blue-600" /> },
  ];

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-20">
      
      {/* 1. Hero Szekció */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-sky-50/40 to-slate-50 pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs sm:text-sm font-semibold mb-6 border border-blue-200/60 shadow-2xs">
              <ShieldCheck size={16} className="text-blue-600" />
              <span>PontMás Vas Megyei Autista Gyermekekért Alapítvány</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
              Közösen egy megértőbb, <br className="hidden sm:inline" />
              <span className="text-blue-700 bg-clip-text">támogatóbb világért</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 leading-relaxed mb-10">
              Autizmussal élő gyermekek, családjaik és oktatási intézmények sokoldalú támogatása Vas vármegyében. Szakértelem, közösség és valódi segítség 2015 óta.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                href="/tamogatas"
                size="lg"
                variant="primary"
                leftIcon={<Heart size={20} className="fill-white/30" />}
              >
                Támogassa munkánkat (1%)
              </Button>
              <Button
                href="/autizmus"
                size="lg"
                variant="outline"
                leftIcon={<HelpCircle size={20} className="text-blue-600" />}
              >
                Mi az az autizmus?
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Statisztikai & Hitelességi Kiemelések */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 md:-mt-16 relative z-10">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md border border-slate-200/80 p-6 md:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center p-2">
                <div className="p-2.5 rounded-xl bg-blue-50 mb-3 text-blue-600">
                  {stat.icon}
                </div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{stat.value}</span>
                <span className="text-xs sm:text-sm text-slate-500 font-medium mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Fő Tevékenységek & Pillérek */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Küldetésünk & Tevékenységeink"
          title="Hogyan segítünk a mindennapokban?"
          subtitle="Összetett támogatási rendszert működtetünk, amely a gyermekektől a szülőkön át az intézményekig minden érintettre kiterjed."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Users size={28} />}
            title="Közösségépítés"
            description="Szülőklubok, Kék séták és képességfejlesztő nyári táborok, ahol az érintett családok megértő és biztonságos közegben kapcsolódhatnak."
            linkHref="/programok"
            linkLabel="Eseményeink"
          />

          <FeatureCard
            icon={<HelpCircle size={28} />}
            title="Szemléletformálás"
            description="Edukációs anyagok, tájékoztatók és rendezvények az autizmus társadalmi megértésének és elfogadásának növeléséért."
            linkHref="/autizmus"
            linkLabel="Tudástár"
          />

          <FeatureCard
            icon={<School size={28} />}
            title="Intézményi segítség"
            description="Vas vármegyei autizmus-specifikus és integráló iskolák, óvodák támogatása speciális fejlesztőeszközökkel."
            linkHref="/programok"
            linkLabel="Támogatottak"
          />

          <FeatureCard
            icon={<HandHeart size={28} />}
            title="Krízis Alap"
            description="Célzott anyagi és eszközbeli gyorssegély a váratlanul nehéz élethelyzetbe került érintett családok számára."
            linkHref="/tamogatas"
            linkLabel="Támogatás"
          />
        </div>
      </section>

      {/* 4. Kiemelt 1% és Adományozási Gyorsdoboz */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          
          <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-400/30">
                <Heart size={14} className="fill-blue-300" />
                <span>Rendelkezzen adója 1%-áról!</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Egyetlen kattintás az Ön részéről, óriási segítség a családoknak
              </h2>
              <p className="text-blue-100 text-base leading-relaxed">
                A személyi jövedelemadó 1%-ának felajánlása Önnek semmibe sem kerül, de számunkra a táborok, a szülőklubok és a krízis alap biztonságos működését jelenti.
              </p>
              <div className="pt-2">
                <Link
                  href="/tamogatas"
                  className="inline-flex items-center text-sm font-bold text-sky-300 hover:text-white transition-colors group"
                >
                  <span>Minden támogatási lehetőség megtekintése</span>
                  <ArrowRight size={16} className="ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white rounded-2xl p-6 text-slate-900 shadow-lg space-y-4">
              <h3 className="font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-2">
                PontMás Alapítvány Adatok
              </h3>
              
              <div>
                <CopyButton
                  textToCopy="18654996-1-18"
                  label="Adószám (Adó 1%)"
                  sublabel="Kattintson az adószám vágólapra másolásához"
                />
              </div>

              <div>
                <CopyButton
                  textToCopy="11600006-00000000-75701521"
                  label="Bankszámlaszám (CIB Bank)"
                  sublabel="Közvetlen banki átutaláshoz"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Közösség & AOSZ Info-Pont Hívószó */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-200/80 rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold text-slate-900">
              Kérdése van, vagy segítségre van szüksége?
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xl">
              Látogasson el szombathelyi AOSZ Info-Pont irodánkba, vagy írjon nekünk közvetlenül üzenetet.
            </p>
          </div>
          <Button href="/kapcsolat" variant="primary" size="md" className="flex-shrink-0">
            Kapcsolatfelvétel
          </Button>
        </div>
      </section>

    </div>
  );
}

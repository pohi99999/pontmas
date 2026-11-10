import Link from 'next/link';
import { Heart, Users, HandHeart, School, HelpCircle, ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import FeatureCard from '@/components/ui/FeatureCard';
import Button from '@/components/ui/Button';
import CopyButton from '@/components/ui/CopyButton';
import PontJel from '@/components/brand/PontJel';
import CtaBand from '@/components/ui/CtaBand';
import { EGYSZAZALEK, forint } from '@/content/egyszazalek';
import { FOUNDATION } from '@/lib/foundation';

export default function Home() {
  const stats = [
    { value: '2015 óta', label: 'Segítjük a családokat' },
    { value: '40+', label: 'Érintett család hálózatunkban' },
    { value: 'AOSZ', label: 'Országos szövetségi alelnökség' },
  ];

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-20">
      
      {/* 1. Hero: the logo's sphere is the picture. A photo goes into the sphere once the foundation sends one. */}
      <section className="border-b border-slate-200/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-10 md:pb-14">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-6 items-center">
            <div className="lg:col-span-7 min-w-0">
              <p className="eyebrow mb-6">
                <span className="pont" aria-hidden="true" />
                {FOUNDATION.name}
              </p>
              <h1 className="text-[2.75rem] leading-[1.08] sm:text-6xl lg:text-[3.25rem] xl:text-[4.25rem] text-slate-900 mb-7">
                Közösen egy megértőbb, <br className="hidden sm:inline" />
                <span className="text-blue-700">támogatóbb világért</span>
              </h1>
              <p className="max-w-xl text-lg sm:text-xl text-slate-600 leading-relaxed mb-9">
                Autizmussal élő gyermekek, családjaik és oktatási intézmények sokoldalú támogatása Vas vármegyében. Szakértelem, közösség és valódi segítség 2015 óta.
              </p>
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4 [&>*]:whitespace-nowrap">
                <Button href="/tamogatas" size="lg" variant="primary" leftIcon={<Heart size={20} className="fill-white/30" />}>
                  Támogassa munkánkat (1%)
                </Button>
                <Button href="/autizmus" size="lg" variant="outline" leftIcon={<HelpCircle size={20} className="text-blue-600" />}>
                  Mi az az autizmus?
                </Button>
              </div>
            </div>
            <div className="lg:col-span-5 min-w-0">
              <div className="relative mx-auto max-w-[300px] sm:max-w-[380px] lg:max-w-[480px]" aria-hidden="true">
                <span className="lufi z-10" style={{ width: '10%', aspectRatio: '1', left: '58%', top: '13%' }} />
                <span className="lufi z-10" style={{ width: '5.5%', aspectRatio: '1', left: '45%', top: '21%' }} />
                <span className="lufi z-10" style={{ width: '3.6%', aspectRatio: '1', left: '74%', top: '20%' }} />
                <PontJel />
              </div>
            </div>
          </div>

          {/* The facts in one row */}
          <dl className="mt-12 md:mt-16 grid sm:grid-cols-3 gap-6 sm:gap-10 border-t border-slate-200 pt-8">
            {stats.map((stat) => (
              <div key={stat.value}>
                <dt className="display text-3xl md:text-4xl text-slate-900">{stat.value}</dt>
                <dd className="text-[15px] text-slate-600 mt-1">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 3. Fő Tevékenységek & Pillérek */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid xl:grid-cols-12 gap-x-10">
        <div className="xl:col-span-5 min-w-0">
        <SectionHeader
          align="left"
          className="xl:sticky xl:top-28"
          badge="Küldetésünk és tevékenységeink"
          title="Hogyan segítünk a mindennapokban?"
          subtitle="Összetett támogatási rendszert működtetünk, amely a gyermekektől a szülőkön át az intézményekig minden érintettre kiterjed."
        />

        </div>
        <div className="xl:col-span-7 min-w-0 grid sm:grid-cols-2 gap-x-10 gap-y-12">
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
        </div>
      </section>

      {/* 4. Donation: a full-width deep blue band, the tax and bank numbers in one row */}
      <section className="bg-blue-950 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-4xl">
            <p className="eyebrow mb-5" style={{ color: '#c9d5ec' }}>
              <span className="pont" aria-hidden="true" />
              Rendelkezzen adója 1%-áról!
            </p>
            <h2 className="text-4xl sm:text-5xl text-white leading-[1.1] mb-6">
              Egyetlen kattintás az Ön részéről, óriási segítség a családoknak
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed max-w-2xl mb-8">
              A személyi jövedelemadó 1%-ának felajánlása Önnek semmibe sem kerül, de számunkra a táborok, a szülőklubok és a krízis alap biztonságos működését jelenti.
            </p>
            {/* What the 1% brought, from the NAV's list (src/content/egyszazalek.ts); the source stays visible */}
            <figure className="border-l-2 border-blue-400 pl-5 max-w-2xl mb-8">
              <p className="text-white text-xl sm:text-2xl leading-snug">
                {EGYSZAZALEK.evben} <strong className="font-semibold">{EGYSZAZALEK.felajanlok} adózó</strong> 1%-a összesen{' '}
                <strong className="font-semibold">{forint(EGYSZAZALEK.osszeg)}</strong>-tal támogatta a vasi autista gyermekeket és családjaikat.
              </p>
              <figcaption className="mt-2 text-sm text-blue-200">Forrás: NAV, {EGYSZAZALEK.kozzeteve}</figcaption>
            </figure>
            <Link
              href="/tamogatas"
              className="inline-flex items-center text-sm font-semibold text-blue-100 underline decoration-blue-400 underline-offset-4 hover:text-white transition-colors"
            >
              <span>Minden támogatási lehetőség megtekintése</span>
              <ArrowRight size={16} className="ml-1.5" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-6 mt-10 text-slate-900">
            <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-2 mb-4">
              PontMás Alapítvány Adatok
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <CopyButton
                textToCopy={FOUNDATION.taxNumber}
                label="Adószám (adó 1%)"
                sublabel="Kattintson az adószám vágólapra másolásához"
              />
              <CopyButton
                textToCopy={FOUNDATION.bankAccount}
                label={`Bankszámlaszám (${FOUNDATION.bankName})`}
                sublabel="Közvetlen banki átutaláshoz"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Kapcsolatfelvétel hívószó */}
      <CtaBand
        title="Kérdése van, vagy segítségre van szüksége?"
        text="Hívjon minket telefonon, vagy írjon nekünk közvetlenül üzenetet."
      >
        <Button href="/kapcsolat" variant="primary">
          Kapcsolatfelvétel
        </Button>
      </CtaBand>

    </div>
  );
}

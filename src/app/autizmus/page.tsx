"use client";

import { useState } from 'react';
import { Brain, MessageCircle, RefreshCw, ShieldCheck, AlertCircle, Heart, BookOpen, ChevronDown, Sparkles, HelpCircle, Download } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';

export default function AutizmusPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const spektrumJellemzok = [
    {
      icon: <MessageCircle size={28} />,
      title: "Kommunikáció és Szociális interakció",
      desc: "Nehézséget okozhat a nonverbális jelzések, a mimika, a testbeszéd vagy a metaforák megértése. Jellemző az egyenes, őszinte és közvetlen kommunikáció."
    },
    {
      icon: <RefreshCw size={28} />,
      title: "Rugalmasság és Kiszámíthatóság",
      desc: "A megszokott napirend, a vizuális időrend és a strukturált környezet biztonságot nyújt. A váratlan változások átmeneti feszültséget kelthetnek."
    },
    {
      icon: <Brain size={28} />,
      title: "Szenzoros érzékenység",
      desc: "Az érzékszervi ingerek (fények, zajok, érintések, textúrák) feldolgozása egyedi; hiper- vagy hiposzenzitivitás is előfordul a spektrumon."
    }
  ];

  const tenyekTevhitek = [
    {
      myth: "Az autizmus egy betegség, amelyből ki lehet gyógyulni.",
      fact: "Az autizmus nem betegség, hanem idegrendszeri fejlődési sajátosság. Megfelelő korai fejlesztéssel és támogató közeggel az érintettek képességei kibontakoztathatók.",
    },
    {
      myth: "Az autista emberek nem akarnak barátkozni és nincsenek érzéseik.",
      fact: "Nagyon is vágynak a kapcsolódásra és mély érzéseik vannak; csupán a szociális szabályok kifejezése és értelmezése terén igényelnek megértést.",
    },
    {
      myth: "Minden autista zseniális képességekkel rendelkezik (Savant-szindróma).",
      fact: "Mint minden ember, az autizmussal élők is egyedi profilúak: mindenkinek megvannak az egyéni erősségei és a támogatást igénylő területei.",
    },
    {
      myth: "A rideg szülői nevelés okozza az autizmust.",
      fact: "Tudományosan megdöntött tévhit. Az autizmus genetikai és biológiai tényezők összetett hátterére vezethető vissza, semmi köze a szülői gondoskodáshoz.",
    }
  ];

  const faqs = [
    {
      question: "Mik az autizmus legkorábbi jelei kisgyermekkorban?",
      answer: "A szemkontaktus tartásának ritkasága, a névre való válaszadás késése, a közös figyelem (mutatás) elmaradása, a beszédfejlődés megakadása, valamint az ismétlődő mozgások (pl. repkedés, sorba rendezés) adhatnak okot szakember felkeresésére."
    },
    {
      question: "Hová fordulhatok Vas vármegyében diagnosztikai vizsgálatért?",
      answer: "A Vas Vármegyei Pedagógiai Szakszolgálat Szakértői Bizottságához, illetve a gyermekorvos vagy védőnő javaslatára gyermekpszichiátriai szakrendelésre. Szombathelyi AOSZ Info-Pont irodánkban készséggel segítünk eligazodni az eljárásban."
    },
    {
      question: "Hogyan segíthet a család a mindennapi napirend kialakításában?",
      answer: "Vizuális napirendkártyák (PECS, napirendi sávok), előrejelzések ('5 perc múlva indulunk') és ingerszegény pihenősarok kialakítása bizonyítottan megkönnyíti a zökkenőmentes hétköznapokat."
    },
    {
      question: "Milyen támogatást nyújt a PontMás Alapítvány a szülőknek?",
      answer: "Havi szülőklubokat, szakértői tanácsadást, intézményi segítségnyújtást, nyári táborokat és rendkívüli krízishelyzet esetén közvetlen anyagi támogatást biztosítunk."
    }
  ];

  const tanacsokSzuloknek = [
    "Ne maradjon egyedül: csatlakozzon a PontMás Alapítvány szülői közösségéhez, ahol megértő sorstársakra talál.",
    "Azonosítsa gyermeke szenzoros igényeit (zajszűrő fülvédő, lágy fények, kényelmes ruházat).",
    "Alkalmazzon vizuális segítséget: a képekkel támogatott kommunikáció jelentősen csökkenti a szorongást.",
    "Fókuszáljon a kis sikerekre és a gyermek egyedi erősségeire minden nap."
  ];

  return (
    <div className="pb-20">
      
      {/* 1. Fejléc szekció */}
      <section className="bg-gradient-to-b from-blue-50/80 to-slate-50 pt-16 pb-16 md:pt-20 md:pb-20 border-b border-slate-200/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Tudástár & Útmutató"
            badgeIcon={<Sparkles size={14} />}
            title="Mi az az autizmus?"
            subtitle="Az autizmus nem betegség, hanem egy eltérő fejlődésmenet és észlelési sajátosság. Ismerje meg a spektrum működését szakmai, mégis közérthető formában."
            align="center"
          />
        </div>
      </section>

      {/* 2. Spektrum Jellemzők (3 Pillér) */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          badge="A Spektrum Fő Területei"
          title="A működés sokszínűsége"
          subtitle="Nincs két egyforma autista ember: a képességek, kihívások és erősségek kombinációja egyedi mintázatot alkot."
        />

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {spektrumJellemzok.map((jellemzo, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all flex flex-col">
              <div className="text-blue-600 mb-6 bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xs">
                {jellemzo.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{jellemzo.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed flex-grow">{jellemzo.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Tények és Tévhitek */}
      <section className="bg-slate-100/70 border-y border-slate-200/80 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <SectionHeader
            badge="Tévhitoszlató"
            title="Tények és Tévhitek az autizmusról"
            subtitle="A társadalmi előítéletek lebontása a helyes és pontos ismeretek átadásával kezdődik."
          />

          <div className="grid md:grid-cols-2 gap-6">
            {tenyekTevhitek.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
                <div className="flex items-start gap-3 bg-red-50 text-red-900 p-3.5 rounded-xl border border-red-100">
                  <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-red-600 block mb-0.5">Tévhit</span>
                    <p className="text-sm font-semibold text-slate-800">{item.myth}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-emerald-50 text-emerald-950 p-3.5 rounded-xl border border-emerald-100">
                  <ShieldCheck className="text-emerald-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-0.5">Tény</span>
                    <p className="text-sm text-slate-700 leading-relaxed">{item.fact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Gyakorlati Tanácsok Szülőknek */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl">
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/30 flex items-center justify-center text-blue-300">
              <Heart size={24} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">Gyakorlati tanácsok érintett szülőknek</h2>
              <p className="text-xs text-blue-200">A PontMás szakmai tapasztalatai alapján</p>
            </div>
          </div>

          <div className="space-y-4">
            {tanacsokSzuloknek.map((tanacs, i) => (
              <div key={i} className="flex items-start gap-3.5 bg-white/10 p-4 rounded-xl border border-white/10">
                <BookOpen className="text-sky-300 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-slate-100 text-sm leading-relaxed font-medium">{tanacs}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Gyakori Kérdések (FAQ) */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl">
        <SectionHeader
          badge="Gyakori Kérdések"
          badgeIcon={<HelpCircle size={14} />}
          title="Gyakran Ismételt Kérdések (FAQ)"
          subtitle="Összegyűjtöttük a leggyakrabban felmerülő kérdéseket a diagnózistól a fejlesztési lehetőségekig."
        />

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 text-left font-bold text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg">{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Letölthető anyagok és Kapcsolat CTA */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-blue-50 border border-blue-200/80 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold text-slate-900">
              További hivatalos dokumentumokra és nyilatkozatokra van szüksége?
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Tekintse meg letölthető közhasznúsági beszámolóinkat, vagy vegye fel a kapcsolatot szakértőinkkel.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <Button href="/dokumentumok" variant="primary" size="md" leftIcon={<Download size={16} />}>
              Dokumentumtár
            </Button>
            <Button href="/kapcsolat" variant="outline" size="md">
              Kapcsolatfelvétel
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}

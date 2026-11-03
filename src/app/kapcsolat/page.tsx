import { MapPin, Phone, MessageSquare, Sparkles, ExternalLink } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import ContactForm from '@/components/forms/ContactForm';

export default function KapcsolatPage() {
  return (
    <div className="pb-20">
      
      {/* 1. Fejléc szekció */}
      <section className="bg-gradient-to-b from-blue-50/80 to-slate-50 pt-16 pb-16 md:pt-20 md:pb-20 border-b border-slate-200/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            as="h1"
            badge="Elérhetőség"
            badgeIcon={<Sparkles size={14} />}
            title="Lépjen kapcsolatba velünk!"
            subtitle="Forduljon hozzánk bizalommal kérdéseivel, tanácsadási igényével: hívjon minket telefonon, vagy írjon nekünk az űrlapon."
            align="center"
          />
        </div>
      </section>

      {/* 2. Kapcsolati és Irodai Információk + Form */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12">
          
          {/* Bal oszlop: Elérhetőségek */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Közvetlen elérhetőségek */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Székhely & Cím</h2>
                  <p className="text-slate-600 text-sm mt-0.5">9700 Szombathely, Váci M. utca 12. 3./15.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Kapcsolattartó</h2>
                  <p className="text-slate-600 text-sm mt-0.5">Rumi Edina</p>
                  <a href="tel:+36209698715" className="text-blue-600 hover:text-blue-800 font-semibold text-sm mt-0.5 block">
                    +36 20 969 8715
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Közösségi Csoport</h2>
                  <a 
                    href="https://www.facebook.com/groups/1622445488007296/?locale=hu_HU" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm mt-0.5 inline-flex items-center gap-1"
                  >
                    <span>Zárt Facebook csoportunk</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Jobb oszlop: Kapcsolati űrlap */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>
      </section>

    </div>
  );
}

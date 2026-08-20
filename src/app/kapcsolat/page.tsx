import { MapPin, Mail, MessageSquare, Clock, ShieldCheck, Sparkles, ExternalLink, Users } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import ContactForm from '@/components/forms/ContactForm';

export default function KapcsolatPage() {
  return (
    <div className="pb-20">
      
      {/* 1. Fejléc szekció */}
      <section className="bg-gradient-to-b from-blue-50/80 to-slate-50 pt-16 pb-16 md:pt-20 md:pb-20 border-b border-slate-200/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Elérhetőség"
            badgeIcon={<Sparkles size={14} />}
            title="Lépjen kapcsolatba velünk!"
            subtitle="Forduljon hozzánk bizalommal kérdéseivel, tanácsadási igényével, vagy látogasson el személyesen szombathelyi AOSZ Info-Pont irodánkba."
            align="center"
          />
        </div>
      </section>

      {/* 2. Kapcsolati és Irodai Információk + Form */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12">
          
          {/* Bal oszlop: Elérhetőségek és AOSZ Info-Pont */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* AOSZ Info-Pont Doboz */}
            <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-3xl p-8 shadow-md border border-blue-800 space-y-4">
              <div className="flex items-center gap-3 border-b border-blue-800/80 pb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg">AOSZ Info-Pont Szombathely</h3>
                  <span className="text-xs text-blue-200">Hivatalos információs iroda</span>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Az Autisták Országos Szövetségének regionális pontjaként ingyenes szakmai, intézményi és jogi útmutatást nyújtunk az érintett családoknak és szakembereknek.
              </p>

              <div className="pt-2 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-sky-300 flex-shrink-0" />
                  <span>Előzetes időpont-egyeztetéssel nyitva</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-sky-300 flex-shrink-0" />
                  <span>Személyes és online konzultáció</span>
                </div>
              </div>
            </div>

            {/* Közvetlen elérhetőségek */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Székhely & Cím</h4>
                  <p className="text-slate-600 text-sm mt-0.5">9700 Szombathely, Váci M. utca 12. 3./15.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">E-mail cím</h4>
                  <a href="mailto:info@pontmas.hu" className="text-blue-600 hover:text-blue-800 font-semibold text-sm mt-0.5 block">
                    info@pontmas.hu
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Közösségi Csoport</h4>
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

import { MapPin, Mail, MessageSquare } from 'lucide-react';
import ContactForm from '@/components/forms/ContactForm';

export default function KapcsolatPage() {
  return (
    <div className="pb-16">
      <section className="bg-slate-50 pt-12 pb-16 border-b border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Kapcsolat</h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600">
            Lépjen velünk kapcsolatba kérdéseivel, vagy látogasson el az AOSZ Info-Pont irodába Szombathelyen.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          
          {/* Elérhetőségek */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Elérhetőségeink</h2>
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full text-blue-700 mr-4 flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Székhely és AOSZ Info-Pont</h3>
                  <p className="text-slate-600 mt-1">9700 Szombathely, Váci M. utca 12. 3./15.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full text-blue-700 mr-4 flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">E-mail cím</h3>
                  <a href="mailto:info@pontmas.hu" className="text-blue-600 hover:underline mt-1 block">info@pontmas.hu</a>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full text-blue-700 mr-4 flex-shrink-0">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Közösségi Média</h3>
                  <a href="https://www.facebook.com/groups/1622445488007296/?locale=hu_HU" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-1 block">
                    Zárt Facebook csoportunk érintetteknek
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Dinamikus Üzenetküldő űrlap */}
          <ContactForm />

        </div>
      </section>
    </div>
  );
}

import { MapPin, Mail, MessageSquare, Send } from 'lucide-react';

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

          {/* Üzenetküldő űrlap */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Írjon nekünk</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="nev" className="block text-sm font-medium text-slate-700 mb-1">Név</label>
                <input type="text" id="nev" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder="Az Ön neve" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">E-mail cím</label>
                <input type="email" id="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder="pelda@email.hu" />
              </div>
              <div>
                <label htmlFor="uzenet" className="block text-sm font-medium text-slate-700 mb-1">Üzenet</label>
                <textarea id="uzenet" rows={4} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none" placeholder="Miben segíthetünk?"></textarea>
              </div>
              <button type="button" className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                Üzenet küldése <Send size={18} className="ml-2" />
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from 'react';
import { Receipt, Landmark, Briefcase, HeartHandshake, Copy, Check } from 'lucide-react';

export default function TamogatasPage() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: 'tax' | 'bank') => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 3000);
  };

  return (
    <div className="pb-16">
      <section className="bg-blue-600 pt-16 pb-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <HeartHandshake size={48} className="text-blue-200" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Támogassa munkánkat!</h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-blue-100">
            Minden segítség számít. Az Ön támogatásával még több Vas vármegyei autista gyermeknek és családjának tudunk kapaszkodót nyújtani.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          
          {/* Adó 1% Kártya */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 flex flex-col h-full transition-all">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 mb-6">
              <Receipt size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Adó 1% felajánlás</h3>
            <p className="text-slate-600 mb-6 flex-grow">
              Rendelkezzen személyi jövedelemadója 1%-áról alapítványunk javára, és támogassa programjainkat extra költségek nélkül!
            </p>
            <button 
              onClick={() => copyToClipboard('18654996-1-18', 'tax')}
              className="w-full text-left bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-blue-400 group transition-all flex justify-between items-center"
            >
              <div>
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Adószámunk</span>
                <span className="block text-xl font-bold text-slate-900 tracking-wider">18654996-1-18</span>
              </div>
              <div className="text-slate-400 group-hover:text-blue-600 transition-colors">
                {copiedText === 'tax' ? <Check className="text-green-600" size={20} /> : <Copy size={20} />}
              </div>
            </button>
          </div>

          {/* Közvetlen utalás Kártya */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 flex flex-col h-full transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">Leggyorsabb</div>
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 mb-6">
              <Landmark size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Banki átutalás</h3>
            <p className="text-slate-600 mb-6 flex-grow">
              Egyszeri vagy rendszeres pénzbeli adományával közvetlenül hozzájárulhat krízis alapunkhoz és az intézmények támogatásához.
            </p>
            <button 
              onClick={() => copyToClipboard('11600006-00000000-75701521', 'bank')}
              className="w-full text-left bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-blue-400 group transition-all flex justify-between items-center"
            >
              <div>
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Bankszámlaszámunk</span>
                <span className="block text-base font-bold text-slate-900 font-mono tracking-tight">11600006-00000000-75701521</span>
              </div>
              <div className="text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2">
                {copiedText === 'bank' ? <Check className="text-green-600" size={20} /> : <Copy size={20} />}
              </div>
            </button>
          </div>

          {/* Vállalati Támogatás Kártya */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 flex flex-col h-full transition-all">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 mb-6">
              <Briefcase size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Céges együttműködés</h3>
            <p className="text-slate-600 mb-6 flex-grow">
              Legyen a partnerünk! Célzott CSR programok, eseményszponzoráció vagy természetbeni adományok formájában.
            </p>
            <div className="mt-auto">
              <a href="mailto:info@pontmas.hu" className="block w-full text-center bg-white border-2 border-blue-600 text-blue-600 font-bold py-3 px-4 rounded-xl hover:bg-blue-50 transition-colors">
                Vegyük fel a kapcsolatot
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

import { FileText, Download, Archive, Award } from 'lucide-react';

export default function DokumentumokPage() {
  return (
    <div className="pb-16">
      {/* Fejléc szekció */}
      <section className="bg-slate-50 pt-12 pb-16 border-b border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Dokumentumtár és Pályázatok</h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600">
            Az átláthatóság és a megbízhatóság alapítványunk alapköve. Itt találja hivatalos dokumentumainkat, éves beszámolóinkat és pályázati anyagainkat.
          </p>
        </div>
      </section>

      {/* Tartalmi szekció */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          
          {/* Hivatalos Iratok és Beszámolók */}
          <div>
            <div className="flex items-center mb-6">
              <Archive className="text-blue-600 mr-3" size={28} />
              <h2 className="text-2xl font-bold text-slate-900">Hivatalos iratok</h2>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <ul className="divide-y divide-slate-100">
                <li className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center">
                    <FileText className="text-slate-400 mr-3 group-hover:text-blue-600 transition-colors" size={20} />
                    <span className="font-medium text-slate-700 group-hover:text-blue-700 transition-colors">Alapító Okirat</span>
                  </div>
                  <Download className="text-slate-300 group-hover:text-blue-600 transition-colors" size={18} />
                </li>
                <li className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center">
                    <FileText className="text-slate-400 mr-3 group-hover:text-blue-600 transition-colors" size={20} />
                    <span className="font-medium text-slate-700 group-hover:text-blue-700 transition-colors">2023. évi Közhasznúsági Beszámoló</span>
                  </div>
                  <Download className="text-slate-300 group-hover:text-blue-600 transition-colors" size={18} />
                </li>
                <li className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center">
                    <FileText className="text-slate-400 mr-3 group-hover:text-blue-600 transition-colors" size={20} />
                    <span className="font-medium text-slate-700 group-hover:text-blue-700 transition-colors">2022. évi Közhasznúsági Beszámoló</span>
                  </div>
                  <Download className="text-slate-300 group-hover:text-blue-600 transition-colors" size={18} />
                </li>
              </ul>
            </div>
            <p className="text-sm text-slate-500 mt-4 px-2">A dokumentumok PDF formátumban tölthetők le. (Feltöltés alatt)</p>
          </div>

          {/* Pályázatok és Támogatások */}
          <div>
            <div className="flex items-center mb-6">
              <Award className="text-blue-600 mr-3" size={28} />
              <h2 className="text-2xl font-bold text-slate-900">Pályázatok</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Városi Civil Alap 2024</h3>
                <p className="text-slate-600 text-sm mb-4">
                  A nyári képességfejlesztő táborok és a közösségi programok megvalósítására elnyert támogatás összefoglalója.
                </p>
                <button className="text-blue-600 font-medium text-sm flex items-center hover:text-blue-800 transition-colors">
                  Részletek és beszámoló <Download className="ml-1" size={16} />
                </button>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Eszközbeszerzési Pályázat 2023</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Speciális fejlesztő eszközök beszerzése a szombathelyi integrált oktatási intézmények részére.
                </p>
                <button className="text-blue-600 font-medium text-sm flex items-center hover:text-blue-800 transition-colors">
                  Részletek és beszámoló <Download className="ml-1" size={16} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

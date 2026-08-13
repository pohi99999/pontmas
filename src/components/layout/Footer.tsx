import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div>
          <p className="font-semibold text-slate-800">PontMás Vas Megyei Autista Gyermekekért Alapítvány</p>
          <p className="text-sm text-slate-500 mt-1">9700 Szombathely, Váci M. utca 12. 3./15.</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <Link href="/dokumentumok" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors underline-offset-4 hover:underline">
            Dokumentumtár és Pályázatok
          </Link>
          
          <div className="text-sm text-slate-500 md:text-right">
            <p>Adószám: <span className="font-semibold text-slate-700">18654996-1-18</span></p>
            <p>Számlaszám: <span className="font-semibold text-slate-700">11600006-00000000-75701521</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
}

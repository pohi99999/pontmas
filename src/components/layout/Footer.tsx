export default function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div>
          <p className="font-semibold text-slate-800">PontMás Vas Megyei Autista Gyermekekért Alapítvány</p>
          <p className="text-sm text-slate-500 mt-1">9700 Szombathely, Váci M. utca 12. 3./15.</p>
        </div>
        <div className="text-sm text-slate-500">
          <p>Adószám: 18654996-1-18</p>
          <p>Számlaszám: 11600006-00000000-75701521</p>
        </div>
      </div>
    </footer>
  );
}

import Image from 'next/image';
import { AMIERT_DOLGOZUNK, SZULOI_GONDOLATOK } from '@/content/hangunk';
import { CSAPAT, lathatoCsapat } from '@/content/csapat';

// "Amiért dolgozunk": the foundation's own sentences (src/content/hangunk.ts), large, no quotation marks
// and no names, so nothing reads as a parent's quote.
export function AmiertDolgozunk() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-5xl" aria-labelledby="amiert-dolgozunk">
      <p className="eyebrow mb-4">
        <span className="pont" aria-hidden="true" />
        PontMás Alapítvány
      </p>
      <h2 id="amiert-dolgozunk" className="text-3xl sm:text-4xl text-slate-900 mb-10">Amiért dolgozunk</h2>
      <ul className="grid gap-x-12 gap-y-10 md:grid-cols-2">
        {AMIERT_DOLGOZUNK.map((m) => (
          <li key={m.szoveg} className="border-l-2 border-blue-400 pl-5">
            <p className="display text-xl sm:text-2xl leading-snug text-slate-900">{m.szoveg}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Parents' thoughts: renders nothing until real, consented ones are in src/content/hangunk.ts.
export function SzuloiGondolatok() {
  if (!SZULOI_GONDOLATOK.length) return null;
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 max-w-5xl" aria-labelledby="szuloi-gondolatok">
      <h2 id="szuloi-gondolatok" className="text-2xl sm:text-3xl text-slate-900 mb-8">Amit a családoktól hallunk</h2>
      <ul className="grid gap-8 md:grid-cols-2">
        {SZULOI_GONDOLATOK.map((g) => (
          <li key={g.szoveg}>
            <blockquote className="display text-xl leading-snug text-slate-900">„{g.szoveg}”</blockquote>
          </li>
        ))}
      </ul>
    </section>
  );
}

// The people of the foundation: renders nothing until a portrait is published (src/content/csapat.ts).
export function CsapatSor() {
  const tagok = lathatoCsapat(CSAPAT);
  if (!tagok.length) return null;
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 max-w-5xl" aria-labelledby="csapat">
      <h2 id="csapat" className="text-2xl sm:text-3xl text-slate-900 mb-8">Kik vagyunk</h2>
      <ul className="grid gap-8 grid-cols-2 md:grid-cols-4">
        {tagok.map((t) => (
          <li key={t.nev}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100">
              <Image src={t.foto as string} alt={t.nev} fill sizes="(min-width: 768px) 220px, 45vw" className="object-cover" />
            </div>
            <p className="mt-3 font-bold text-slate-900">{t.nev}</p>
            <p className="text-sm text-slate-600">{t.szerep}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

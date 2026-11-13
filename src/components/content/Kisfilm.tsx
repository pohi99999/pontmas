'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { lejatszoUrl, type Kisfilm as KisfilmAdat } from '@/content/kisfilmek';

// A short film that loads nothing from YouTube until the visitor asks for it: first a play button on the brand
// background (or on the film's own still from public/), and only the click puts the player
// (youtube-nocookie.com) on the page. Before that click no request goes to YouTube or Google.
export default function Kisfilm({ film }: { film: KisfilmAdat }) {
  const [fut, setFut] = useState(false);

  return (
    <figure className="flex flex-col gap-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-blue-950 pm-sotet">
        {fut ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={lejatszoUrl(film.youtubeId)}
            title={film.cim}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            type="button"
            onClick={() => setFut(true)}
            className="group absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-blue-300"
            aria-label={`Lejátszás: ${film.cim}`}
          >
            {film.poster && (
              <Image src={film.poster} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
            )}
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white text-blue-950 shadow-lg transition-transform group-hover:scale-105">
              <Play size={28} className="translate-x-0.5" aria-hidden="true" />
            </span>
            <span className="relative rounded-full bg-blue-950/70 px-3 py-1 text-sm text-blue-100">Lejátszás a YouTube-ról</span>
          </button>
        )}
      </div>
      <figcaption className="display text-xl leading-snug text-slate-900">{film.cim}</figcaption>
    </figure>
  );
}

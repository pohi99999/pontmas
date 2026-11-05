// The foundation's mark as vectors: the sphere, its ink ring, the arc of the P and the white ribbon, in the
// proportions of the logo (viewBox 374x402). Drawn by hand from the logo until the vector original arrives.
export function PontGombAlap() {
  return (
    <div
      className="absolute rounded-full"
      style={{
        left: '24.6%',
        top: '30.1%',
        width: '72.7%',
        aspectRatio: '1',
        background: 'radial-gradient(circle at 36% 30%, #fbfcff 0, #ced4ea 30%, #7a94c7 65%, #5475b0 100%)',
      }}
    />
  );
}

export function PontGombVektor() {
  return (
    <svg viewBox="0 0 374 402" className="absolute inset-0 w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="pont-feny" cx="34%" cy="26%" r="72%">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".42" />
          <stop offset=".55" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#21355b" stopOpacity=".3" />
        </radialGradient>
      </defs>
      <circle cx="228" cy="257" r="136" fill="url(#pont-feny)" />
      <circle cx="228" cy="257" r="136" fill="none" stroke="#1b161a" strokeWidth="9" />
      <path fill="#1b161a" d="M4 386C16 250 58 122 128 56 190-2 302-10 342 28c32 30 14 92-22 126 22-42 36-88 10-114C286 6 196 16 146 64 84 126 30 262 9 386c-1 5-6 5-5 0Z" />
      <path fill="#fff" d="M108 182C165 204 268 192 322 150c5-4 10-1 7 4-49 52-159 72-219 46-8-4-8-20-2-18Z" />
    </svg>
  );
}

export default function PontJel({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: '374 / 402' }} aria-hidden="true">
      <PontGombAlap />
      <PontGombVektor />
    </div>
  );
}

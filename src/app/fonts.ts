import { Inter } from "next/font/google";
import localFont from "next/font/local";

// The site's two fonts, shared by the language layout and the editor's layout (card c017f163: the
// root layout split in two when the pages moved under [locale]).
export const inter = Inter({ subsets: ["latin", "latin-ext"] });
// The heading font: one static weight, subset to Hungarian in one small file (fonts/README.txt). The variable
// Google file cost about 1.5 s of mobile LCP (measured). display: optional: a slow first visit stays on the
// fallback, and the big titles never jump.
// The generated fallback face is metric-matched to a SERIF (review 2026-11-10): with next/font's default
// (Arial) a slow first visit showed the titles in a sans face, so the page lost its character exactly then.
export const fraunces = localFont({
  src: "./fonts/fraunces-500-hu.woff2",
  weight: "500",
  display: "optional",
  variable: "--font-display",
  fallback: ["Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

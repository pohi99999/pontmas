import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccessibilityToolbar from "@/components/ui/AccessibilityToolbar";
import ReadingRuler from "@/components/ui/ReadingRuler";
import { SensoryProvider } from "@/context/SensoryContext";
import { jsonLdScript } from "@/lib/jsonLd";

const inter = Inter({ subsets: ["latin", "latin-ext"] });
// The heading font: one static weight, subset to Hungarian in one small file (fonts/README.txt). The variable
// Google file cost about 1.5 s of mobile LCP (measured). display: optional: a slow first visit stays on the
// fallback, and the big titles never jump.
// The generated fallback face is metric-matched to a SERIF (review 2026-11-10): with next/font's default
// (Arial) a slow first visit showed the titles in a sans face, so the page lost its character exactly then.
const fraunces = localFont({
  src: "./fonts/fraunces-500-hu.woff2",
  weight: "500",
  display: "optional",
  variable: "--font-display",
  fallback: ["Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

export const metadata: Metadata = {
  title: "PontMás Alapítvány | Vas Megyei Autista Gyermekekért",
  description: "A PontMás Alapítvány célja a Vas vármegyében élő autista gyermekek és családjaik támogatása. Csatlakozzon közösségünkhöz, támogassa munkánkat!",
  openGraph: {
    title: "PontMás Alapítvány | Vas Megyei Autista Gyermekekért",
    description: "A PontMás Alapítvány célja a Vas vármegyében élő autista gyermekek és családjaik támogatása.",
    url: "https://pontmas.hu",
    siteName: "PontMás Alapítvány",
    locale: "hu_HU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": "PontMás Vas Megyei Autista Gyermekekért Alapítvány",
    "url": "https://pontmas.hu",
    "telephone": "+36 20 969 8715",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Váci M. utca 12. 3./15.",
      "addressLocality": "Szombathely",
      "postalCode": "9700",
      "addressCountry": "HU"
    }
  };

  return (
    <html lang="hu" className={`scroll-smooth ${fraunces.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased`}>
        <SensoryProvider>
          {/* First stop for keyboard users: past the header straight to the page content */}
          <a
            href="#tartalom"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-xl focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-blue-700 focus:shadow-lg"
          >
            Ugrás a tartalomra
          </a>
          <ReadingRuler />
          <Header />
          <main id="tartalom" tabIndex={-1} className="flex-1 focus:outline-none">{children}</main>
          <AccessibilityToolbar />
          <Footer />
        </SensoryProvider>
      </body>
    </html>
  );
}

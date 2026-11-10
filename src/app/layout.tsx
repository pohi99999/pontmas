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
import { foundationJsonLd } from "@/lib/foundation";
import ChatWidget from "@/components/chat/ChatWidget";
import { chatConfig } from "@/lib/chat/config";

const inter = Inter({ subsets: ["latin", "latin-ext"] });
// The heading font: one static weight, subset to Hungarian in one small file (fonts/README.txt). The variable
// Google file cost about 1.5 s of mobile LCP (measured). display: optional: a slow first visit stays on the
// fallback, and the big titles never jump.
const fraunces = localFont({
  src: "./fonts/fraunces-500-hu.woff2",
  weight: "500",
  display: "optional",
  variable: "--font-display",
  fallback: ["Georgia", "serif"],
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
  const jsonLd = foundationJsonLd();

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
          {/* off unless every condition in src/lib/chat/config.ts holds (switch, approvals, key, hard cap) */}
          {chatConfig(process.env).enabled && <ChatWidget locale="hu" />}
          <Footer />
        </SensoryProvider>
      </body>
    </html>
  );
}

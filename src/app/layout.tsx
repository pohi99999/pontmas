import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SensoryProvider } from "@/context/SensoryContext";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

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
    "email": "info@pontmas.hu",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Váci M. utca 12. 3./15.",
      "addressLocality": "Szombathely",
      "postalCode": "9700",
      "addressCountry": "HU"
    }
  };

  return (
    <html lang="hu" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased`}>
        <SensoryProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SensoryProvider>
      </body>
    </html>
  );
}

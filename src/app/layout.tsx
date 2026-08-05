import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "PontMás Alapítvány",
  description: "Vas Megyei Autista Gyermekekért Alapítvány - Támogatás, elfogadás, közösség.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" className="scroll-smooth">
      <body className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

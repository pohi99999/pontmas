import type { Metadata } from "next";
import Link from "next/link";
import "@/app/globals.css";
import { fraunces, inter } from "@/app/fonts";
import hu from "../../messages/hu.json";

// The 404 of an address that matches no layout (card c017f163: with two root layouts, [locale] and the
// editor, Next needs this file for the rest; next.config.ts experimental.globalNotFound). In Hungarian:
// an unknown address carries no language. A known but unpublished language answers its own 404.
export const metadata: Metadata = { title: `${hu.NotFound.title} | ${hu.Meta.siteName}`, robots: { index: false } };

export default function GlobalNotFound() {
  return (
    <html lang="hu" className={fraunces.variable}>
      <body className={`${inter.className} flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-900`}>
        <main className="max-w-xl text-center">
          <h1 className="text-4xl md:text-5xl mb-4">{hu.NotFound.title}</h1>
          <p className="text-lg text-slate-600 mb-8">{hu.NotFound.text}</p>
          <Link href="/" className="inline-flex rounded-full bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800">{hu.NotFound.home}</Link>
        </main>
      </body>
    </html>
  );
}

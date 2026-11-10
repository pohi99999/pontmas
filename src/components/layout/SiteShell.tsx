import "@/app/globals.css";
import { fraunces, inter } from "@/app/fonts";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccessibilityToolbar from "@/components/ui/AccessibilityToolbar";
import ReadingRuler from "@/components/ui/ReadingRuler";
import { SensoryProvider } from "@/context/SensoryContext";
import { jsonLdScript } from "@/lib/jsonLd";
import { foundationJsonLd } from "@/lib/foundation";
import ChatWidget from "@/components/chat/ChatWidget";
import { chatConfig } from "@/lib/chat/config";
import type { ChatLocale } from "@/lib/chat/rules";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";

// The page frame every public page and the editor share: <html>, the fonts, the JSON-LD, the skip
// link, header, footer, the accessibility tools and (when switched on) the chat. Two root layouts use
// it: src/app/[locale]/layout.tsx with the page's language, src/app/szerkeszto/layout.tsx in Hungarian.
export default function SiteShell({
  lang,
  messages,
  children,
}: Readonly<{
  lang: ChatLocale;
  /** the language's messages: header, footer and every client component read them */
  messages: AbstractIntlMessages;
  children: React.ReactNode;
}>) {
  const jsonLd = foundationJsonLd();

  return (
    <html lang={lang} className={`scroll-smooth ${fraunces.variable}`}>
      <body className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased`}>
        {/* JSON-LD in the body (valid there, read the same way); this frame is not an app/ layout file,
            so a <head> element here would only be a lint warning without a reason */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
        />
        <NextIntlClientProvider locale={lang} messages={messages}>
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
          {chatConfig(process.env).enabled && <ChatWidget locale={lang} />}
          <Footer />
        </SensoryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

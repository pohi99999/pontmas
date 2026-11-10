import type { Viewport } from "next";
import { getMessages } from "next-intl/server";
import SiteShell from "@/components/layout/SiteShell";

// The content editor's root layout: the same frame as the public pages, in Hungarian only. The editor
// lives outside the language segment (src/proxy.ts leaves /szerkeszto alone) and is never indexed.
// The site has its own dark theme (#33): this is the <meta name="color-scheme" content="light dark"> that
// stops browsers from darkening the page on their own.
export const viewport: Viewport = { colorScheme: "light dark" };

export default async function EditorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const messages = await getMessages({ locale: "hu" });
  return (
    <SiteShell lang="hu" messages={messages}>
      {children}
    </SiteShell>
  );
}

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import SiteShell from "@/components/layout/SiteShell";
import { OG_LOCALE, PUBLISHED_LOCALES, isPublished } from "@/i18n/routing";

type Props = Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>;

// The root layout of every public page, in the page's language (card c017f163). A language that is
// not published yet (src/i18n/routing.ts PUBLISHED_LOCALES) answers 404 instead of a half-done page.
// The site has its own dark theme (#33): this is the <meta name="color-scheme" content="light dark"> that
// stops browsers from darkening the page on their own.
export const viewport: Viewport = { colorScheme: "light dark" };

export function generateStaticParams() {
  return PUBLISHED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  if (!isPublished(locale)) return {};
  const t = await getTranslations({ locale, namespace: "Meta" });
  // no canonical here: every page sets its own (src/i18n/page.ts alternatesFor)
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("ogDescription"),
      url: "https://pontmas.hu",
      siteName: t("siteName"),
      locale: OG_LOCALE[locale],
      type: "website",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isPublished(locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <SiteShell lang={locale} messages={messages}>
      {children}
    </SiteShell>
  );
}

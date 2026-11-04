import type { Metadata } from "next";
import { cookies } from "next/headers";
import EditorApp from "@/components/editor/EditorApp";
import LoginForm from "@/components/editor/LoginForm";
import { SESSION_COOKIE, parseAllowList, secretUsable, verifySessionValue } from "@/lib/editorAuth";

async function loggedInEditor(secret: string | undefined): Promise<string | null> {
  if (!secretUsable(secret)) return null;
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionValue(value, secret, Date.now(), parseAllowList(process.env.EDITOR_EMAILS));
}

// The content editor. Not in any menu, not in a sitemap, never indexed (this metadata, and the
// X-Robots-Tag header from next.config.ts).
export const metadata: Metadata = {
  title: "Szerkesztő | PontMás Alapítvány",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SzerkesztoPage() {
  const secret = process.env.EDITOR_SESSION_SECRET;
  const enabled = secretUsable(secret);
  const editor = await loggedInEditor(secret);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">Tartalomszerkesztő</h1>
      {!enabled ? (
        <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-base text-amber-900">
          A szerkesztő még nincs bekapcsolva ezen a honlapon. Kérjük, forduljon a honlap gazdájához.
        </p>
      ) : editor ? (
        <EditorApp editor={editor} />
      ) : (
        <LoginForm />
      )}
    </div>
  );
}

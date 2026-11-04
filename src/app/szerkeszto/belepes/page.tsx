import type { Metadata } from "next";
import RedeemButton from "@/components/editor/RedeemButton";

// The page the login link opens. It only shows a button: mail scanners open links, but do not
// press buttons, so they cannot use the link up. The token is in the #fragment, so it never
// reaches the server's logs; the button posts it to /api/szerkeszto/belepes.
export const metadata: Metadata = {
  title: "Belépés | PontMás szerkesztő",
  robots: { index: false, follow: false },
};

export default function BelepesPage() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <h1 className="text-2xl font-black text-slate-900">Belépés a szerkesztőbe</h1>
      <RedeemButton />
    </div>
  );
}

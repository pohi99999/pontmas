import SiteShell from "@/components/layout/SiteShell";
import hu from "../../../messages/hu.json";

// The content editor's root layout: the same frame as the public pages, in Hungarian only. The editor
// lives outside the language segment (src/proxy.ts leaves /szerkeszto alone) and is never indexed.
export default function EditorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SiteShell lang="hu" messages={hu}>
      {children}
    </SiteShell>
  );
}

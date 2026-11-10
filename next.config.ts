import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { EDITOR_HEADERS, SECURITY_HEADERS } from "./src/lib/securityHeaders";

// The language routing (card c017f163): src/i18n/request.ts gives each request its messages.
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // The 404 for addresses outside both root layouts ([locale] and the editor): src/app/global-not-found.tsx
  experimental: { globalNotFound: true },
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      { source: "/szerkeszto/:path*", headers: EDITOR_HEADERS },
      { source: "/api/szerkeszto/:path*", headers: EDITOR_HEADERS },
    ];
  },
};

export default withNextIntl(nextConfig);

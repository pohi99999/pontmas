import type { NextConfig } from "next";
import { EDITOR_HEADERS, SECURITY_HEADERS } from "./src/lib/securityHeaders";

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      { source: "/szerkeszto/:path*", headers: EDITOR_HEADERS },
      { source: "/api/szerkeszto/:path*", headers: EDITOR_HEADERS },
    ];
  },
};

export default nextConfig;

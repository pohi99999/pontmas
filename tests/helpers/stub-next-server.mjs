// The real next/server, unwrapped from its CommonJS module (node's ESM loader does not resolve the
// extensionless "next/server" specifier).
import mod from 'next/server.js';
export const NextResponse = mod.NextResponse;
export const NextRequest = mod.NextRequest;

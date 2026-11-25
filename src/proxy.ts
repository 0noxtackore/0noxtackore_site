import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

export function proxy(request: NextRequest) {
  const host = request.nextUrl.hostname;
  if (!LOCAL_HOSTS.has(host)) {
    // Rewrite to a non-existent path so the app serves its normal not-found page
    // without revealing that /admin exists on this deployment.
    const url = request.nextUrl.clone();
    url.pathname = "/__not_found__";
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

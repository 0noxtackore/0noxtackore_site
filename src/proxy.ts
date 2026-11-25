import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

export function proxy(request: NextRequest) {
  const host = request.nextUrl.hostname;
  if (!LOCAL_HOSTS.has(host)) {
    return new NextResponse("Not Found", { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

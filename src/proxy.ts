import { NextResponse, type NextRequest } from "next/server";
import { authConfig } from "@/lib/config";
import { safeRedirectPath } from "@/lib/utils";

/**
 * Optimistic auth check: unauthenticated visitors are sent to /login before protected
 * pages render. Guest-only pages (login) bounce signed-in users back to the shop.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = request.cookies.has(authConfig.sessionCookie);

  if (pathname.startsWith("/cart") && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && hasSession) {
    return NextResponse.redirect(new URL(safeRedirectPath(request.nextUrl.searchParams.get("next")), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart/:path*", "/login"],
};

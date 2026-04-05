import { type NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth-edge";

/**
 * RankMyBiz Route Protection Middleware
 *
 * /dashboard/*  — requires authenticated user (any role)
 * /admin/*      — requires authenticated admin user
 *
 * Uses signed httpOnly cookie for session validation.
 * Will be replaced by Supabase Auth in Phase 3.
 */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = await getSessionFromRequest(request);

  // ── Protect /admin — requires admin role ──────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/auth/login";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (user.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  // ── Protect /dashboard — requires any authenticated user ──────────────────
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/auth/login";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};

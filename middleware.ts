import { type NextRequest, NextResponse } from "next/server";

/**
 * RankMyBiz Route Protection Middleware
 *
 * Protected route groups:
 *   /dashboard/*  — requires authenticated user (any role)
 *   /admin/*      — requires authenticated user with role = 'admin'
 *
 * All other routes are public (homepage, pricing, auth pages, public listings).
 *
 * IMPORTANT: This middleware requires @supabase/ssr to be installed.
 * Until Supabase is configured, this file is a no-op that preserves structure.
 *
 * To activate:
 *   1. npm install @supabase/ssr @supabase/supabase-js
 *   2. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 *   3. Uncomment the Supabase block below and remove the placeholder response
 */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Supabase session-aware middleware ──────────────────────────────────────
  //
  // Uncomment this entire block once @supabase/ssr is installed and env vars are set.
  //
  // import { createServerClient } from "@supabase/ssr";
  //
  // let response = NextResponse.next({ request });
  //
  // const supabase = createServerClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  //   {
  //     cookies: {
  //       getAll() {
  //         return request.cookies.getAll();
  //       },
  //       setAll(cookiesToSet) {
  //         // Must set on both request and response to keep session alive
  //         cookiesToSet.forEach(({ name, value }) =>
  //           request.cookies.set(name, value)
  //         );
  //         response = NextResponse.next({ request });
  //         cookiesToSet.forEach(({ name, value, options }) =>
  //           response.cookies.set(name, value, options)
  //         );
  //       },
  //     },
  //   }
  // );
  //
  // // IMPORTANT: Always call getUser() — never getSession() — in middleware.
  // // getUser() validates the token with the Supabase auth server on every request.
  // // getSession() only reads the cookie and can be spoofed.
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  //
  // // Protect /dashboard — any authenticated user
  // if (pathname.startsWith("/dashboard") && !user) {
  //   const loginUrl = request.nextUrl.clone();
  //   loginUrl.pathname = "/auth/login";
  //   loginUrl.searchParams.set("redirect", pathname);
  //   return NextResponse.redirect(loginUrl);
  // }
  //
  // // Protect /admin — requires admin role
  // if (pathname.startsWith("/admin")) {
  //   if (!user) {
  //     const loginUrl = request.nextUrl.clone();
  //     loginUrl.pathname = "/auth/login";
  //     loginUrl.searchParams.set("redirect", pathname);
  //     return NextResponse.redirect(loginUrl);
  //   }
  //
  //   // Check admin role — this DB call runs at the Edge on every /admin request.
  //   // If this becomes a bottleneck, store role in a JWT custom claim instead.
  //   const { data: userData } = await supabase
  //     .from("users")
  //     .select("role")
  //     .eq("id", user.id)
  //     .single();
  //
  //   if (userData?.role !== "admin") {
  //     // Authenticated but not admin — send to their SME dashboard
  //     return NextResponse.redirect(new URL("/dashboard", request.url));
  //   }
  // }
  //
  // return response;
  // ── End Supabase block ─────────────────────────────────────────────────────

  // ── Placeholder guard (active until Supabase is configured) ───────────────
  // Provides basic route structure without breaking the build.
  // Remove this block when the Supabase block above is uncommented.

  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");

  if (isDashboard || isAdmin) {
    // In dev without Supabase: allow through so routes are accessible for testing.
    // In production: MUST uncomment the Supabase block above before going live.
    return NextResponse.next();
  }

  return NextResponse.next();
}

/**
 * Route matcher — middleware only runs on these paths.
 * Excludes static files, images, and Next.js internals automatically.
 *
 * Covers:
 *   /dashboard and all sub-routes
 *   /admin and all sub-routes
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};

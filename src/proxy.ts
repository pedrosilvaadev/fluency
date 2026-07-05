import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createRequestSupabaseClient } from "@/lib/supabase/request";

const protectedPrefixes = [
  "/dashboard",
  "/feed",
  "/library",
  "/progress",
  "/review",
  "/profile",
];
const guestOnlyPrefixes = ["/auth/login", "/auth/sign-up"];

export async function proxy(request: NextRequest) {
  const { supabase, getResponse } = createRequestSupabaseClient(request);
  const { data } = await supabase.auth.getClaims();
  const sessionResponse = getResponse();
  const isAuthenticated = Boolean(data?.claims?.sub);
  const path = request.nextUrl.pathname;
  const isProtected = protectedPrefixes.some((prefix) =>
    path.startsWith(prefix),
  );
  const isGuestOnly = guestOnlyPrefixes.some((prefix) =>
    path.startsWith(prefix),
  );

  if (isProtected && !isAuthenticated) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("next", `${path}${request.nextUrl.search}`);
    return redirectWithSession(url, sessionResponse);
  }
  if (isGuestOnly && isAuthenticated) {
    return redirectWithSession(new URL("/", request.url), sessionResponse);
  }

  return sessionResponse;
}

function redirectWithSession(url: URL, sessionResponse: NextResponse) {
  const response = NextResponse.redirect(url);
  for (const cookie of sessionResponse.cookies.getAll())
    response.cookies.set(cookie);
  for (const name of ["cache-control", "expires", "pragma"]) {
    const value = sessionResponse.headers.get(name);
    if (value) response.headers.set(name, value);
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

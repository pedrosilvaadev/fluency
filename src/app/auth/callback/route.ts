import { type NextRequest, NextResponse } from "next/server";

import { syncAuthenticatedUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/validation/auth";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = safeNextPath(
    request.nextUrl.searchParams.get("next"),
    request.nextUrl.origin,
  );
  if (!code)
    return NextResponse.redirect(
      new URL("/auth/login?error=callback", request.url),
    );

  const responseHeaders = new Headers();
  const supabase = await createServerSupabaseClient({ responseHeaders });
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(
      new URL("/auth/login?error=callback", request.url),
    );
  }

  await syncAuthenticatedUser(data.user);
  return NextResponse.redirect(new URL(next, request.url), {
    headers: responseHeaders,
  });
}

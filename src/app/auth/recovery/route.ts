import { type NextRequest, NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/login?error=recovery", request.url),
    );
  }

  const responseHeaders = new Headers();
  const supabase = await createServerSupabaseClient({ responseHeaders });
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL("/auth/login?error=recovery", request.url),
    );
  }

  return NextResponse.redirect(new URL("/auth/update-password", request.url), {
    headers: responseHeaders,
  });
}

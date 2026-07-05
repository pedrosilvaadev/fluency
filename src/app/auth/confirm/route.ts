import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { syncAuthenticatedUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const allowedTypes = new Set<EmailOtpType>([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
]);

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const rawType = request.nextUrl.searchParams.get(
    "type",
  ) as EmailOtpType | null;
  if (!tokenHash || !rawType || !allowedTypes.has(rawType)) {
    return NextResponse.redirect(
      new URL("/auth/login?error=confirmation", request.url),
    );
  }

  const responseHeaders = new Headers();
  const supabase = await createServerSupabaseClient({ responseHeaders });
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: rawType,
  });
  if (error || !data.user) {
    return NextResponse.redirect(
      new URL("/auth/login?error=confirmation", request.url),
    );
  }

  await syncAuthenticatedUser(data.user);
  const destination = rawType === "recovery" ? "/auth/update-password" : "/";
  return NextResponse.redirect(new URL(destination, request.url), {
    headers: responseHeaders,
  });
}

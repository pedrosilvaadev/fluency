import { type NextRequest, NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const responseHeaders = new Headers();
  const supabase = await createServerSupabaseClient({ responseHeaders });
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/auth/login", request.url), {
    status: 303,
    headers: responseHeaders,
  });
}

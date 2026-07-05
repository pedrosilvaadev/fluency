"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getPublicEnvironment } from "@/lib/env/public";

let client: ReturnType<typeof createBrowserClient> | undefined;

export function createBrowserSupabaseClient() {
  if (client) return client;

  const environment = getPublicEnvironment();
  client = createBrowserClient(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  return client;
}

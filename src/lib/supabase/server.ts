import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getPublicEnvironment } from "@/lib/env/public";

type ServerClientOptions = {
  responseHeaders?: Headers;
};

export async function createServerSupabaseClient(
  options: ServerClientOptions = {},
) {
  const cookieStore = await cookies();
  const environment = getPublicEnvironment();

  return createServerClient(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet, responseHeaders) => {
          for (const { name, value, options: cookieOptions } of cookiesToSet) {
            try {
              cookieStore.set(name, value, cookieOptions);
            } catch {
              // Server Components cannot write cookies. src/proxy.ts refreshes
              // sessions before rendering; Actions and Route Handlers can write.
            }
          }

          for (const [name, value] of Object.entries(responseHeaders)) {
            options.responseHeaders?.set(name, value);
          }
        },
      },
    },
  );
}

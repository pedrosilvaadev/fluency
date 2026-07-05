import "server-only";

import type { User as SupabaseUser } from "@supabase/supabase-js";
import { cache } from "react";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function userName(user: SupabaseUser) {
  const metadataName = user.user_metadata.full_name ?? user.user_metadata.name;
  if (typeof metadataName === "string" && metadataName.trim()) {
    return metadataName.trim().slice(0, 120);
  }
  return user.email?.split("@")[0]?.slice(0, 120) || "Estudante";
}

function avatarUrl(user: SupabaseUser) {
  const value = user.user_metadata.avatar_url ?? user.user_metadata.picture;
  return typeof value === "string" && value ? value : null;
}

export async function syncAuthenticatedUser(user: SupabaseUser) {
  if (!user.email) throw new Error("A conta autenticada não possui e-mail.");

  return prisma.user.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      email: user.email.toLowerCase(),
      name: userName(user),
      avatarUrl: avatarUrl(user),
    },
    update: {
      email: user.email.toLowerCase(),
      avatarUrl: avatarUrl(user),
    },
  });
}

export const getAuthenticatedUser = cache(async () => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
});

export async function requireAuth() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/auth/login");
  return user;
}

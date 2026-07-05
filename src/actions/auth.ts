"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { syncAuthenticatedUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  emailSchema,
  safeNextPath,
  signInSchema,
  signUpSchema,
  updatePasswordSchema,
} from "@/lib/validation/auth";
import type { ActionResult } from "@/types/action-result";

type AuthField = "name" | "email" | "password" | "confirmPassword";

function validationFailure(error: {
  flatten: () => { fieldErrors: Record<string, string[]> };
}): ActionResult<undefined, AuthField> {
  return {
    success: false,
    message: "Revise os campos destacados.",
    fieldErrors: error.flatten().fieldErrors,
  };
}

async function applicationOrigin() {
  const configuredOrigins = [
    ["APP_URL", process.env.APP_URL, false],
    [
      "VERCEL_PROJECT_PRODUCTION_URL",
      process.env.VERCEL_PROJECT_PRODUCTION_URL,
      true,
    ],
    ["VERCEL_URL", process.env.VERCEL_URL, true],
  ] as const;

  for (const [name, configuredValue, addHttps] of configuredOrigins) {
    if (!configuredValue) continue;
    const value =
      addHttps && !configuredValue.includes("://")
        ? `https://${configuredValue}`
        : configuredValue;
    try {
      const url = new URL(value);
      if (
        !["http:", "https:"].includes(url.protocol) ||
        url.username ||
        url.password
      ) {
        throw new Error();
      }
      return url.origin;
    } catch {
      throw new Error(`${name} precisa conter uma URL HTTP(S) valida.`);
    }
  }

  if (process.env.NODE_ENV !== "development") {
    throw new Error("Configure APP_URL com a origem publica da aplicacao.");
  }

  const requestHeaders = await headers();
  const host = (
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host")
  )
    ?.split(",")[0]
    ?.trim();
  const protocol = (requestHeaders.get("x-forwarded-proto") ?? "http")
    .split(",")[0]
    .trim();
  if (!host)
    throw new Error("Não foi possível determinar a origem da aplicação.");
  const url = new URL(`${protocol}://${host}`);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new Error("A origem da requisicao e invalida.");
  }
  return url.origin;
}

export async function signUpAction(
  _previous: ActionResult<undefined, AuthField>,
  formData: FormData,
): Promise<ActionResult<undefined, AuthField>> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationFailure(parsed.error);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { name: parsed.data.name, full_name: parsed.data.name },
      emailRedirectTo: `${await applicationOrigin()}/auth/callback`,
    },
  });

  if (error) return { success: false, message: error.message };
  if (data.user && data.session) await syncAuthenticatedUser(data.user);

  return {
    success: true,
    message: data.session
      ? "Conta criada com sucesso."
      : "Confira seu e-mail para confirmar a conta.",
  };
}

export async function signInAction(
  _previous: ActionResult<undefined, AuthField>,
  formData: FormData,
): Promise<ActionResult<undefined, AuthField>> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationFailure(parsed.error);
  const next = safeNextPath(formData.get("next")?.toString());

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { success: false, message: "E-mail ou senha inválidos." };

  await syncAuthenticatedUser(data.user);
  redirect(next);
}

export async function signInWithGoogleAction(formData: FormData) {
  const next = safeNextPath(formData.get("next")?.toString());
  const callbackUrl = new URL("/auth/callback", await applicationOrigin());
  callbackUrl.searchParams.set("next", next);
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callbackUrl.toString() },
  });
  if (error) redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
  redirect(data.url);
}

export async function requestPasswordResetAction(
  _previous: ActionResult<undefined, AuthField>,
  formData: FormData,
): Promise<ActionResult<undefined, AuthField>> {
  const parsed = emailSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationFailure(parsed.error);

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${await applicationOrigin()}/auth/recovery`,
    },
  );
  if (error) return { success: false, message: error.message };

  return {
    success: true,
    message: "Se o e-mail estiver cadastrado, você receberá as instruções.",
  };
}

export async function updatePasswordAction(
  _previous: ActionResult<undefined, AuthField>,
  formData: FormData,
): Promise<ActionResult<undefined, AuthField>> {
  const parsed = updatePasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationFailure(parsed.error);

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Senha atualizada com sucesso." };
}

export async function signOutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}

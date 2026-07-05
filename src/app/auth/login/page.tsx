import Link from "next/link";

import { signInWithGoogleAction } from "@/actions/auth";
import { FormSubmitButton } from "@/components/fluenty/form-submit-button";
import { safeNextPath } from "@/lib/validation/auth";
import { AuthForm } from "../_components/auth-form";
import { AuthShell } from "../_components/auth-shell";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const rawNext = (await searchParams).next;
  const next = safeNextPath(Array.isArray(rawNext) ? rawNext[0] : rawNext);

  return (
    <AuthShell
      title="Entre na sua conta"
      footer={
        <>
          Ainda não tem conta? <Link href="/auth/sign-up">Cadastre-se</Link>.
        </>
      }
    >
      <AuthForm mode="login" next={next} />
      <form action={signInWithGoogleAction}>
        <input type="hidden" name="next" value={next} />
        <FormSubmitButton
          className="min-h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 font-medium text-zinc-100 hover:bg-white/[0.08]"
          pendingLabel="Conectando ao Google…"
        >
          Continuar com Google
        </FormSubmitButton>
      </form>
      <Link
        className="text-center text-sm text-zinc-400 underline hover:text-white"
        href="/auth/forgot-password"
      >
        Esqueci minha senha
      </Link>
    </AuthShell>
  );
}

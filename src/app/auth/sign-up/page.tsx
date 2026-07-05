import Link from "next/link";

import { signInWithGoogleAction } from "@/actions/auth";
import { FormSubmitButton } from "@/components/fluenty/form-submit-button";
import { AuthForm } from "../_components/auth-form";
import { AuthShell } from "../_components/auth-shell";

export default function SignUpPage() {
  return (
    <AuthShell
      title="Crie sua conta"
      footer={
        <>
          Já tem conta? <Link href="/auth/login">Entre</Link>.
        </>
      }
    >
      <AuthForm mode="sign-up" />
      <form action={signInWithGoogleAction}>
        <FormSubmitButton
          className="min-h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 font-medium text-zinc-100 hover:bg-white/[0.08]"
          pendingLabel="Conectando ao Google…"
        >
          Cadastrar com Google
        </FormSubmitButton>
      </form>
    </AuthShell>
  );
}

import Link from "next/link";

import { AuthForm } from "../_components/auth-form";
import { AuthShell } from "../_components/auth-shell";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Recupere sua senha"
      footer={<Link href="/auth/login">Voltar ao login</Link>}
    >
      <AuthForm mode="forgot-password" />
    </AuthShell>
  );
}

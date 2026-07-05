import { AuthForm } from "../_components/auth-form";
import { AuthShell } from "../_components/auth-shell";

export default function UpdatePasswordPage() {
  return (
    <AuthShell title="Defina uma nova senha">
      <AuthForm mode="update-password" />
    </AuthShell>
  );
}

import { AppShell } from "@/components/fluenty/app-shell";
import { getCurrentUser } from "@/lib/dal/users";

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();

  return <AppShell user={user}>{children}</AppShell>;
}

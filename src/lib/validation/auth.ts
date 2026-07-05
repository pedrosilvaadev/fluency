import { z } from "zod";

const authenticatedPathPrefixes = [
  "/dashboard",
  "/feed",
  "/library",
  "/progress",
  "/review",
  "/profile",
] as const;

export function safeNextPath(
  value: string | null | undefined,
  expectedOrigin?: string,
) {
  if (!value || value.includes("\\") || /[\u0000-\u001f\u007f]/.test(value)) {
    return "/feed";
  }

  try {
    const base = expectedOrigin ?? "https://fluenty.invalid";
    const destination = new URL(value, base);
    const isRelativePath = value.startsWith("/") && !value.startsWith("//");
    const isSameOrigin = expectedOrigin
      ? destination.origin === new URL(expectedOrigin).origin
      : false;
    const hasAllowedOrigin = isRelativePath || isSameOrigin;
    const decodedPath = decodeURIComponent(destination.pathname);
    const hasAllowedPath = authenticatedPathPrefixes.some(
      (prefix) =>
        destination.pathname === prefix ||
        destination.pathname.startsWith(`${prefix}/`),
    );

    if (!hasAllowedOrigin || decodedPath.includes("\\") || !hasAllowedPath) {
      return "/feed";
    }
    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return "/feed";
  }
}

const email = z.email("Informe um e-mail válido.").trim().toLowerCase();
const password = z
  .string()
  .min(8, "Use pelo menos 8 caracteres.")
  .max(72, "Use no máximo 72 caracteres.");

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(120),
  email,
  password,
});

export const signInSchema = z.object({ email, password: z.string().min(1) });
export const emailSchema = z.object({ email });
export const updatePasswordSchema = z
  .object({
    password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas precisam ser iguais.",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;

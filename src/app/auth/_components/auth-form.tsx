"use client";

import { useActionState } from "react";

import {
  requestPasswordResetAction,
  signInAction,
  signUpAction,
  updatePasswordAction,
} from "@/actions/auth";
import type { ActionResult } from "@/types/action-result";

type Mode = "login" | "sign-up" | "forgot-password" | "update-password";
const initialState: ActionResult = { success: false, message: "" };

const actions = {
  login: signInAction,
  "sign-up": signUpAction,
  "forgot-password": requestPasswordResetAction,
  "update-password": updatePasswordAction,
};

export function AuthForm({ mode, next }: { mode: Mode; next?: string }) {
  const [state, action, pending] = useActionState(actions[mode], initialState);

  const errors = state.success ? undefined : state.fieldErrors;

  return (
    <form action={action} className="flex w-full flex-col gap-4">
      {mode === "login" && <input type="hidden" name="next" value={next} />}
      {mode === "sign-up" && (
        <Field
          label="Nome"
          name="name"
          autoComplete="name"
          errors={errors?.name}
        />
      )}
      {mode !== "update-password" && (
        <Field
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          errors={errors?.email}
        />
      )}
      {(mode === "login" ||
        mode === "sign-up" ||
        mode === "update-password") && (
        <Field
          label="Senha"
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          errors={errors?.password}
        />
      )}
      {mode === "update-password" && (
        <Field
          label="Confirme a senha"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          errors={errors?.confirmPassword}
        />
      )}
      {state.message && (
        <p
          aria-live="polite"
          className={state.success ? "text-emerald-300" : "text-rose-300"}
        >
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="min-h-12 rounded-2xl bg-violet-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 disabled:opacity-50"
      >
        {pending ? "Aguarde…" : buttonLabel(mode)}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  errors,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  errors?: string[];
}) {
  const errorId = `${name}-error`;

  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-300">
      {label}
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        aria-invalid={Boolean(errors?.length)}
        aria-describedby={errors?.length ? errorId : undefined}
        className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 font-normal text-white outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/20"
      />
      {errors?.length ? (
        <span
          id={errorId}
          role="alert"
          className="space-y-1 text-xs text-rose-300"
        >
          {errors.map((error) => (
            <span key={error} className="block">
              {error}
            </span>
          ))}
        </span>
      ) : null}
    </label>
  );
}

function buttonLabel(mode: Mode) {
  if (mode === "login") return "Entrar";
  if (mode === "sign-up") return "Criar conta";
  if (mode === "forgot-password") return "Enviar instruções";
  return "Atualizar senha";
}

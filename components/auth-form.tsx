"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, signup } from "@/app/auth/actions";
import { type AuthField, type AuthFormState } from "@/lib/auth-fields";
import { hasSupabaseEnv } from "@/lib/supabase/env";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <span className="field-error" id={id} role="alert">
      {message}
    </span>
  );
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const action = mode === "login" ? login : signup;
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(action, { error: "" });
  const draft = state.draft;
  const errors = state.fieldErrors ?? {};
  const configured = hasSupabaseEnv();
  const invalid = (field: AuthField) => (errors[field] ? true : undefined);

  return (
    <form action={formAction} noValidate key={draft ? `${draft.email}|${draft.password}|${draft.confirm}` : "clean"}>
      {!configured ? (
        <p className="notice" role="status">
          Add your Supabase URL and publishable key to .env.local, then restart the dev server.
        </p>
      ) : null}
      <label>
        Email
        <input
          type="text"
          name="email"
          autoComplete="email"
          inputMode="email"
          defaultValue={draft?.email ?? ""}
          aria-invalid={invalid("email")}
          aria-describedby={errors.email ? "auth-email-error" : undefined}
        />
        <FieldError id="auth-email-error" message={errors.email} />
      </label>
      <label>
        Password
        <input
          type="password"
          name="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          defaultValue={draft?.password ?? ""}
          aria-invalid={invalid("password")}
          aria-describedby={errors.password ? "auth-password-error" : undefined}
        />
        <FieldError id="auth-password-error" message={errors.password} />
      </label>
      {mode === "signup" ? (
        <label>
          Confirm password
          <input
            type="password"
            name="confirm"
            autoComplete="new-password"
            defaultValue={draft?.confirm ?? ""}
            aria-invalid={invalid("confirm")}
            aria-describedby={errors.confirm ? "auth-confirm-error" : undefined}
          />
          <FieldError id="auth-confirm-error" message={errors.confirm} />
        </label>
      ) : null}
      {state.error ? (
        <p className="error" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.notice ? (
        <p className="notice" role="status">
          {state.notice}
        </p>
      ) : null}
      <button type="submit" disabled={pending}>
        {pending ? "Working…" : mode === "login" ? "Log in" : "Create account"}
      </button>
      <p className="switch">
        {mode === "login" ? (
          <>
            New here? <Link href="/signup">Create an account</Link>
          </>
        ) : (
          <>
            Already have an account? <Link href="/login">Log in</Link>
          </>
        )}
      </p>
    </form>
  );
}

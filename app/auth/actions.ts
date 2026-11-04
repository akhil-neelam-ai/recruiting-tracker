"use server";

import { redirect } from "next/navigation";
import {
  authDraftFromForm,
  friendlyAuthError,
  validateAuth,
  type AuthFormState,
} from "@/lib/auth-fields";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

function invalid(draft: AuthFormState["draft"], fieldErrors: AuthFormState["fieldErrors"]): AuthFormState {
  return { error: "", fieldErrors, draft };
}

export async function login(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const draft = authDraftFromForm(formData);
  const fieldErrors = validateAuth(draft, "login");
  if (Object.keys(fieldErrors).length > 0) return invalid(draft, fieldErrors);
  if (!hasSupabaseEnv()) return { error: "Supabase is not connected yet.", draft };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: draft.email.trim(),
    password: draft.password,
  });
  if (error) return { error: friendlyAuthError(error.message), draft };
  redirect("/");
}

export async function signup(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const draft = authDraftFromForm(formData);
  const fieldErrors = validateAuth(draft, "signup");
  if (Object.keys(fieldErrors).length > 0) return invalid(draft, fieldErrors);
  if (!hasSupabaseEnv()) return { error: "Supabase is not connected yet.", draft };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: draft.email.trim(),
    password: draft.password,
  });
  if (error) return { error: friendlyAuthError(error.message), draft };
  if (!data.session) {
    return {
      error: "",
      notice:
        "Check your email to confirm the account, then log in. For the class demo, turn off Confirm email in Supabase so signup signs you in right away.",
      draft,
    };
  }
  redirect("/");
}

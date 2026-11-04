export type AuthMode = "login" | "signup";

export type AuthDraft = {
  email: string;
  password: string;
  confirm: string;
};

export type AuthField = "email" | "password" | "confirm";

export type AuthFormState = {
  error: string;
  notice?: string;
  fieldErrors?: Partial<Record<AuthField, string>>;
  draft?: AuthDraft;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function authDraftFromForm(formData: FormData): AuthDraft {
  return {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirm: String(formData.get("confirm") ?? ""),
  };
}

export function validateAuth(draft: AuthDraft, mode: AuthMode) {
  const fieldErrors: Partial<Record<AuthField, string>> = {};
  const email = draft.email.trim();

  if (!email) fieldErrors.email = "Enter your email.";
  else if (!EMAIL.test(email)) fieldErrors.email = "That email doesn't look right.";

  if (!draft.password) fieldErrors.password = "Enter a password.";
  else if (draft.password.length < 6) fieldErrors.password = "Use at least 6 characters.";

  if (mode === "signup") {
    if (!draft.confirm) fieldErrors.confirm = "Confirm your password.";
    else if (draft.password !== draft.confirm) fieldErrors.confirm = "Those passwords don't match.";
  }

  return fieldErrors;
}

export function friendlyAuthError(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials")) {
    return "That email and password don't match.";
  }
  if (lower.includes("already registered") || lower.includes("already been registered")) {
    return "An account with that email already exists. Log in instead.";
  }
  return message;
}

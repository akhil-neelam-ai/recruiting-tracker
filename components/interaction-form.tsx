"use client";

import { useActionState } from "react";
import { INTERACTION_TYPES } from "@/lib/people";

export function InteractionForm({
  action,
}: {
  action: (state: { error: string }, formData: FormData) => Promise<{ error: string }>;
}) {
  const [state, formAction, pending] = useActionState(action, { error: "" });

  return (
    <form action={formAction} className="company-form" noValidate>
      <label>
        Date
        <input name="date" type="date" />
      </label>
      <label>
        Type
        <select name="source" defaultValue="email">
          {INTERACTION_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <label>
        Notes
        <textarea name="summary" rows={3} placeholder="What you talked about" />
      </label>
      {state.error ? (
        <p className="error" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Log interaction"}
      </button>
    </form>
  );
}

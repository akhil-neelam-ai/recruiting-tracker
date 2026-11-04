"use client";

import { useActionState } from "react";

export function ReminderForm({
  action,
  people,
}: {
  action: (state: { error: string }, formData: FormData) => Promise<{ error: string }>;
  people: { id: number; name: string | null }[];
}) {
  const [state, formAction, pending] = useActionState(action, { error: "" });

  return (
    <form action={formAction} className="company-form" noValidate>
      <label>
        Person
        <select name="personId" defaultValue="">
          <option value="">Choose someone</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name || "Untitled person"}
            </option>
          ))}
        </select>
      </label>
      <label>
        Due date
        <input name="dueDate" type="date" />
      </label>
      <label>
        Note
        <input name="note" placeholder="Send the follow-up" />
      </label>
      {state.error ? (
        <p className="error" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={pending || people.length === 0}>
        {pending ? "Saving…" : "Add reminder"}
      </button>
    </form>
  );
}

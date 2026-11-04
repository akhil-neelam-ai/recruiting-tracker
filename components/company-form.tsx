"use client";

import { useActionState } from "react";
import { COMPANY_STATUSES, type CompanyInput, type FormState } from "@/lib/companies";

export function CompanyForm({
  action,
  initial,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initial?: Partial<CompanyInput>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, { error: "" });
  const draft = state.draft;

  return (
    <form action={formAction} className="company-form" key={draft ? JSON.stringify(draft) : "clean"}>
      <label>
        Name
        <input name="name" defaultValue={draft?.name ?? initial?.name ?? ""} required />
      </label>
      <label>
        Website
        <input
          name="website"
          defaultValue={draft?.website ?? initial?.website ?? ""}
          placeholder="https://"
        />
      </label>
      <label>
        Description
        <textarea
          name="description"
          defaultValue={draft?.description ?? initial?.description ?? ""}
          rows={4}
        />
      </label>
      <label>
        Source
        <input
          name="source"
          defaultValue={draft?.source ?? initial?.source ?? ""}
          placeholder="Coffee chat, career fair, referral"
        />
      </label>
      <label>
        Status
        <select name="status" defaultValue={draft?.status || initial?.status || "Researching"}>
          {COMPANY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
      {state.error ? (
        <p className="error" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { COMPANY_STATUSES, type CompanyField, type CompanyInput, type FormState } from "@/lib/companies";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <span className="field-error" id={id} role="alert">
      {message}
    </span>
  );
}

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
  const errors = state.fieldErrors ?? {};
  const invalid = (field: CompanyField) => (errors[field] ? true : undefined);

  return (
    <form
      action={formAction}
      className="company-form"
      noValidate
      key={draft ? JSON.stringify(draft) : "clean"}
    >
      <label>
        Name
        <input
          name="name"
          defaultValue={draft?.name ?? initial?.name ?? ""}
          aria-invalid={invalid("name")}
          aria-describedby={errors.name ? "company-name-error" : undefined}
        />
        <FieldError id="company-name-error" message={errors.name} />
      </label>
      <label>
        Website
        <input
          name="website"
          defaultValue={draft?.website ?? initial?.website ?? ""}
          placeholder="https://"
          aria-invalid={invalid("website")}
          aria-describedby={errors.website ? "company-website-error" : undefined}
        />
        <FieldError id="company-website-error" message={errors.website} />
      </label>
      <label>
        Description
        <textarea name="description" defaultValue={draft?.description ?? initial?.description ?? ""} rows={4} />
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
        <select
          name="status"
          defaultValue={draft?.status || initial?.status || "Researching"}
          aria-invalid={invalid("status")}
          aria-describedby={errors.status ? "company-status-error" : undefined}
        >
          {COMPANY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <FieldError id="company-status-error" message={errors.status} />
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

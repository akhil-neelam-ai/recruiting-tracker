"use client";

import { useActionState } from "react";

type CompanyOption = { id: number; name: string | null };

export function PersonForm({
  action,
  companies,
  initial,
  submitLabel,
}: {
  action: (state: { error: string }, formData: FormData) => Promise<{ error: string }>;
  companies: CompanyOption[];
  initial?: {
    name?: string | null;
    email?: string | null;
    title?: string | null;
    companyId?: number | null;
    howMet?: string | null;
    tags?: string | null;
  };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, { error: "" });

  return (
    <form action={formAction} className="company-form" noValidate>
      <label>
        Name
        <input name="name" defaultValue={initial?.name ?? ""} />
      </label>
      <label>
        Email
        <input name="email" defaultValue={initial?.email ?? ""} />
      </label>
      <label>
        Title
        <input name="title" defaultValue={initial?.title ?? ""} />
      </label>
      <label>
        Company
        <select name="companyId" defaultValue={initial?.companyId ? String(initial.companyId) : ""}>
          <option value="">No company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name || "Untitled company"}
            </option>
          ))}
        </select>
      </label>
      <label>
        How we met
        <input name="howMet" defaultValue={initial?.howMet ?? ""} />
      </label>
      <label>
        Tags
        <input name="tags" defaultValue={initial?.tags ?? ""} placeholder="product, mba-referral" />
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

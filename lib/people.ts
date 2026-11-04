export const INTERACTION_TYPES = ["email", "linkedin", "in-person", "zoom"] as const;

export type InteractionType = (typeof INTERACTION_TYPES)[number];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type PersonInput = {
  name: string;
  email: string | null;
  title: string | null;
  companyId: number | null;
  howMet: string | null;
  tags: string | null;
};

export type PersonField = "name" | "email" | "company";

export function parsePersonForm(
  formData: FormData,
): { ok: true; value: PersonInput } | { ok: false; fieldErrors: Partial<Record<PersonField, string>> } {
  const fieldErrors: Partial<Record<PersonField, string>> = {};
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const companyRaw = String(formData.get("companyId") ?? "").trim();

  if (!name) fieldErrors.name = "Enter a name.";
  if (email && !EMAIL.test(email)) fieldErrors.email = "That email doesn't look right.";

  let companyId: number | null = null;
  if (companyRaw) {
    const parsed = Number(companyRaw);
    if (!Number.isInteger(parsed) || parsed <= 0) fieldErrors.company = "Choose a company from the list.";
    else companyId = parsed;
  }

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };

  const optional = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value || null;
  };

  return {
    ok: true,
    value: {
      name,
      email: email || null,
      title: optional("title"),
      companyId,
      howMet: optional("howMet"),
      tags: optional("tags"),
    },
  };
}

export type InteractionInput = {
  date: string;
  source: InteractionType;
  summary: string;
};

export function parseInteractionForm(
  formData: FormData,
):
  | { ok: true; value: InteractionInput }
  | { ok: false; fieldErrors: Partial<Record<"date" | "source" | "summary", string>> } {
  const fieldErrors: Partial<Record<"date" | "source" | "summary", string>> = {};
  const date = String(formData.get("date") ?? "").trim();
  const source = String(formData.get("source") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();

  if (!date) fieldErrors.date = "Choose a date.";
  if (!INTERACTION_TYPES.includes(source as InteractionType)) {
    fieldErrors.source = "Choose email, linkedin, in-person, or zoom.";
  }
  if (!summary) fieldErrors.summary = "Add a note about what you talked about.";

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };
  return { ok: true, value: { date, source: source as InteractionType, summary } };
}

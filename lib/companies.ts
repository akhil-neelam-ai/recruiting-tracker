export const COMPANY_STATUSES = [
  "Researching",
  "Reaching out",
  "Applied",
  "Interviewing",
  "Offer",
  "Closed",
] as const;

export type CompanyStatus = (typeof COMPANY_STATUSES)[number];

export type CompanyInput = {
  name: string;
  website: string | null;
  description: string | null;
  source: string | null;
  status: CompanyStatus;
};

export type CompanyDraft = {
  name: string;
  website: string;
  description: string;
  source: string;
  status: string;
};

export type FormState = { error: string; draft?: CompanyDraft };

export function draftFromForm(formData: FormData): CompanyDraft {
  return {
    name: String(formData.get("name") ?? ""),
    website: String(formData.get("website") ?? ""),
    description: String(formData.get("description") ?? ""),
    source: String(formData.get("source") ?? ""),
    status: String(formData.get("status") ?? "Researching"),
  };
}

function optionalText(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

export function parseCompanyForm(
  formData: FormData,
): { ok: true; value: CompanyInput } | { ok: false; error: string } {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { ok: false, error: "Enter a company name." };

  const statusRaw = String(formData.get("status") ?? "Researching");
  const status = COMPANY_STATUSES.includes(statusRaw as CompanyStatus)
    ? (statusRaw as CompanyStatus)
    : "Researching";

  return {
    ok: true,
    value: {
      name,
      website: optionalText(formData, "website"),
      description: optionalText(formData, "description"),
      source: optionalText(formData, "source"),
      status,
    },
  };
}

export function companyId(raw: string) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

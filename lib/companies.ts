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

export type CompanyField = "name" | "website" | "status";

export type FormState = {
  error: string;
  fieldErrors?: Partial<Record<CompanyField, string>>;
  draft?: CompanyDraft;
};

export function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const WEBSITE_ERROR = "Enter a website, like meta.com.";

/** Trim the text and add https:// when the person left the scheme off. */
export function normalizeWebsite(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function websiteFieldError(value: string) {
  const website = normalizeWebsite(value);
  if (!website) return null;
  let hostname = "";
  try {
    hostname = new URL(website).hostname;
  } catch {
    hostname = "";
  }
  if (!isHttpUrl(website) || !hostname.includes(".")) return WEBSITE_ERROR;
  return null;
}

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
):
  | { ok: true; value: CompanyInput }
  | { ok: false; fieldErrors: Partial<Record<CompanyField, string>> } {
  const fieldErrors: Partial<Record<CompanyField, string>> = {};
  const name = String(formData.get("name") ?? "").trim();
  if (!name) fieldErrors.name = "Enter a company name.";

  const website = normalizeWebsite(String(formData.get("website") ?? ""));
  if (websiteFieldError(website)) fieldErrors.website = WEBSITE_ERROR;

  const statusRaw = String(formData.get("status") ?? "").trim();
  if (!statusRaw) fieldErrors.status = "Choose a status.";
  else if (!COMPANY_STATUSES.includes(statusRaw as CompanyStatus)) {
    fieldErrors.status = "Choose a status from the list.";
  }

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };

  return {
    ok: true,
    value: {
      name,
      website: website || null,
      description: optionalText(formData, "description"),
      source: optionalText(formData, "source"),
      status: statusRaw as CompanyStatus,
    },
  };
}

export function companyId(raw: string) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

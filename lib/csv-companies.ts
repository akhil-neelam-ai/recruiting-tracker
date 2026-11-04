import { COMPANY_STATUSES, type CompanyStatus, isHttpUrl } from "./companies";

export type CsvCompany = {
  name: string;
  website: string;
  description: string;
  source: string;
  status: string;
};

export type CsvReview = {
  row: number;
  company: CsvCompany;
  message: string | null;
};

function cell(record: Record<string, unknown>, key: string) {
  const entry = Object.entries(record).find(([header]) => header.trim().toLowerCase() === key);
  return String(entry?.[1] ?? "").trim();
}

export function companyFromRecord(record: Record<string, unknown>): CsvCompany {
  return {
    name: cell(record, "name"),
    website: cell(record, "website"),
    description: cell(record, "description"),
    source: cell(record, "source"),
    status: cell(record, "status"),
  };
}

export function canonicalStatus(status: string) {
  if (!status) return "";
  return COMPANY_STATUSES.find((item) => item.toLowerCase() === status.toLowerCase()) ?? null;
}

export function validateCsvCompany(company: CsvCompany) {
  if (!company.name) return "Enter a company name.";
  if (company.website && !isHttpUrl(company.website)) {
    return "Enter a full website, like https://anthropic.com.";
  }
  if (company.status && canonicalStatus(company.status) === null) {
    return `Status must be one of: ${COMPANY_STATUSES.join(", ")}.`;
  }
  return null;
}

/** Row 1 is the header. The first data row is row 2. */
export function reviewCsv(records: Record<string, unknown>[]): CsvReview[] {
  return records.map((record, index) => {
    const company = companyFromRecord(record);
    const status = canonicalStatus(company.status);
    return {
      row: index + 2,
      company: { ...company, status: status ?? company.status },
      message: validateCsvCompany(company),
    };
  });
}

export function insertableCompanies(reviews: CsvReview[]) {
  return reviews
    .filter((review) => review.message === null)
    .map((review) => ({
      name: review.company.name,
      website: review.company.website || null,
      description: review.company.description || null,
      source: review.company.source || null,
      status: (canonicalStatus(review.company.status) || null) as CompanyStatus | null,
    }));
}

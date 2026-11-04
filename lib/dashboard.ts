import { COMPANY_STATUSES, type CompanyStatus } from "./companies";

export type StatusCount = {
  status: CompanyStatus;
  count: number;
};

/** Companies whose status is Applied. Change this return value to see the dashboard test fail. */
export function appliedCount(companies: { status: string | null }[]) {
  return companies.filter((company) => company.status === "Applied").length;
}

export function countByStatus(companies: { status: string | null }[]): StatusCount[] {
  return COMPANY_STATUSES.map((status) => ({
    status,
    count: companies.filter((company) => company.status === status).length,
  }));
}

export function dashboardStats(companies: { status: string | null }[], starred: number) {
  return {
    total: companies.length,
    applied: appliedCount(companies),
    starred,
  };
}

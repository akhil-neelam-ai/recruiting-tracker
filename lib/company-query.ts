import { COMPANY_STATUSES, type CompanyStatus } from "./companies";

export const COMPANY_SORTS = ["newest", "oldest", "name", "status"] as const;

export type CompanySort = (typeof COMPANY_SORTS)[number];

export type CompanyQuery = {
  q: string;
  status: CompanyStatus | "";
  sort: CompanySort;
};

const STATUS_ORDER = new Map(COMPANY_STATUSES.map((status, index) => [status, index]));

export function parseCompanyQuery(input: {
  q?: string | null;
  status?: string | null;
  sort?: string | null;
}): CompanyQuery {
  const q = (input.q ?? "").trim();
  const status = COMPANY_STATUSES.includes(input.status as CompanyStatus)
    ? (input.status as CompanyStatus)
    : "";
  const sort = COMPANY_SORTS.includes(input.sort as CompanySort) ? (input.sort as CompanySort) : "newest";
  return { q, status, sort };
}

export function companyQueryString(query: CompanyQuery) {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.status) params.set("status", query.status);
  if (query.sort !== "newest") params.set("sort", query.sort);
  const value = params.toString();
  return value ? `?${value}` : "";
}

export function listHref(path: "/" | "/starred", query: CompanyQuery) {
  return `${path}${companyQueryString(query)}`;
}

type ListedCompany = {
  name: string | null;
  status: string | null;
  created_at: string | null;
};

function byName(a: ListedCompany, b: ListedCompany) {
  return (a.name ?? "").localeCompare(b.name ?? "", undefined, { sensitivity: "base" });
}

export function applyCompanyQuery<T extends ListedCompany>(companies: T[], query: CompanyQuery) {
  const needle = query.q.toLowerCase();
  const matched = companies.filter((company) => {
    if (needle && !(company.name ?? "").toLowerCase().includes(needle)) return false;
    if (query.status && company.status !== query.status) return false;
    return true;
  });

  return matched.sort((a, b) => {
    if (query.sort === "name") return byName(a, b);
    if (query.sort === "status") {
      const left = STATUS_ORDER.get(a.status as CompanyStatus) ?? 99;
      const right = STATUS_ORDER.get(b.status as CompanyStatus) ?? 99;
      if (left !== right) return left - right;
      return byName(a, b);
    }
    const aTime = a.created_at ? Date.parse(a.created_at) : 0;
    const bTime = b.created_at ? Date.parse(b.created_at) : 0;
    return query.sort === "oldest" ? aTime - bTime : bTime - aTime;
  });
}

import { parseCompanyQuery } from "@/lib/company-query";

type SearchValue = string | string[] | undefined;

function first(value: SearchValue) {
  return Array.isArray(value) ? value[0] : value;
}

export function companyQueryFromSearchParams(params: {
  q?: SearchValue;
  status?: SearchValue;
  sort?: SearchValue;
}) {
  return parseCompanyQuery({
    q: first(params.q),
    status: first(params.status),
    sort: first(params.sort),
  });
}

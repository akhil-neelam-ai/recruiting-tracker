export function starredCompanyIds(rows: { company_id: number }[]) {
  return new Set(rows.map((row) => row.company_id));
}

export function onlyStarred<T extends { id: number }>(companies: T[], starredIds: Set<number>) {
  return companies.filter((company) => starredIds.has(company.id));
}

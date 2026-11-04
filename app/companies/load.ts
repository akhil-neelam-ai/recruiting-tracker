import { starredCompanyIds } from "@/lib/stars";
import { requireUser } from "@/lib/session";
import { applyCompanyQuery, type CompanyQuery } from "@/lib/company-query";
import type { CompanyListItem } from "@/components/company-list";

export async function loadCompanyList(query: CompanyQuery) {
  const { supabase, email } = await requireUser();
  const [companiesResult, starsResult] = await Promise.all([
    supabase.from("companies").select("id, name, website, status, created_at"),
    supabase.from("stars").select("company_id"),
  ]);

  const companies = applyCompanyQuery((companiesResult.data ?? []) as CompanyListItem[], query);
  const starredIds = starredCompanyIds(
    ((starsResult.data ?? []) as { company_id: unknown }[])
      .map((row) => ({ company_id: Number(row.company_id) }))
      .filter((row) => Number.isInteger(row.company_id)),
  );

  return {
    email,
    companies,
    starredIds,
    error: Boolean(companiesResult.error || starsResult.error),
  };
}

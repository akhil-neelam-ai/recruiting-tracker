import { starredCompanyIds } from "@/lib/stars";
import { requireUser } from "@/lib/session";
import type { CompanyListItem } from "@/components/company-list";

export async function loadCompanyList() {
  const { supabase, email } = await requireUser();
  const [companiesResult, starsResult] = await Promise.all([
    supabase.from("companies").select("id, name, website, status").order("created_at", { ascending: false }),
    supabase.from("stars").select("company_id"),
  ]);

  const companies = (companiesResult.data ?? []) as CompanyListItem[];
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

import { CompanyList } from "@/components/company-list";
import { AppShell } from "@/components/app-shell";
import { loadCompanyList } from "@/app/companies/load";
import { companyQueryFromSearchParams } from "@/lib/search-params";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string | string[]; status?: string | string[]; sort?: string | string[] }>;

export default async function StarredPage({ searchParams }: { searchParams: SearchParams }) {
  const query = companyQueryFromSearchParams(await searchParams);
  const filtered = Boolean(query.q || query.status);

  if (!hasSupabaseEnv()) {
    return (
      <AppShell>
        <CompanyList
          view="starred"
          query={query}
          companies={[]}
          starredIds={new Set()}
          error={false}
          filtered={filtered}
        />
        <p className="notice">
          Copy <code>.env.example</code> to <code>.env.local</code>, add your project URL and
          publishable key, then restart <code>npm run dev</code>.
        </p>
      </AppShell>
    );
  }

  const { email, companies, starredIds, error } = await loadCompanyList(query);

  return (
    <AppShell email={email}>
      <CompanyList
        view="starred"
        query={query}
        companies={companies}
        starredIds={starredIds}
        error={error}
        filtered={filtered}
      />
    </AppShell>
  );
}

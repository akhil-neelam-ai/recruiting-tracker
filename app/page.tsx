import { CompanyList } from "@/components/company-list";
import { AppShell } from "@/components/app-shell";
import { loadCompanyList } from "@/app/companies/load";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  if (!hasSupabaseEnv()) {
    return (
      <AppShell>
        <CompanyList view="all" companies={[]} starredIds={new Set()} error={false} />
        <p className="notice">
          Copy <code>.env.example</code> to <code>.env.local</code>, add your project URL and
          publishable key, then restart <code>npm run dev</code>.
        </p>
      </AppShell>
    );
  }

  const { email, companies, starredIds, error } = await loadCompanyList();

  return (
    <AppShell email={email}>
      <CompanyList view="all" companies={companies} starredIds={starredIds} error={error} />
    </AppShell>
  );
}

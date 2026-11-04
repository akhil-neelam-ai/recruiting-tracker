import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/session";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  if (!hasSupabaseEnv()) {
    return (
      <AppShell>
        <CompanyListHeader />
        <p className="notice">
          Copy <code>.env.example</code> to <code>.env.local</code>, add your project URL and
          publishable key, then restart <code>npm run dev</code>.
        </p>
        <EmptyCompanies />
      </AppShell>
    );
  }

  const { supabase, email } = await requireUser();
  const { data, error } = await supabase
    .from("companies")
    .select("id, name, website, status")
    .order("created_at", { ascending: false });

  return (
    <AppShell email={email}>
      <CompanyListHeader />
      {error ? (
        <p className="error" role="alert">
          Couldn&apos;t load companies. Run supabase/migrations/0001_init.sql in the Supabase SQL
          editor, then refresh.
        </p>
      ) : null}
      {!error && data?.length ? (
        <ul className="company-list">
          {data.map((company) => (
            <li key={company.id}>
              <Link className="company-row" href={`/companies/${company.id}`}>
                <span className="row-top">
                  <strong>{company.name || "Untitled company"}</strong>
                  <span className="badge">{company.status || "No status"}</span>
                </span>
                {company.website ? <span className="quiet">{company.website}</span> : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {!error && !data?.length ? <EmptyCompanies /> : null}
    </AppShell>
  );
}

function CompanyListHeader() {
  return (
    <div className="page-head">
      <div>
        <h1>Companies</h1>
        <p className="lede">
          Your recruiting pipeline. Each company is an application you can open, edit, or delete,
          and only you can see it.
        </p>
      </div>
      <Link className="button-link" href="/companies/new">
        Add a company
      </Link>
    </div>
  );
}

function EmptyCompanies() {
  return (
    <div className="empty">
      <p>No companies yet.</p>
      <p className="quiet">Add one to start the list.</p>
    </div>
  );
}

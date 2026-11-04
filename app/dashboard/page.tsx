import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { countByStatus, dashboardStats } from "@/lib/dashboard";
import { requireUser } from "@/lib/session";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import "./dashboard.css";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!hasSupabaseEnv()) {
    return (
      <AppShell>
        <DashboardBody companies={[]} starred={0} />
        <p className="notice">
          Copy <code>.env.example</code> to <code>.env.local</code>, add your project URL and
          publishable key, then restart <code>npm run dev</code>.
        </p>
      </AppShell>
    );
  }

  const { supabase, email } = await requireUser();
  const [companiesResult, starsResult] = await Promise.all([
    supabase.from("companies").select("status"),
    supabase.from("stars").select("id"),
  ]);
  const companies = (companiesResult.data ?? []) as { status: string | null }[];
  const starred = starsResult.data?.length ?? 0;
  const error = Boolean(companiesResult.error || starsResult.error);

  return (
    <AppShell email={email}>
      <DashboardBody companies={error ? [] : companies} starred={error ? 0 : starred} />
      {error ? (
        <p className="error" role="alert">
          Couldn&apos;t load the dashboard. Run the SQL migrations, then refresh.
        </p>
      ) : null}
    </AppShell>
  );
}

function DashboardBody({
  companies,
  starred,
}: {
  companies: { status: string | null }[];
  starred: number;
}) {
  const stats = dashboardStats(companies, starred);
  const bars = countByStatus(companies);
  const max = Math.max(1, ...bars.map((bar) => bar.count));

  return (
    <>
      <p className="back">
        <Link href="/">Back to companies</Link>
      </p>
      <h1>Dashboard</h1>
      <p className="lede">Your pipeline, counted from the companies only you can see.</p>
      <section className="stats" aria-label="Summary">
        <article className="stat">
          <span>Companies</span>
          <strong>{stats.total}</strong>
        </article>
        <article className="stat">
          <span>Applied</span>
          <strong>{stats.applied}</strong>
        </article>
        <article className="stat">
          <span>Starred</span>
          <strong>{stats.starred}</strong>
        </article>
      </section>
      <h2>Companies by status</h2>
      <div className="chart" role="img" aria-label="Bar chart of companies by status">
        {bars.map((bar) => (
          <div className="chart-row" key={bar.status}>
            <span>{bar.status}</span>
            <div className="bar">
              <i style={{ width: `${(bar.count / max) * 100}%` }} />
            </div>
            <strong>{bar.count}</strong>
          </div>
        ))}
      </div>
    </>
  );
}

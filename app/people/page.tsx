import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/session";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function PeoplePage() {
  if (!hasSupabaseEnv()) {
    return (
      <AppShell>
        <PeopleHeader />
        <p className="notice">Add your Supabase keys to .env.local, then restart the dev server.</p>
      </AppShell>
    );
  }

  const { supabase, email } = await requireUser();
  const [{ data: people, error }, { data: companies }] = await Promise.all([
    supabase.from("people").select("id, name, title, company_id").order("name"),
    supabase.from("companies").select("id, name"),
  ]);
  const names = new Map((companies ?? []).map((company) => [company.id, company.name]));

  return (
    <AppShell email={email}>
      <PeopleHeader />
      {error ? (
        <p className="error" role="alert">
          Couldn&apos;t load people.
        </p>
      ) : null}
      {!error && people?.length ? (
        <ul className="company-list">
          {people.map((person) => (
            <li key={person.id} className="company-item">
              <Link className="company-row" href={`/people/${person.id}`}>
                <span className="row-top">
                  <strong>{person.name || "Untitled person"}</strong>
                  {person.title ? <span className="quiet">{person.title}</span> : null}
                </span>
                {person.company_id ? (
                  <span className="quiet">{names.get(person.company_id) || "Company"}</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {!error && !people?.length ? (
        <div className="empty">
          <p>No people yet.</p>
        </div>
      ) : null}
    </AppShell>
  );
}

function PeopleHeader() {
  return (
    <div className="page-head">
      <div>
        <p className="back">
          <Link href="/">Back to companies</Link>
        </p>
        <h1>People</h1>
        <p className="lede">Contacts on your list. Only you can see them.</p>
      </div>
      <Link className="button-link" href="/people/new">
        Add a person
      </Link>
    </div>
  );
}

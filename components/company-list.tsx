import Link from "next/link";
import { StarButton } from "@/components/star-button";

export type CompanyListItem = {
  id: number;
  name: string | null;
  website: string | null;
  status: string | null;
};

export function CompanyList({
  view,
  companies,
  starredIds,
  error,
}: {
  view: "all" | "starred";
  companies: CompanyListItem[];
  starredIds: Set<number>;
  error: boolean;
}) {
  const visible = view === "starred" ? companies.filter((company) => starredIds.has(company.id)) : companies;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{view === "starred" ? "Starred" : "Companies"}</h1>
          <p className="lede">
            {view === "starred"
              ? "Only the companies you starred. Each star is one row in the shared stars table."
              : "Your recruiting pipeline. Star a company to keep it one click away."}
          </p>
          <nav className="view-switch" aria-label="Company lists">
            <Link href="/" aria-current={view === "all" ? "page" : undefined}>
              All
            </Link>
            <Link href="/starred" aria-current={view === "starred" ? "page" : undefined}>
              Starred
            </Link>
          </nav>
        </div>
        <Link className="button-link" href="/companies/new">
          Add a company
        </Link>
      </div>
      {error ? (
        <p className="error" role="alert">
          Couldn&apos;t load companies. Run supabase/migrations/0001_init.sql in the Supabase SQL editor,
          then refresh.
        </p>
      ) : null}
      {!error && visible.length ? (
        <ul className="company-list">
          {visible.map((company) => {
            const name = company.name || "Untitled company";
            return (
              <li key={company.id} className="company-item">
                <StarButton companyId={company.id} starred={starredIds.has(company.id)} name={name} />
                <Link className="company-row" href={`/companies/${company.id}`}>
                  <span className="row-top">
                    <strong>{name}</strong>
                    <span className="badge">{company.status || "No status"}</span>
                  </span>
                  {company.website ? <span className="quiet">{company.website}</span> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
      {!error && !visible.length ? (
        <div className="empty">
          {view === "starred" ? (
            <>
              <p>No starred companies yet.</p>
              <p className="quiet">Star one from the full list.</p>
            </>
          ) : (
            <>
              <p>No companies yet.</p>
              <p className="quiet">Add one to start the list.</p>
            </>
          )}
        </div>
      ) : null}
    </>
  );
}

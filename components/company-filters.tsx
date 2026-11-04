"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { COMPANY_STATUSES } from "@/lib/companies";
import { listHref, parseCompanyQuery, type CompanyQuery } from "@/lib/company-query";

export function CompanyFilters({ view, query }: { view: "all" | "starred"; query: CompanyQuery }) {
  const router = useRouter();
  const path = view === "starred" ? "/starred" : "/";
  const active = Boolean(query.q || query.status || query.sort !== "newest");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = parseCompanyQuery({
      q: String(data.get("q") ?? ""),
      status: String(data.get("status") ?? ""),
      sort: String(data.get("sort") ?? ""),
    });
    router.push(listHref(path, next));
  }

  return (
    <form className="find-form" method="get" action={path} onSubmit={onSubmit} key={listHref(path, query)}>
      <label>
        Search
        <input name="q" defaultValue={query.q} placeholder="Company name" />
      </label>
      <label>
        Status
        <select name="status" defaultValue={query.status}>
          <option value="">Any status</option>
          {COMPANY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
      <label>
        Sort
        <select name="sort" defaultValue={query.sort}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Name A–Z</option>
          <option value="status">Status</option>
        </select>
      </label>
      <button type="submit">Apply</button>
      {active ? <Link href={path}>Clear</Link> : null}
    </form>
  );
}

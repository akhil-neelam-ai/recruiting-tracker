import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { DeleteCompanyButton } from "@/components/delete-company";
import { companyId } from "@/lib/companies";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CompanyDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id: raw } = await params;
  const id = companyId(raw);
  if (!id) notFound();

  const { supabase, email } = await requireUser();
  const { data } = await supabase
    .from("companies")
    .select("id, name, website, description, source, status, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  const query = await searchParams;
  const created = data.created_at
    ? new Date(data.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <AppShell email={email}>
      <p className="back">
        <Link href="/">Back to companies</Link>
      </p>
      <div className="page-head">
        <h1>{data.name || "Untitled company"}</h1>
        <span className="badge">{data.status || "No status"}</span>
      </div>
      {query.error === "delete" ? (
        <p className="error" role="alert">
          Couldn&apos;t delete that company. Try again.
        </p>
      ) : null}
      <dl className="meta">
        <dt>Website</dt>
        <dd>{data.website || "—"}</dd>
        <dt>Source</dt>
        <dd>{data.source || "—"}</dd>
        <dt>Description</dt>
        <dd>{data.description || "—"}</dd>
        <dt>Added</dt>
        <dd>{created || "—"}</dd>
      </dl>
      <div className="actions">
        <Link className="button-link" href={`/companies/${data.id}/edit`}>
          Edit
        </Link>
        <DeleteCompanyButton id={data.id} name={data.name || "this company"} />
      </div>
    </AppShell>
  );
}

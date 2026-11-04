import Link from "next/link";
import { notFound } from "next/navigation";
import { addInteraction } from "@/app/people/actions";
import { AppShell } from "@/components/app-shell";
import { DeletePersonButton } from "@/components/delete-person";
import { InteractionForm } from "@/components/interaction-form";
import { companyId } from "@/lib/companies";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function PersonPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const id = companyId((await params).id);
  if (!id) notFound();
  const { supabase, email } = await requireUser();
  const [{ data: person }, { data: interactions }, { data: company }] = await Promise.all([
    supabase
      .from("people")
      .select("id, name, email, title, company_id, how_met, tags")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("interactions")
      .select("id, date, source, summary")
      .eq("person_id", id)
      .order("date", { ascending: false }),
    supabase.from("companies").select("id, name"),
  ]);
  if (!person) notFound();
  const companyName = (company ?? []).find((row) => row.id === person.company_id)?.name;
  const query = await searchParams;

  return (
    <AppShell email={email}>
      <p className="back">
        <Link href="/people">Back to people</Link>
      </p>
      <h1>{person.name || "Untitled person"}</h1>
      {query.error === "delete" ? (
        <p className="error" role="alert">
          Couldn&apos;t delete that person.
        </p>
      ) : null}
      <dl className="meta">
        <dt>Email</dt>
        <dd>{person.email || "—"}</dd>
        <dt>Title</dt>
        <dd>{person.title || "—"}</dd>
        <dt>Company</dt>
        <dd>{companyName || "—"}</dd>
        <dt>How we met</dt>
        <dd>{person.how_met || "—"}</dd>
        <dt>Tags</dt>
        <dd>{person.tags || "—"}</dd>
      </dl>
      <div className="actions">
        <Link className="button-link" href={`/people/${person.id}/edit`}>
          Edit
        </Link>
        <DeletePersonButton id={person.id} name={person.name || "this person"} />
      </div>
      <h2>Interactions</h2>
      <InteractionForm action={addInteraction.bind(null, person.id)} />
      {interactions?.length ? (
        <ul className="company-list">
          {interactions.map((item) => (
            <li key={item.id} className="company-item">
              <div className="company-row">
              <span className="row-top">
                <strong>{item.date || "No date"}</strong>
                <span className="badge">{item.source || "note"}</span>
              </span>
              <span>{item.summary}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="quiet">No interactions yet.</p>
      )}
    </AppShell>
  );
}

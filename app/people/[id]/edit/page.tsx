import Link from "next/link";
import { notFound } from "next/navigation";
import { updatePerson } from "@/app/people/actions";
import { AppShell } from "@/components/app-shell";
import { PersonForm } from "@/components/person-form";
import { companyId } from "@/lib/companies";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function EditPersonPage({ params }: { params: Promise<{ id: string }> }) {
  const id = companyId((await params).id);
  if (!id) notFound();
  const { supabase, email } = await requireUser();
  const [{ data: person }, { data: companies }] = await Promise.all([
    supabase
      .from("people")
      .select("id, name, email, title, company_id, how_met, tags")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("companies").select("id, name").order("name"),
  ]);
  if (!person) notFound();

  return (
    <AppShell email={email}>
      <p className="back">
        <Link href={`/people/${person.id}`}>Back to {person.name || "person"}</Link>
      </p>
      <h1>Edit person</h1>
      <PersonForm
        action={updatePerson.bind(null, person.id)}
        companies={companies ?? []}
        submitLabel="Save changes"
        initial={{
          name: person.name,
          email: person.email,
          title: person.title,
          companyId: person.company_id,
          howMet: person.how_met,
          tags: person.tags,
        }}
      />
    </AppShell>
  );
}

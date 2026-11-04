import Link from "next/link";
import { createPerson } from "@/app/people/actions";
import { AppShell } from "@/components/app-shell";
import { PersonForm } from "@/components/person-form";
import { companyId } from "@/lib/companies";
import { requireUser } from "@/lib/session";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function NewPersonPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string }>;
}) {
  const preset = companyId((await searchParams).company ?? "");
  if (!hasSupabaseEnv()) {
    return (
      <AppShell>
        <p className="notice">Add your Supabase keys to .env.local, then restart the dev server.</p>
      </AppShell>
    );
  }
  const { supabase, email } = await requireUser();
  const { data: companies } = await supabase.from("companies").select("id, name").order("name");

  return (
    <AppShell email={email}>
      <p className="back">
        <Link href="/people">Back to people</Link>
      </p>
      <h1>Add a person</h1>
      <PersonForm
        action={createPerson}
        companies={companies ?? []}
        initial={{ companyId: preset }}
        submitLabel="Save person"
      />
    </AppShell>
  );
}

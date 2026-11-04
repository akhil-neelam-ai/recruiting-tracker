import Link from "next/link";
import { notFound } from "next/navigation";
import { updateCompany } from "@/app/companies/actions";
import { AppShell } from "@/components/app-shell";
import { CompanyForm } from "@/components/company-form";
import { companyId, type CompanyStatus } from "@/lib/companies";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = await params;
  const id = companyId(raw);
  if (!id) notFound();

  const { supabase, email } = await requireUser();
  const { data } = await supabase
    .from("companies")
    .select("id, name, website, description, source, status")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  return (
    <AppShell email={email}>
      <p className="back">
        <Link href={`/companies/${data.id}`}>Back to {data.name || "company"}</Link>
      </p>
      <h1>Edit company</h1>
      <CompanyForm
        action={updateCompany.bind(null, data.id)}
        submitLabel="Save changes"
        initial={{
          name: data.name ?? "",
          website: data.website,
          description: data.description,
          source: data.source,
          status: (data.status as CompanyStatus | null) ?? "Researching",
        }}
      />
    </AppShell>
  );
}

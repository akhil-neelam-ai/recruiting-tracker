import Link from "next/link";
import { createCompany } from "@/app/companies/actions";
import { AppShell } from "@/components/app-shell";
import { CompanyForm } from "@/components/company-form";
import { requireUser } from "@/lib/session";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function NewCompanyPage() {
  const email = hasSupabaseEnv() ? (await requireUser()).email : undefined;

  return (
    <AppShell email={email}>
      <p className="back">
        <Link href="/">Back to companies</Link>
      </p>
      <h1>Add a company</h1>
      <p className="lede">Name, website, description, source, and where it sits in your pipeline.</p>
      <CompanyForm action={createCompany} submitLabel="Save company" />
    </AppShell>
  );
}

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { CsvImporter } from "@/components/csv-importer";
import { requireUser } from "@/lib/session";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import "./import.css";

export const dynamic = "force-dynamic";

export default async function ImportPage() {
  const email = hasSupabaseEnv() ? (await requireUser()).email : undefined;

  return (
    <AppShell email={email}>
      <p className="back">
        <Link href="/">Back to companies</Link>
      </p>
      <h1>Import companies</h1>
      <p className="lede">
        Upload a CSV, check the preview, then save the valid rows onto your list.
      </p>
      <CsvImporter />
    </AppShell>
  );
}

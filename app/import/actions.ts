"use server";

import { revalidatePath } from "next/cache";
import { insertableCompanies, reviewCsv, type CsvReview } from "@/lib/csv-companies";
import { requireUser } from "@/lib/session";

export async function importCompanies(reviews: CsvReview[]) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return { inserted: 0, errors: [{ row: 0, message: "Nothing to import." }] };
  }
  if (reviews.length > 500) {
    return { inserted: 0, errors: [{ row: 0, message: "Import 500 rows or fewer at a time." }] };
  }

  const checked = reviewCsv(
    reviews.map((review) => ({
      name: review.company?.name ?? "",
      website: review.company?.website ?? "",
      description: review.company?.description ?? "",
      source: review.company?.source ?? "",
      status: review.company?.status ?? "",
    })),
  );
  const errors = checked
    .filter((review) => review.message)
    .map((review) => ({ row: review.row, message: review.message as string }));
  const ready = insertableCompanies(checked);
  if (!ready.length) return { inserted: 0, errors };

  const { supabase, userId } = await requireUser();
  const { error } = await supabase.from("companies").insert(
    ready.map((company) => ({
      user_id: userId,
      name: company.name,
      website: company.website,
      description: company.description,
      source: company.source,
      status: company.status,
    })),
  );
  if (error) {
    return {
      inserted: 0,
      errors: [...errors, { row: 0, message: "Couldn't save the valid rows. Try again." }],
    };
  }
  revalidatePath("/");
  return { inserted: ready.length, errors };
}

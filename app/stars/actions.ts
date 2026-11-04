"use server";

import { revalidatePath } from "next/cache";
import { companyId } from "@/lib/companies";
import { requireUser } from "@/lib/session";

export async function toggleStar(formData: FormData) {
  const id = companyId(String(formData.get("companyId") ?? ""));
  const intent = String(formData.get("intent") ?? "");
  if (!id || (intent !== "star" && intent !== "unstar")) return;

  const { supabase, userId } = await requireUser();
  const { data: company } = await supabase.from("companies").select("id").eq("id", id).maybeSingle();
  if (!company) return;

  if (intent === "unstar") {
    await supabase.from("stars").delete().eq("user_id", userId).eq("company_id", id);
  } else {
    const { error } = await supabase.from("stars").insert({ user_id: userId, company_id: id });
    if (error && error.code !== "23505") return;
  }

  revalidatePath("/");
  revalidatePath("/starred");
  revalidatePath(`/companies/${id}`);
}

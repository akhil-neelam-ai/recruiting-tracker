"use server";

import { redirect } from "next/navigation";
import { draftFromForm, parseCompanyForm, type FormState } from "@/lib/companies";
import { requireUser } from "@/lib/session";
import { hasSupabaseEnv } from "@/lib/supabase/env";

async function saveFields(formData: FormData) {
  const draft = draftFromForm(formData);
  const parsed = parseCompanyForm(formData);
  if (!parsed.ok) return { error: "", fieldErrors: parsed.fieldErrors, draft };
  if (!hasSupabaseEnv()) return { error: "Supabase is not connected yet.", draft };
  return { error: "", draft, value: parsed.value };
}

export async function createCompany(_prev: FormState, formData: FormData): Promise<FormState> {
  const saved = await saveFields(formData);
  if (saved.fieldErrors || saved.error || !saved.value) {
    return { error: saved.error, fieldErrors: saved.fieldErrors, draft: saved.draft };
  }

  const { supabase, userId } = await requireUser();
  const { data, error } = await supabase
    .from("companies")
    .insert({ user_id: userId, ...saved.value })
    .select("id")
    .single();

  if (error || !data) return { error: "Couldn't save that company. Try again.", draft: saved.draft };
  redirect(`/companies/${data.id}`);
}

export async function updateCompany(
  id: number,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const saved = await saveFields(formData);
  if (saved.fieldErrors || saved.error || !saved.value) {
    return { error: saved.error, fieldErrors: saved.fieldErrors, draft: saved.draft };
  }

  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("companies")
    .update(saved.value)
    .eq("id", id)
    .select("id");

  if (error || !data?.length) {
    return { error: "Couldn't update that company. Try again.", draft: saved.draft };
  }
  redirect(`/companies/${id}`);
}

export async function deleteCompany(id: number) {
  const { supabase } = await requireUser();
  const { data, error } = await supabase.from("companies").delete().eq("id", id).select("id");
  if (error || !data?.length) redirect(`/companies/${id}?error=delete`);
  redirect("/");
}

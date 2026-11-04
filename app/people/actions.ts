"use server";

import { redirect } from "next/navigation";
import { parseInteractionForm, parsePersonForm } from "@/lib/people";
import { requireUser } from "@/lib/session";

function blank(value: string | null) {
  return value;
}

export async function createPerson(_prev: { error: string }, formData: FormData) {
  const parsed = parsePersonForm(formData);
  if (!parsed.ok) return { error: Object.values(parsed.fieldErrors)[0] ?? "Check the form." };
  const { supabase, userId } = await requireUser();
  if (parsed.value.companyId) {
    const { data: company } = await supabase
      .from("companies")
      .select("id")
      .eq("id", parsed.value.companyId)
      .maybeSingle();
    if (!company) return { error: "That company isn't on your list." };
  }
  const { data, error } = await supabase
    .from("people")
    .insert({
      user_id: userId,
      name: parsed.value.name,
      email: blank(parsed.value.email),
      title: parsed.value.title,
      company_id: parsed.value.companyId,
      how_met: parsed.value.howMet,
      tags: parsed.value.tags,
    })
    .select("id")
    .single();
  if (error || !data) return { error: "Couldn't save that person. Try again." };
  redirect(`/people/${data.id}`);
}

export async function updatePerson(id: number, _prev: { error: string }, formData: FormData) {
  const parsed = parsePersonForm(formData);
  if (!parsed.ok) return { error: Object.values(parsed.fieldErrors)[0] ?? "Check the form." };
  const { supabase } = await requireUser();
  if (parsed.value.companyId) {
    const { data: company } = await supabase
      .from("companies")
      .select("id")
      .eq("id", parsed.value.companyId)
      .maybeSingle();
    if (!company) return { error: "That company isn't on your list." };
  }
  const { data, error } = await supabase
    .from("people")
    .update({
      name: parsed.value.name,
      email: parsed.value.email,
      title: parsed.value.title,
      company_id: parsed.value.companyId,
      how_met: parsed.value.howMet,
      tags: parsed.value.tags,
    })
    .eq("id", id)
    .select("id");
  if (error || !data?.length) return { error: "Couldn't update that person. Try again." };
  redirect(`/people/${id}`);
}

export async function deletePerson(id: number) {
  const { supabase } = await requireUser();
  const { data, error } = await supabase.from("people").delete().eq("id", id).select("id");
  if (error || !data?.length) redirect(`/people/${id}?error=delete`);
  redirect("/people");
}

export async function addInteraction(personId: number, _prev: { error: string }, formData: FormData) {
  const parsed = parseInteractionForm(formData);
  if (!parsed.ok) return { error: Object.values(parsed.fieldErrors)[0] ?? "Check the interaction." };
  const { supabase } = await requireUser();
  const { data: person } = await supabase.from("people").select("id").eq("id", personId).maybeSingle();
  if (!person) return { error: "That person isn't on your list." };
  const { error } = await supabase.from("interactions").insert({
    person_id: personId,
    date: parsed.value.date,
    source: parsed.value.source,
    summary: parsed.value.summary,
  });
  if (error) return { error: "Couldn't save that interaction. Try again." };
  redirect(`/people/${personId}`);
}

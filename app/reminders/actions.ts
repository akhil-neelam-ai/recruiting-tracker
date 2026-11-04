"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseReminderForm } from "@/lib/reminders";
import { requireUser } from "@/lib/session";

export async function createReminder(_prev: { error: string }, formData: FormData) {
  const parsed = parseReminderForm(formData);
  if (!parsed.ok) return { error: parsed.error };
  const { supabase } = await requireUser();
  const { data: person } = await supabase.from("people").select("id").eq("id", parsed.value.personId).maybeSingle();
  if (!person) return { error: "That person isn't on your list." };
  const { error } = await supabase.from("reminders").insert({
    person_id: parsed.value.personId,
    due_date: parsed.value.dueDate,
    note: parsed.value.note,
    done: false,
  });
  if (error) return { error: "Couldn't save that reminder. Try again." };
  redirect("/reminders");
}

export async function markReminderDone(id: number) {
  const { supabase } = await requireUser();
  await supabase.from("reminders").update({ done: true }).eq("id", id);
  revalidatePath("/reminders");
}

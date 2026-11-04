import Link from "next/link";
import { createReminder, markReminderDone } from "@/app/reminders/actions";
import { AppShell } from "@/components/app-shell";
import { ReminderForm } from "@/components/reminder-form";
import { dueThisWeek } from "@/lib/reminders";
import { requireUser } from "@/lib/session";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

type ReminderRow = {
  id: number;
  person_id: number;
  due_date: string | null;
  note: string | null;
  done: boolean;
};

export default async function RemindersPage() {
  if (!hasSupabaseEnv()) {
    return (
      <AppShell>
        <h1>Reminders</h1>
        <p className="notice">Add your Supabase keys to .env.local, then restart the dev server.</p>
      </AppShell>
    );
  }

  const { supabase, email } = await requireUser();
  const [{ data: reminders, error }, { data: people }] = await Promise.all([
    supabase.from("reminders").select("id, person_id, due_date, note, done").order("due_date"),
    supabase.from("people").select("id, name").order("name"),
  ]);
  const rows = (reminders ?? []) as ReminderRow[];
  const names = new Map((people ?? []).map((person) => [person.id, person.name]));
  const week = dueThisWeek(rows, new Date());

  return (
    <AppShell email={email}>
      <p className="back">
        <Link href="/">Back to companies</Link>
      </p>
      <h1>Reminders</h1>
      <p className="lede">A due date on a person. Mark it done when you follow up.</p>
      {error ? (
        <p className="error" role="alert">
          Couldn&apos;t load reminders.
        </p>
      ) : null}
      <h2>Due this week</h2>
      <ReminderList rows={week} names={names} empty="Nothing due this week." />
      <h2>Add a reminder</h2>
      {(people ?? []).length === 0 ? <p className="quiet">Add a person first, then come back.</p> : null}
      <ReminderForm action={createReminder} people={people ?? []} />
      <h2>All reminders</h2>
      <ReminderList rows={rows} names={names} empty="No reminders yet." />
    </AppShell>
  );
}

function ReminderList({
  rows,
  names,
  empty,
}: {
  rows: ReminderRow[];
  names: Map<number, string | null>;
  empty: string;
}) {
  if (!rows.length) return <p className="quiet">{empty}</p>;
  return (
    <ul className="company-list">
      {rows.map((reminder) => (
        <li key={reminder.id} className="company-item">
          <div className="company-row">
            <span className="row-top">
              <strong>{names.get(reminder.person_id) || "Person"}</strong>
              <span className="badge">{reminder.done ? "Done" : reminder.due_date || "No date"}</span>
            </span>
            {reminder.note ? <span>{reminder.note}</span> : null}
            {reminder.done ? null : (
              <form action={markReminderDone.bind(null, reminder.id)}>
                <button type="submit" className="ghost">
                  Mark done
                </button>
              </form>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export type ReminderDraft = {
  personId: number | null;
  dueDate: string;
  note: string;
  done: boolean;
};

export function parseReminderForm(
  formData: FormData,
):
  | { ok: true; value: { personId: number; dueDate: string; note: string | null } }
  | { ok: false; error: string } {
  const personId = Number(String(formData.get("personId") ?? ""));
  const dueDate = String(formData.get("dueDate") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  if (!Number.isInteger(personId) || personId <= 0) return { ok: false, error: "Choose a person." };
  if (!dueDate) return { ok: false, error: "Choose a due date." };
  return { ok: true, value: { personId, dueDate, note: note || null } };
}

function isoDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Monday through Sunday that contains today, as YYYY-MM-DD strings. */
export function weekBounds(today: Date) {
  const day = today.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + mondayOffset);
  const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
  return { start: isoDate(monday), end: isoDate(sunday) };
}

export function dueThisWeek<T extends { due_date: string | null; done: boolean }>(
  reminders: T[],
  today: Date,
) {
  const { start, end } = weekBounds(today);
  return reminders.filter(
    (reminder) => !reminder.done && reminder.due_date !== null && reminder.due_date >= start && reminder.due_date <= end,
  );
}

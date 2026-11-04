import { describe, expect, it } from "vitest";
import { dueThisWeek, parseReminderForm, weekBounds } from "../lib/reminders";

describe("dueThisWeek", () => {
  it("keeps an open reminder that falls between Monday and Sunday", () => {
    const today = new Date(2026, 10, 4);
    const bounds = weekBounds(today);
    const reminders = [
      { due_date: bounds.start, done: false, note: "monday" },
      { due_date: bounds.end, done: false, note: "sunday" },
      { due_date: "2026-01-01", done: false, note: "old" },
      { due_date: bounds.start, done: true, note: "finished" },
    ];
    expect(dueThisWeek(reminders, today).map((reminder) => reminder.note)).toEqual(["monday", "sunday"]);
  });
});

describe("parseReminderForm", () => {
  it("requires a person and a due date", () => {
    expect(parseReminderForm(new FormData())).toEqual({ ok: false, error: "Choose a person." });
  });
});

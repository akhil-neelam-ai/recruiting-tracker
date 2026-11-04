import { describe, expect, it } from "vitest";
import { parseInteractionForm, parsePersonForm } from "../lib/people";

describe("parsePersonForm", () => {
  it("requires a name", () => {
    const data = new FormData();
    expect(parsePersonForm(data)).toEqual({ ok: false, fieldErrors: { name: "Enter a name." } });
  });

  it("keeps a person without a company", () => {
    const data = new FormData();
    data.set("name", "Ada");
    data.set("email", "ada@berkeley.edu");
    data.set("tags", "product, referral");
    const parsed = parsePersonForm(data);
    expect(parsed.ok && parsed.value.companyId).toBeNull();
    expect(parsed.ok && parsed.value.tags).toBe("product, referral");
  });
});

describe("parseInteractionForm", () => {
  it("requires a date, a known type, and notes", () => {
    const data = new FormData();
    data.set("source", "carrier pigeon");
    const parsed = parseInteractionForm(data);
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.fieldErrors.date).toBe("Choose a date.");
      expect(parsed.fieldErrors.summary).toMatch(/note/);
      expect(parsed.fieldErrors.source).toMatch(/zoom/);
    }
  });
});

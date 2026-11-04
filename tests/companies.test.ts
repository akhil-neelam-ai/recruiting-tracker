import { describe, expect, it } from "vitest";
import { companyId, parseCompanyForm } from "../lib/companies";

describe("parseCompanyForm", () => {
  it("requires a company name", () => {
    const formData = new FormData();
    formData.set("status", "Applied");
    expect(parseCompanyForm(formData)).toEqual({ ok: false, error: "Enter a company name." });
  });

  it("trims the name, drops a blank website, and keeps an allowed status", () => {
    const formData = new FormData();
    formData.set("name", "  Anthropic ");
    formData.set("website", "   ");
    formData.set("description", " AI lab ");
    formData.set("source", " Coffee chat ");
    formData.set("status", "Applied");

    expect(parseCompanyForm(formData)).toEqual({
      ok: true,
      value: {
        name: "Anthropic",
        website: null,
        description: "AI lab",
        source: "Coffee chat",
        status: "Applied",
      },
    });
  });

  it("falls back to Researching when the status is not one of the six", () => {
    const formData = new FormData();
    formData.set("name", "Abridge");
    formData.set("status", "Ghosted");
    const parsed = parseCompanyForm(formData);
    expect(parsed.ok && parsed.value.status).toBe("Researching");
  });
});

describe("companyId", () => {
  it("accepts a positive integer and rejects anything else", () => {
    expect(companyId("12")).toBe(12);
    expect(companyId("0")).toBeNull();
    expect(companyId("1.5")).toBeNull();
    expect(companyId("abc")).toBeNull();
  });
});

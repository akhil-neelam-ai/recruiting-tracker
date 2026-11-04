import { describe, expect, it } from "vitest";
import { companyId, normalizeWebsite, parseCompanyForm } from "../lib/companies";

function companyForm(fields: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) formData.set(key, value);
  return formData;
}

describe("parseCompanyForm", () => {
  it("requires a company name", () => {
    expect(parseCompanyForm(companyForm({ status: "Applied" }))).toEqual({
      ok: false,
      fieldErrors: { name: "Enter a company name." },
    });
  });

  it("adds https:// to meta.com and www.meta.com, and leaves a full URL alone", () => {
    expect(normalizeWebsite(" meta.com ")).toBe("https://meta.com");
    expect(normalizeWebsite("www.meta.com")).toBe("https://www.meta.com");
    expect(normalizeWebsite("https://meta.com")).toBe("https://meta.com");

    for (const website of ["meta.com", "www.meta.com", "https://meta.com"]) {
      const parsed = parseCompanyForm(companyForm({ name: "Meta", website, status: "Researching" }));
      expect(parsed.ok && parsed.value.website).toBe(normalizeWebsite(website));
    }
  });

  it("rejects a hostname with no dot and a value that is not a url", () => {
    for (const website of ["meta", "not a url"]) {
      const parsed = parseCompanyForm(companyForm({ name: "Meta", website, status: "Researching" }));
      expect(parsed).toEqual({
        ok: false,
        fieldErrors: { website: "Enter a website, like meta.com." },
      });
    }
  });

  it("reports a blank name and a bad website together", () => {
    const parsed = parseCompanyForm(companyForm({ website: "not a url", status: "Applied" }));
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.fieldErrors.name).toBe("Enter a company name.");
      expect(parsed.fieldErrors.website).toBe("Enter a website, like meta.com.");
    }
  });

  it("trims the name, drops a blank website, and keeps an allowed status", () => {
    expect(
      parseCompanyForm(
        companyForm({
          name: "  Anthropic ",
          website: "   ",
          description: " AI lab ",
          source: " Coffee chat ",
          status: "Applied",
        }),
      ),
    ).toEqual({
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

  it("accepts an https website", () => {
    const parsed = parseCompanyForm(
      companyForm({ name: "Anthropic", website: "https://anthropic.com", status: "Applied" }),
    );
    expect(parsed.ok && parsed.value.website).toBe("https://anthropic.com");
  });

  it("rejects a status that is not on the list", () => {
    expect(parseCompanyForm(companyForm({ name: "Abridge", status: "Ghosted" }))).toEqual({
      ok: false,
      fieldErrors: { status: "Choose a status from the list." },
    });
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

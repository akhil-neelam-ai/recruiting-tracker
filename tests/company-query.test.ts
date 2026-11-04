import { describe, expect, it } from "vitest";
import { applyCompanyQuery, companyQueryString, parseCompanyQuery } from "../lib/company-query";

const companies = [
  { id: 1, name: "Anduril", status: "Researching", created_at: "2026-01-02T00:00:00.000Z" },
  { id: 2, name: "Anthropic", status: "Applied", created_at: "2026-03-01T00:00:00.000Z" },
  { id: 3, name: "Abridge", status: "Interviewing", created_at: "2026-02-01T00:00:00.000Z" },
];

describe("parseCompanyQuery", () => {
  it("keeps a name search, an allowed status, and a known sort", () => {
    expect(parseCompanyQuery({ q: "  anthro ", status: "Applied", sort: "name" })).toEqual({
      q: "anthro",
      status: "Applied",
      sort: "name",
    });
  });

  it("drops an unknown status and sort", () => {
    expect(parseCompanyQuery({ q: "", status: "Ghosted", sort: "random" })).toEqual({
      q: "",
      status: "",
      sort: "newest",
    });
  });
});

describe("companyQueryString", () => {
  it("omits the default newest sort and empty filters", () => {
    expect(companyQueryString({ q: "Anthropic", status: "Applied", sort: "name" })).toBe(
      "?q=Anthropic&status=Applied&sort=name",
    );
    expect(companyQueryString({ q: "", status: "", sort: "newest" })).toBe("");
  });
});

describe("applyCompanyQuery", () => {
  it("searches the name and filters by status", () => {
    const found = applyCompanyQuery(companies, { q: "AN", status: "Applied", sort: "newest" });
    expect(found.map((company) => company.name)).toEqual(["Anthropic"]);
  });

  it("sorts newest, oldest, name, and pipeline status", () => {
    const query = { q: "", status: "" as const, sort: "newest" as const };
    expect(applyCompanyQuery(companies, query).map((company) => company.name)).toEqual([
      "Anthropic",
      "Abridge",
      "Anduril",
    ]);
    expect(applyCompanyQuery(companies, { ...query, sort: "oldest" }).map((company) => company.name)).toEqual([
      "Anduril",
      "Abridge",
      "Anthropic",
    ]);
    expect(applyCompanyQuery(companies, { ...query, sort: "name" }).map((company) => company.name)).toEqual([
      "Abridge",
      "Anduril",
      "Anthropic",
    ]);
    expect(applyCompanyQuery(companies, { ...query, sort: "status" }).map((company) => company.name)).toEqual([
      "Anduril",
      "Anthropic",
      "Abridge",
    ]);
  });
});

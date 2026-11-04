import { describe, expect, it } from "vitest";
import { onlyStarred, starredCompanyIds } from "../lib/stars";

describe("starred companies", () => {
  it("keeps only the companies whose ids are in the stars rows", () => {
    const companies = [
      { id: 1, name: "Anthropic" },
      { id: 2, name: "Abridge" },
      { id: 3, name: "Anduril" },
    ];
    const ids = starredCompanyIds([{ company_id: 1 }, { company_id: 3 }]);
    expect(onlyStarred(companies, ids).map((company) => company.name)).toEqual(["Anthropic", "Anduril"]);
  });

  it("returns an empty list when nothing is starred", () => {
    expect(onlyStarred([{ id: 4, name: "OpenAI" }], starredCompanyIds([]))).toEqual([]);
  });
});

import { describe, expect, it } from "vitest";
import { insertableCompanies, reviewCsv } from "../lib/csv-companies";

describe("reviewCsv", () => {
  it("previews a good row and reports a blank name and a bad website", () => {
    const reviews = reviewCsv([
      { Name: "Anthropic", Website: "https://anthropic.com", Status: "applied" },
      { name: "", website: "anthropic.com", status: "Nope" },
    ]);
    expect(reviews[0]?.message).toBeNull();
    expect(reviews[0]?.company.status).toBe("Applied");
    expect(reviews[0]?.row).toBe(2);
    expect(reviews[1]?.message).toMatch(/company name/);
    expect(insertableCompanies(reviews)).toHaveLength(1);
  });
});

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

  it("saves meta.com and www.meta.com with https:// and rejects meta and not a url", () => {
    const reviews = reviewCsv([
      { name: "Meta", website: "meta.com" },
      { name: "Meta", website: "www.meta.com" },
      { name: "Meta", website: "https://meta.com" },
      { name: "Meta", website: "meta" },
      { name: "Meta", website: "not a url" },
    ]);
    expect(reviews.slice(0, 3).map((review) => review.company.website)).toEqual([
      "https://meta.com",
      "https://www.meta.com",
      "https://meta.com",
    ]);
    expect(reviews.slice(0, 3).every((review) => review.message === null)).toBe(true);
    expect(reviews[3]?.message).toBe("Enter a website, like meta.com.");
    expect(reviews[4]?.message).toBe("Enter a website, like meta.com.");
    expect(insertableCompanies(reviews).map((company) => company.website)).toEqual([
      "https://meta.com",
      "https://www.meta.com",
      "https://meta.com",
    ]);
  });
});

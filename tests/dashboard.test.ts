import { describe, expect, it } from "vitest";
import { appliedCount, countByStatus } from "../lib/dashboard";

// To take the red screenshot: in lib/dashboard.ts, make appliedCount return 0.
// Run `npm test`. This test fails. Put the filter back and run `npm test` again for green.
describe("appliedCount", () => {
  it("counts 1 Applied company when 3 companies are loaded and 1 is Applied", () => {
    const companies = [{ status: "Researching" }, { status: "Applied" }, { status: "Interviewing" }];
    expect(appliedCount(companies)).toBe(1);
  });
});

describe("countByStatus", () => {
  it("fills every pipeline status, including zeros", () => {
    const counts = countByStatus([{ status: "Applied" }, { status: "Applied" }]);
    expect(counts.find((row) => row.status === "Applied")?.count).toBe(2);
    expect(counts.find((row) => row.status === "Offer")?.count).toBe(0);
    expect(counts).toHaveLength(6);
  });
});

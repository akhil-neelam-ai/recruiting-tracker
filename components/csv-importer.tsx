"use client";

import Papa from "papaparse";
import { useState } from "react";
import { importCompanies } from "@/app/import/actions";
import { reviewCsv, type CsvReview } from "@/lib/csv-companies";

export function CsvImporter() {
  const [reviews, setReviews] = useState<CsvReview[]>([]);
  const [parseError, setParseError] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ inserted: number; errors: { row: number; message: string }[] } | null>(
    null,
  );

  function onFile(file: File | undefined) {
    setResult(null);
    if (!file) return;
    Papa.parse<Record<string, unknown>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(parsed) {
        const first = parsed.errors[0]?.message;
        setParseError(first ?? "");
        setReviews(reviewCsv(parsed.data ?? []));
      },
    });
  }

  async function onImport() {
    setPending(true);
    const response = await importCompanies(reviews);
    setResult(response);
    setPending(false);
  }

  const ready = reviews.filter((review) => !review.message).length;

  return (
    <div>
      <label>
        CSV file
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(event) => onFile(event.target.files?.[0])}
        />
      </label>
      <p className="quiet">Columns: name, website, description, source, status. The header is row 1.</p>
      {parseError ? (
        <p className="error" role="alert">
          {parseError}
        </p>
      ) : null}
      {reviews.length ? (
        <>
          <table className="preview">
            <thead>
              <tr>
                <th>Row</th>
                <th>Name</th>
                <th>Status</th>
                <th>Check</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.row} className={review.message ? "bad" : undefined}>
                  <td>{review.row}</td>
                  <td>{review.company.name || "—"}</td>
                  <td>{review.company.status || "—"}</td>
                  <td>{review.message || "Ready"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={onImport} disabled={pending || ready === 0}>
            {pending ? "Importing…" : `Import ${ready} ${ready === 1 ? "company" : "companies"}`}
          </button>
        </>
      ) : null}
      {result ? (
        <div>
          <p className="notice" role="status">
            Saved {result.inserted} {result.inserted === 1 ? "company" : "companies"}.
          </p>
          {result.errors.length ? (
            <ul className="company-list">
              {result.errors.map((issue) => (
                <li key={`${issue.row}-${issue.message}`} className="error" role="alert">
                  {issue.row ? `Row ${issue.row}: ` : ""}
                  {issue.message}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

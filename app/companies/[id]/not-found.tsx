import Link from "next/link";

export default function CompanyNotFound() {
  return (
    <main className="shell">
      <h1>That company isn&apos;t on your list</h1>
      <p className="lede">It may belong to another account, or it was already deleted.</p>
      <Link className="button-link" href="/">
        Back to companies
      </Link>
    </main>
  );
}

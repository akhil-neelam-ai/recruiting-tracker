import Link from "next/link";

export default function PersonNotFound() {
  return (
    <main className="shell">
      <h1>That person isn&apos;t on your list</h1>
      <Link className="button-link" href="/people">
        Back to people
      </Link>
    </main>
  );
}

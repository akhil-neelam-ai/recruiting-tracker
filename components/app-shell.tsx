import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/app/actions";

export function AppShell({ email, children }: { email?: string; children: ReactNode }) {
  return (
    <main className="shell">
      <header className="home-bar">
        <p className="brand">
          <Link href="/">Recruiting tracker</Link>
        </p>
        <div className="bar-actions">
          {email ? <span className="who">{email}</span> : null}
          <form action={logout}>
            <button type="submit">Log out</button>
          </form>
        </div>
      </header>
      {children}
    </main>
  );
}

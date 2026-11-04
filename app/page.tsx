import { redirect } from "next/navigation";
import { logout } from "@/app/actions";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  if (!hasSupabaseEnv()) {
    return (
      <main className="home">
        <p className="brand">Recruiting tracker</p>
        <h1>Supabase is not connected yet</h1>
        <p className="lede">
          Copy <code>.env.example</code> to <code>.env.local</code>, add your project URL and
          publishable key, then restart <code>npm run dev</code>.
        </p>
      </main>
    );
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/login");
  }

  const email = data.claims.email ?? "Signed in";

  return (
    <main className="home">
      <header className="home-bar">
        <p className="brand">Recruiting tracker</p>
        <form action={logout}>
          <button type="submit">Log out</button>
        </form>
      </header>
      <h1>You&apos;re signed in</h1>
      <p className="email">{email}</p>
      <p className="quiet">
        This account can see only its own rows. Companies, contacts, and follow-ups come next.
      </p>
    </main>
  );
}

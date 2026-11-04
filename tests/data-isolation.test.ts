import { existsSync, readFileSync } from "node:fs";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, describe, expect, it } from "vitest";

// Loads local env for `npm test` without printing values. Missing keys skip the test.
function loadDotEnv(path: string) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadDotEnv(".env.local");
loadDotEnv(".env");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const configured = Boolean(url && key);

// Given User A has a company and User B is logged in, when B views that company,
// then A's company is not shown. Uses the anon/publishable key, so row-level security applies.
describe.skipIf(!configured)("data isolation", () => {
  const clients: SupabaseClient[] = [];

  afterAll(async () => {
    await Promise.all(clients.map((client) => client.auth.signOut()));
  });

  it("does not show user A's company to user B", async () => {
    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const password = `Test-pass-${suffix}`;
    const emailA = `user-a-${suffix}@example.com`;
    const emailB = `user-b-${suffix}@example.com`;

    const clientA = createClient(url!, key!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const clientB = createClient(url!, key!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    clients.push(clientA, clientB);

    const signA = await clientA.auth.signUp({ email: emailA, password });
    expect(signA.error, signA.error?.message).toBeNull();
    expect(
      signA.data.session,
      "Turn off Confirm email in Supabase so signup returns a session.",
    ).toBeTruthy();

    const signB = await clientB.auth.signUp({ email: emailB, password });
    expect(signB.error, signB.error?.message).toBeNull();
    expect(signB.data.session).toBeTruthy();

    const inserted = await clientA
      .from("companies")
      .insert({
        user_id: signA.data.user!.id,
        name: `Isolation ${suffix}`,
        status: "Researching",
      })
      .select("id")
      .single();
    expect(inserted.error, inserted.error?.message).toBeNull();

    const seenByB = await clientB.from("companies").select("id, name").eq("id", inserted.data!.id);
    expect(seenByB.error, seenByB.error?.message).toBeNull();
    expect(seenByB.data).toEqual([]);

    const seenByA = await clientA.from("companies").select("id").eq("id", inserted.data!.id);
    expect(seenByA.error, seenByA.error?.message).toBeNull();
    expect(seenByA.data).toHaveLength(1);
  });
});

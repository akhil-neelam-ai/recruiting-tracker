import { afterEach, describe, expect, it } from "vitest";
import { supabaseKey } from "../lib/supabase/env";

const keys = ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY"] as const;
const original = Object.fromEntries(keys.map((key) => [key, process.env[key]]));

afterEach(() => {
  for (const key of keys) {
    const value = original[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

describe("supabaseKey", () => {
  it("prefers the publishable key and falls back to the anon key", () => {
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publishable";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon";
    expect(supabaseKey()).toBe("publishable");

    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    expect(supabaseKey()).toBe("anon");
  });
});

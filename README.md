# recruiting-tracker

A recruiting tracker for companies, contacts, interactions, and follow-up reminders, built for UC Berkeley Intro to Code (solo app).

Live app: https://recruitboard.vercel.app

This branch signs a visitor up and logs them in with Supabase email and password. Row-level security keeps each account on its own rows.

## Tools

- Next.js (App Router, TypeScript)
- Supabase (Postgres and email/password auth)
- Vitest
- Vercel. Live app: https://recruitboard.vercel.app

## Run it locally

1. Create a Supabase project.
2. In Authentication → Sign In / Providers, leave Email enabled. For the class demo, turn off **Confirm email** so signup signs you in immediately.
3. Open the SQL editor and run `supabase/migrations/0001_init.sql`. That creates `users` (linked to `auth.users`) and the other tables from `schema.md`, and turns on row-level security (`user_id = auth.uid()`).
4. Copy `.env.example` to `.env.local`. Fill in the project URL and the publishable key (the dashboard may still call it the anon key).
5. Install and start:

```bash
npm install
npm run dev
```

6. Open http://localhost:3000. Logged-out visitors land on `/login`. Create an account at `/signup`. The home page lists your companies. Add one, open it, edit it, and delete it after the "Are you sure?" check. Log out from the header.

## Tests

```bash
npm test
```

The data-isolation test skips until `NEXT_PUBLIC_SUPABASE_URL` and a publishable or anon key are set (in the environment or `.env.local`). With those set, and Confirm email turned off, it signs up User A and User B, adds a company as A, and checks that B cannot see it.

## Deploy on Vercel

1. Import this GitHub repo in Vercel.
2. Set the same two environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
3. Deploy. The SQL migration still has to be applied on the Supabase project those keys point at. Vercel does not run it.

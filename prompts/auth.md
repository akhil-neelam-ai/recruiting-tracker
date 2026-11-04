# prompts/auth.md

Key prompt for Spine 1, sign up and login.

## Prompt

Start the feature loop for the first spine feature only: sign up and login, using Supabase email and password, where each user sees only their own rows (this is the basis for the data-isolation test).

Open a GitHub issue whose body has the user story: "As a job seeker, I want to sign up and log in with email and password, so that only I can see my recruiting data." Include acceptance criteria. Create the branch `feature/auth` from main. If there is no app yet, scaffold Next.js plus the Supabase client on this branch. Add the sign-up, login, and logout pages, middleware that protects routes, a SQL migration for the users table (or a profile linked to auth.users), and RLS policies so that user_id = auth.uid() on user-owned tables, matching schema.md. Add `.env.example` and commit no secrets. If possible, add a Vitest data-isolation test, skipped unless Supabase env vars are set. Save the key prompts in `prompts/auth.md`. Open a PR into main that says "closes #<issue>" and lists setup steps. Do not merge.

## Notes from the build

- Next.js 16 renamed `middleware.ts` to `proxy.ts`. `proxy.ts` is the route guard.
- `users.id` is a uuid foreign key to `auth.users`, so the policy can be `id = auth.uid()`. schema.md describes that same id as text.
- The migration also creates the other tables from schema.md and enables RLS, so the isolation test has a `companies` table to query.
- The isolation test skips when the Supabase URL and key are missing. This environment has no Supabase project, so the test stays skipped.

# prompts/secure-signup-function.md

Key prompt for locking down the sign-up helper.

## Prompt

Go on feature 1 only: the security fix. Pull main. Open an issue with this user story: "As a user, I want the sign-up helper function locked down, so that nobody can call it directly to tamper with accounts." Create the branch `feature/secure-signup-function`. Add a new migration, `supabase/migrations/0002_revoke_handle_new_user.sql`, containing: revoke execute on function public.handle_new_user() from public, anon, authenticated;. Note in the PR that the trigger still runs. Save the key prompt in `prompts/secure-signup-function.md`. Open the PR with "closes #<n>" and do not merge. Do not start validation or any other feature. Do not apply anything to the live Supabase project.

Do not open, edit, or work on any Plan vs. Reality PR or PLAN.md changes. Plan vs. Reality is the final step after all features. Leave PR #10 untouched.

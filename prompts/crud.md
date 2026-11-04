# prompts/crud.md

Key prompt for Spine 3, full CRUD on companies.

## Prompt

Akhil merged PR #6. Next spine feature: Spine 3, full CRUD (this also exercises the Spine 2 tables). Pull main. Open an issue with the user story "As a job seeker, I want to add, view, edit, and delete my applications (and companies), so that I can keep my recruiting pipeline current," plus acceptance criteria: list page, detail page, create and edit forms, and delete with an "are you sure?" confirm, all scoped to the logged-in user via RLS. Create branch `feature/crud`, build it, and save the key prompts in `prompts/crud.md`. Open a PR into main with "closes #<n>". Do not merge, and do not open any other features.

## Notes from the build

- There is no separate applications table in schema.md. A company row is the application in the pipeline (name, website, description, source, status).
- The companies table and its `user_id = auth.uid()` policy already exist from the auth migration. This feature reads and writes that table with the logged-in user's Supabase client. `user_id` is set from the session, not from the form.
- Delete stays hidden until the user clicks Delete, then the page asks "Are you sure?" before the row is removed.

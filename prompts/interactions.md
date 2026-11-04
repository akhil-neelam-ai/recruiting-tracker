# prompts/interactions.md

Key prompt for people and interactions.

## Prompt

`feature/interactions`: log interactions (date, type, notes) on a person, plus people CRUD if it's missing. Use the existing people and interactions tables. Open an issue that pastes the user story verbatim from PLAN.md: "[My feature 1] As a user, I want to add a person (name, email, title, company, how we met, tags) on a company and log an interaction (date, source, summary), so that I remember who I know there and what we talked about." Fetch the latest main before branching. Save the key prompts in prompts/interactions.md. Open a PR into main with "closes #<n>". Do not merge, do not deploy, and do not touch PLAN.md or PR #10.

Type on the form is the interactions.source column (email, linkedin, in-person, zoom). Notes are stored in interactions.summary.

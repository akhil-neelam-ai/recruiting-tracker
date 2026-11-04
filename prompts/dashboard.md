# prompts/dashboard.md

Key prompt for Spine 7, the dashboard.

## Prompt

Build the remaining features back to back. First: `feature/dashboard`. Fetch the latest main before branching. Open an issue that pastes the user story verbatim from PLAN.md: "[Spine 7] As a user, I want a dashboard with one chart and two or three summary stats, so that I can see my pipeline at a glance." Create the branch, build a /dashboard page with one chart (companies by status) and 2–3 stats, including the Applied count, all RLS-scoped. Put the stat calculation in a pure function and add a Vitest test: 3 companies, 1 Applied, and the Applied count = 1. Write it so it can be broken on purpose for a red screenshot. Save the key prompts in prompts/dashboard.md. Open a PR into main with "closes #<n>". Do not merge, do not deploy, and do not touch PLAN.md or PR #10.

PR #18 (search and sort) is merged. If feature/dashboard was branched before that, rebase it onto the latest origin/main. There was no earlier dashboard branch, so this one starts from origin/main after that merge.

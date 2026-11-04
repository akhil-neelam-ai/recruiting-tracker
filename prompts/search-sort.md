# prompts/search-sort.md

Key prompt for Spine 6, search and sort.

## Prompt

PR #16 is merged. Go on Spine 6, search and sort, only. Pull main. Open an issue that pastes the search/filter + sort user story verbatim from PLAN.md: "[Spine 6] As a user, I want to search or filter the company list, including by status, and sort it, so that I can find one quickly." Create branch `feature/search-sort` from main. Build a text search on company name, a status filter dropdown (the six statuses), and a sort control (newest, oldest, name A–Z, and status), driven by URL query params so the view is shareable. It should work alongside the starred view. Keep the queries RLS-scoped. Save the key prompts in `prompts/search-sort.md`. Open a PR into main that describes the changes and says "closes #<n>". Do not merge, do not deploy, don't touch PLAN.md or PR #10, and don't start the next feature.

# prompts/stars.md

Key prompt for Spine 5, stars.

## Prompt

PR #14 is merged. Go on Spine 5, stars, only. Pull main. Open an issue that pastes the stars user story verbatim from PLAN.md: "[Spine 5] As a user, I want to star a company and see a starred view, so that my top targets stay one click away. Every star is one row in a single stars table: this user starred this company." Create the branch `feature/stars` from main. Build a star/unstar toggle on the company list and detail pages, writing only to the existing stars junction table (user_id plus the company id, scoped by RLS). Add a Starred view or filter that lists only the user's starred companies. Add a migration only if a policy or index is truly missing, and call it out. Save the key prompts in `prompts/stars.md`. Open a PR into main that describes the changes and says "closes #<n>". Do not merge, do not deploy, don't touch PLAN.md or PR #10, and don't start the next feature.

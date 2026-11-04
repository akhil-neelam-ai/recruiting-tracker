# prompts/validation.md

Key prompt for Spine 4, validation.

## Prompt

Go on Spine 4, validation, only. Pull main. Open an issue that pastes the validation user story verbatim from PLAN.md: "[Spine 4] As a user, I want a friendly message when a required field is blank, so that I can't save a company with no name." Branch `feature/validation` from main. Build friendly inline errors when required fields are blank or invalid on every form that exists (company create/edit; sign-up/login, for example empty email, bad email format, short or mismatched password; URL format if a website field exists). Validate on the server too and keep user input on error. Save the key prompts in `prompts/validation.md`. Open a PR into main that describes what changed and says "closes #<n>". Do not merge, do not deploy, do not touch PLAN.md or Plan vs. Reality or PR #10 or PR #12, and do not start the next feature.

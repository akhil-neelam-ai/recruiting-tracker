# prompts/website-normalize.md

Key prompt from the stranger test.

## Prompt

The tester typed meta.com and then www.meta.com in the website field and both were rejected. She only got through by typing the full https URL.

In lib/companies.ts, add normalizeWebsite(v). It trims the text and adds https:// when the value doesn't start with http:// or https://. Use it in parseCompanyForm before the isHttpUrl check, and also require a dot in the hostname. Change the error message to "Enter a website, like meta.com." In lib/csv-companies.ts, normalize before validating and save the normalized value. Add tests: meta.com and www.meta.com become https://..., https://meta.com is unchanged, and meta and "not a url" are rejected. Change the placeholder in components/company-form.tsx to meta.com.

Also add the live URL https://recruitboard.vercel.app to the README in this same pull request.

Open an issue with the user story, branch feature/website-normalize from the latest main, save this prompt log, and open a PR with closes #N. Do not merge or deploy.

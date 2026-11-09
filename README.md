# Termfolio

Termfolio is a course fee and budget calculator for students choosing what to take next term. It helps students estimate their payment from quoted fees and compare course combinations against a spending limit before enrolling.

## Run locally

Use Node.js 22.12 or newer with npm and a current browser. The app uses React, JavaScript, Vite, and CSS. npm needs registry access for installation. The running app uses no cloud services, API keys, or accounts.

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. To test and preview the production build, run:

```sh
npm test
npm run build
npm run preview
```

## Try it

Add Math for Rs 12,000 and Computer Science for Rs 15,000. Enter Rs 2,000 registration, a 10% scholarship, and a Rs 25,000 budget. The summary should show Rs 26,300 due and Rs 1,300 over budget.

## Product documents

1. [App roles](docs/app-roles.md)
2. [Jobs to be done](docs/jobs-to-be-done.md)
3. [User stories and acceptance criteria](docs/user-stories.md)

The estimate uses PKR and assumes one registration fee and one scholarship for the term. The scholarship applies to the combined tuition subtotal. Amounts use integer paisa, and a half-paisa deduction rounds up. Up to 20 courses are supported, with Rs 10,000,000 as the maximum per course fee, registration fee, or budget. A blank budget skips the comparison. Drafts are stored on the current browser and can be cleared from the planner.

## Verification

- All five Node tests passed.
- Production smoke checks passed in Microsoft Edge at a 390 px viewport. Checks covered keyboard activation, budget comparisons, fee validation and recovery, rounding, maximum tuition and the course limit, and draft restore, clear, and storage failure.
- Vite reported 226.79 kB of production JavaScript (71.32 kB gzip) and 3.56 kB of CSS (1.43 kB gzip). Production filenames include content hashes. Runtime dependencies are React and React DOM.
- The npm install audit reported zero known vulnerabilities. Course names render as text, and restored drafts are checked before use.

## Publish to Vercel

The [public production deployment](https://touseef-iqbal-calculator.vercel.app) passed the example and browser smoke checks. To redeploy from the project root, run:

```sh
npx vercel login
npx vercel --prod
```

Choose the Vite framework preset if prompted. Use the project root, npm run build as the build command, and dist as the output directory. After publishing, open the production URL and run the example above. [Vercel's Vite guide](https://vercel.com/docs/frameworks/frontend/vite)

## AI use and transcript

OpenAI Codex wrote the code using gpt-6.1-sol, as recorded in the native session metadata. List any manual code edits before submitting. No manual edits by the applicant were reported during implementation.

After the final AI response, copy the original Codex session log into transcripts/ as session-01.jsonl. Check it for passwords, API keys, and tokens before sharing. Preserve everything else as exported. Include the original exports of any additional sessions used for the assignment. Share the source, product documents, and transcripts together. Exclude node_modules, dist, local Vercel metadata, and secrets.



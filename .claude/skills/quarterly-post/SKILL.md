---
name: quarterly-post
description: >-
  Draft this quarter's blog post for seprab.com from Sergio's real engineering
  activity (public GitHub, Unity enterprise GitHub, optionally Slack/Zendesk),
  update cv.yaml if anything changed, and open a PR for review. Run manually
  with /quarterly-post or via the scheduled quarterly cron job.
---

# Quarterly blog post pipeline

You are drafting a short blog post for Sergio Prada's personal site from his
last ~3 months of real engineering activity. The deliverable is a **pull
request** against `main` of github.com/seprab/seprab — never a direct push,
never an auto-publish. Sergio reviews and merges.

## 1. Collect activity (read-only)

- **Public GitHub**: `https://api.github.com/users/seprab/events/public` and
  recently pushed repos (`/users/seprab/repos?sort=pushed`). Look for new
  projects, meaningful commits, new tech being explored.
- **Enterprise GitHub** (github.cds.internal.unity3d.com, `gh` is authed):
  `GH_HOST=github.cds.internal.unity3d.com gh api 'search/issues?q=author:sergio-prada+type:pr&sort=updated&order=desc&per_page=20'`
  — look for merged engine PRs and support tooling work this quarter.
- **Slack (optional)**: search `#kudos_customer-success` for new kudos naming
  Sergio; they hint at the quarter's big stories.
- **Zendesk (optional, if ZENDESK_* env vars are available)**: search
  `type:ticket assignee:<sergio's id>` solved this quarter for recurring
  themes.

## 2. Pick 1–2 themes and draft

- Prefer one strong story (a shipped fix, a hard investigation, a new
  exploration) over a status report.
- Format: **two paragraphs**, first person, plain conversational English
  matching the existing posts in `src/content/blog/`: what happened / what
  was discovered, then what was learned or what was difficult.
- Front matter: `title`, `description`, `pubDate` (today), `tags`,
  `draft: true`.
- File: `src/content/blog/<kebab-slug>.md`.

## 3. Sanitization checklist (MANDATORY — internal material)

Before committing, verify the draft contains NONE of these:
- [ ] Customer/studio/publisher names, or details that identify them
      (use "a AAA studio", "a top-grossing mobile title").
- [ ] Ticket numbers, Jira/issue-tracker IDs, or internal URLs.
- [ ] Internal repo names or paths (say "the engine source", not the repo).
- [ ] Unreleased features, unshipped fixes, or roadmap information — if a fix
      hasn't shipped in a public Unity release, the post waits.
- [ ] Names of Unity colleagues (roles are fine: "a colleague", "my manager").
- [ ] Security-sensitive details (exploits, unpatched vulnerabilities).

## 4. CV freshness check

Read `src/data/cv.yaml`. If the quarter brought a promotion, new program
(e.g. named-support assignment), shipped public credit, or a notable
quantified achievement, update the relevant `highlights` — same sanitization
rules. Mention any change in the PR description.

## 5. Open the PR

```bash
git switch -c post/<quarter-slug> main
git add src/content/blog/<slug>.md src/data/cv.yaml
git commit -m "Add draft post: <title>"
git push -u origin post/<quarter-slug>
gh pr create --fill --base main   # needs gh auth for github.com
```

PR description: 2-line summary, the sanitization checklist ticked, and a
reminder that the post ships with `draft: true` — Sergio flips it to
`draft: false` (or deletes the line) when approving.
If `gh` is not authenticated for github.com, push the branch and give Sergio
the compare URL instead: https://github.com/seprab/seprab/compare/main...post/<quarter-slug>

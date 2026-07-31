# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Sergio Prada's personal website (https://seprab.com), an **Astro** static site deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to **`main`** (the default branch). The old Jekyll site is frozen on the `jekyll` branch; `master`, `theme-update`, and `v2020_flutter` are older still. `public/CNAME` + the repo's Pages settings hold the custom domain.

## Commands

```bash
npm run dev          # dev server; draft posts ARE visible here
npm run build        # static build to dist/ (validates all YAML data via zod)
npm run build:full   # build + regenerate dist/sergio-prada-cv.pdf (needs `npx playwright install chromium` once)
npm run preview      # serve dist/
```

There are no tests or linters; the zod schemas in `src/lib/schemas.ts` are the safety net — malformed YAML data fails the build with a clear error.

## Architecture

- **Data-driven pages**: `src/data/cv.yaml` (experience/education/skills/languages), `kudos.yaml`, and `projects.yaml` are the single source of truth, validated against `src/lib/schemas.ts` and accessed only through `src/lib/data.ts` (typed loaders + `formatYm`/`timelineEntries`/`skillCategoryAverages` helpers). The CV page, career timeline, skills radar SVG, and the downloadable PDF all render from `cv.yaml` — edit the data, never duplicate content into markup.
- **Blog**: content collection defined in `src/content.config.ts`; one `.md` in `src/content/blog/` per post (`title`, `description`, `pubDate`, `tags`, optional `draft`). Index and sitemap are generated — there is no manual post index (RSS was removed deliberately; don't re-add without asking). **`draft: true` posts render in `npm run dev` but are completely excluded from production builds**; approving a post = removing the flag.
- **PDF pipeline**: `scripts/generate-cv-pdf.mjs` prints the chrome-less `/cv-print/` route (which reuses `CvBody.astro`) to `dist/sergio-prada-cv.pdf` via Playwright — run in CI after the build so the "Download PDF" button on `/cv/` always matches the site.
- **Legacy URL redirects**: the old Jekyll `.html` URLs are served by verbatim meta-refresh stubs in `public/pages/**`. They are plain files copied into `dist/` — do not convert them to `astro.config` redirects (those emit directories, breaking `.html`-suffixed paths on Pages).
- **Theming**: light/dark via `data-theme` on `<html>`; an inline script in `BaseLayout.astro` applies the saved/OS theme before paint. All colors are CSS custom properties in `src/styles/global.css`; the radar SVG inherits them, so new UI should use the variables too. Google Analytics tag lives inline in `BaseLayout.astro`.

## Content policy (public site — sanitization is mandatory)

Blog posts and CV highlights may draw on Sergio's internal Unity work only in sanitized form: **no customer/studio names, no ticket or issue-tracker IDs, no internal repo names, no unreleased features, no colleague names** (roles are fine). The full checklist is in `.claude/skills/quarterly-post/SKILL.md`. Sergio reviews everything before it ships (`draft: true` + PR flow).

## Quarterly automation

`.claude/skills/quarterly-post/SKILL.md` defines the pipeline (mine last quarter's GitHub/Slack/Zendesk activity → draft a two-paragraph post → sanitize → PR). It runs manually via `/quarterly-post`, or on a schedule through `scripts/quarterly-post.sh` + the `scripts/com.seprab.quarterly-post.plist` LaunchAgent (installed to `~/Library/LaunchAgents/`, fires 9:07 on the 1st of Jan/Apr/Jul/Oct). Enterprise GitHub access uses `GH_HOST=github.cds.internal.unity3d.com` (authed via `gh`); Zendesk access expects `ZENDESK_API_TOKEN`/`ZENDESK_SUBDOMAIN`/`ZENDESK_USERNAME` in the environment.

# Portfolio Hub Setup Guide (pnpm + Docusaurus + GitHub API)

## Goal

Build a developer portfolio that includes:

- Personal intro / landing page
- Blog posts
- Knowledge base / docs
- Auto-generated projects page from GitHub repos
- pnpm monorepo structure for future scaling

---

## Step 1: Create the Repository

Create a new GitHub repository:

`portfolio`

Clone it locally.

---

## Step 2: Initialize pnpm Workspace

Run:

```bash
pnpm init
```

Create `pnpm-workspace.yaml`

```yaml
packages:
  - apps/*
  - packages/*
```

Recommended structure:

```txt
portfolio/
  apps/
    site/
  packages/
    shared/
  package.json
  pnpm-workspace.yaml
```

---

## Step 3: Create Docusaurus Site

From repo root:

```bash
pnpm create docusaurus@latest apps/site classic typescript
pnpm install
```

Run locally:

```bash
pnpm --filter site start
```

---

## Step 4: Configure Docusaurus as Portfolio

Update homepage to include:

- Name and intro
- Skills / tech stack
- Featured projects
- Blog CTA
- Resume link
- Contact links

Use docs section for:

- React notes
- TypeScript notes
- Testing notes
- System design notes

Use blog section for:

- Learnings
- Tutorials
- Debug stories
- Career posts

---

## Step 5: Create Shared Package (Optional)

Create reusable utilities/components:

```txt
packages/shared/
```

Examples:

- repo fetch helpers
- formatting utils
- UI helpers

---

## Step 6: GitHub API Auto Projects Page

Use GitHub API to fetch repositories.

Preferred filters:

- only public repos
- exclude forks
- sort by updated date
- include repos with topic `portfolio`

Endpoint example:

```txt
https://api.github.com/users/YOUR_USERNAME/repos
```

Better search endpoint:

```txt
https://api.github.com/search/repositories?q=user:YOUR_USERNAME+topic:portfolio
```

---

## Step 7: Generate Projects Data During Build

Create script:

```txt
apps/site/scripts/fetch-projects.ts
```

Responsibilities:

1. Call GitHub API
2. Map repo data:
   - name
   - description
   - stars
   - language
   - homepage
   - html_url
   - updated_at

3. Save JSON file:

```txt
apps/site/src/data/projects.json
```

---

## Step 8: Render Projects Page in Docusaurus

Create page:

```txt
apps/site/src/pages/projects.tsx
```

Load `projects.json` and render cards.

Each card should show:

- Project name
- Description
- Stack
- GitHub link
- Live demo link (if exists)
- Last updated date

---

## Step 9: Add Build Scripts

Root `package.json`

```json
{
  "scripts": {
    "dev": "pnpm --filter site start",
    "build": "pnpm --filter site build",
    "projects:sync": "pnpm --filter site tsx scripts/fetch-projects.ts",
    "prebuild": "pnpm run projects:sync"
  }
}
```

---

## Step 10: Add GitHub Token

Create `.env`:

```txt
GITHUB_TOKEN=your_token_here
```

Use token for higher rate limits.

Never commit `.env`.

---

## Step 11: Deploy

Recommended:

- Vercel
- Netlify
- GitHub Pages

Build command:

```bash
pnpm install && pnpm build
```

---

## Step 12: GitHub Topics Workflow

For every project repo, add topics:

```txt
portfolio
featured
react
typescript
nodejs
```

Then only tagged repos appear automatically.

---

## Step 13: Content Growth Plan

Keep adding:

- micro projects
  n- blog posts weekly
- docs notes
- experiments
- code snippets

---

## Recommended Final Structure

```txt
portfolio/
  apps/
    site/
      blog/
      docs/
      src/pages/
      src/data/projects.json
      scripts/fetch-projects.ts
  packages/
    shared/
  package.json
  pnpm-workspace.yaml
```

---

## Copilot Build Request

Use this prompt:

```txt
Create a pnpm monorepo portfolio repo with Docusaurus in apps/site. Add a TypeScript script that fetches my GitHub repositories using GitHub API filtered by topic portfolio and generates src/data/projects.json. Build a projects page that renders responsive cards. Add root scripts for dev, build, and prebuild sync. Use clean production-ready code.
```

---

## Nice Future Additions

- search projects
- dark mode custom theme
- analytics
- RSS feed
- sitemap
- project screenshots
- featured repo badges
- resume download
- contact form

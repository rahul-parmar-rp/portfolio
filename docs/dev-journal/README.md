# Dev Journal (Docusaurus)

This site is built with Docusaurus and lives inside the `portfolio` repository.

## Plan: Host On GitHub Pages

1. Update Docusaurus site config for this GitHub repo.
2. Build the site from `docs/dev-journal`.
3. Deploy the generated static output to GitHub Pages (`gh-pages` branch).
4. Turn on GitHub Pages in the repo settings.
5. Verify the published URL and fix links/assets if needed.

## Steps

### 1) Update Docusaurus config

In `docusaurus.config.ts`, set values for `rahul-parmar-rp/portfolio`:

- `url: "https://rahul-parmar-rp.github.io"`
- `baseUrl: "/portfolio/"`
- `organizationName: "rahul-parmar-rp"`
- `projectName: "portfolio"`
- Optional but recommended: `deploymentBranch: "gh-pages"`

Note:

- If you later move docs to a dedicated repo like `dev-journal`, set `baseUrl: "/"` and `projectName` to that repo name.

### 2) Install dependencies

From repo root:

```bash
pnpm install
```

Or from this folder:

```bash
pnpm install
```

### 3) Test locally

From repo root:

```bash
pnpm docs:dev
```

From this folder:

```bash
pnpm start
```

### 4) Build the static site

From repo root:

```bash
pnpm docs:build
```

From this folder:

```bash
pnpm build
```

### 5) Deploy to GitHub Pages

From this folder (`docs/dev-journal`):

```bash
GIT_USER=rahul-parmar-rp pnpm deploy
```

This publishes to the `gh-pages` branch.

### 6) Enable Pages in GitHub

In GitHub repo settings for `rahul-parmar-rp/portfolio`:

1. Open Settings -> Pages
2. Source: `Deploy from a branch`
3. Branch: `gh-pages` and folder `/ (root)`
4. Save

### 7) Verify published URL

Expected URL:

`https://rahul-parmar-rp.github.io/portfolio/`

## Quick Commands

From repo root:

```bash
pnpm docs:dev
pnpm docs:build
pnpm docs:serve
```

From this folder:

```bash
pnpm start
pnpm build
pnpm serve
pnpm deploy
```

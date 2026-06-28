# Dev Journal Docusaurus Plan

## Goal

Create a standalone Docusaurus site in `docs/dev-journal` for journal-style writing, structured notes, and optional docs pages, without mixing it into the root Next.js app.

## Recommended Starter

Use the Docusaurus `classic` template with TypeScript.

Command:

```bash
pnpm create docusaurus@latest docs/dev-journal classic --typescript
```

## Why `classic`

The `classic` template gives you:

- `docs/` for structured documentation
- `blog/` for dated journal posts
- `src/pages/` for custom pages
- a working navbar, footer, and config
- a standard Docusaurus layout that is easy to extend

This fits a dev journal better than a minimal bootstrap-style scaffold.

## Planned Repo Placement

```text
portfolio/
  src/app/                 # main Next.js app
  docs/
    dev-journal/           # standalone Docusaurus app
  workspace/
    mobile/
    tooling/
    external/
```

## Planned Docusaurus Structure

After scaffolding, `docs/dev-journal` will look roughly like this:

```text
docs/dev-journal/
  blog/
  docs/
  src/
    css/
    pages/
  static/
  docusaurus.config.ts
  sidebars.ts
  package.json
  tsconfig.json
  README.md
```

## Content Model

Use these sections:

- `blog/`
  For dated development journal entries, experiments, and weekly logs.
- `docs/`
  For evergreen notes, tutorials, references, and categorized technical writeups.
- `src/pages/`
  For custom landing pages such as a Dev Journal homepage, about page, or tag index.

## Package Management

Initial recommendation:

- Keep the root Next.js app as the main app.
- Keep `docs/dev-journal` as a standalone project managed with pnpm from its own folder.
- Do not add it to a root pnpm workspace until you actually want shared install/build workflows.

Possible later phase:

- Add a root `pnpm-workspace.yaml`
- Include `docs/dev-journal` and any other intentionally managed subprojects

## Styling Direction

Suggested direction for the dev journal:

- keep the default Docusaurus structure initially
- apply minimal theme customization first
- add custom branding only after content structure is stable

## Integration Choices

There are three reasonable ways to use this site:

1. Separate app
   Run and deploy `docs/dev-journal` independently.
2. Linked from main site
   Keep it separate, but link to it from the Next.js portfolio.
3. Later reverse proxy / subpath setup
   More complex; only worth it if you want one unified domain experience.

Recommended now:

- separate project
- linked from the main portfolio later

## Step-by-Step Plan

1. Scaffold Docusaurus in `docs/dev-journal` using `classic --typescript`.
2. Run it locally from that folder and verify the starter works.
3. Trim default example docs and blog posts.
4. Create the initial information architecture:
   - journal posts
   - notes
   - experiments
   - references
5. Add lightweight branding and navigation.
6. Decide later whether to keep it standalone or bring it into a root workspace.

## Open Decisions

Before scaffolding, confirm these choices:

- site name: `Dev Journal` or a custom title
- base purpose: mostly blog, mostly docs, or both
- deployment style: standalone site or linked secondary site
- whether the starter example content should be removed immediately after generation

## Recommendation

Use Docusaurus as a separate app inside `docs/dev-journal`, starting with `classic --typescript`, and keep it independent from the root Next.js app for now.

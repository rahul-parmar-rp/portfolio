AGENTS.md

---

description: include this instructions file in the request context to ensure that the agent does not provide explanations or summaries of code changes, edits, or implementations. The agent will only return code edits with no commentary or summaries to save output tokens. If no changes are required, the agent will respond only with "No changes needed."

# Copilot Instructions

- save cost by saving output tokens by not providing explanations or summaries of code changes, edits, or implementations.
- Do not explain code changes or implementation.
- Do not summarize edits.
- Do not include reasoning.
- Keep responses minimal.
- If no changes are required, respond only: "No changes needed."
- Assume explanations are not needed. If I want to understand the changes, I'll ask a follow-up question. Until then, return only the code edits with no commentary or summaries.

Purpose

- Short, machine-readable instructions to help AI coding agents become productive in this repository.
- Minimal guidance: what to run, where to look, and notable project conventions or pitfalls.

Quick commands (use pnpm)

- Start app dev server: pnpm dev
- Build app: pnpm build
- Start docs dev (Docusaurus): pnpm docs:dev
- Build docs site: pnpm docs:build
- Typecheck: pnpm typecheck (runs tsc --noEmit)
- Lint: pnpm lint
- Run docs typecheck: pnpm docs:typecheck

Where to look (high-value entry points)

- Root app (Next.js + TypeScript): README.md and src/
- Docs site (dev-journal): docs/dev-journal/ (source for the Docusaurus site)
- Interactive demo components: docs/dev-journal/src/components/ (NoCloudAI.tsx)
- Local repo snapshot: repos.json (root) and rename script rename-repos.js
- Utility scripts & tools: tools/ and setup.sh
- Git submodules: workspace/git-submodules-example-repo/ (use package.json scripts for submodule workflows)

Project conventions and gotchas

- Package manager: pnpm (packageManager pinned in package.json). Use pnpm for installs and scripts.
- Module type: package.json has "type": "module" — Node scripts are ESM by default. If a script uses require() rename to .cjs or convert to import syntax.
- TypeScript: repository is type-checked (tsc --noEmit). Prefer preserving existing TS types and run typecheck before builds (prebuild hook).
- Docs site: separate workspace at docs/dev-journal; it has its own package.json and build/dev scripts (use pnpm --dir docs/dev-journal ... where needed).
- Large browser bundles: components that import heavy ML runtimes (e.g. @xenova/transformers) should be loaded dynamically to avoid blowing up client bundles. Prefer dynamic import() and only load on user interaction.
- In-browser LLM demo: see docs/dev-journal/src/components/NoCloudAI.tsx. Model assets are not included; offline demos require bundling model files for GitHub Pages—do not call external cloud APIs.
- repos.json: local export of GitHub repos. Scripts expect valid JSON. When writing Node scripts that read repos.json in ESM mode use import() or fs.readFile + JSON.parse.
- Git submodules: workflows exist in package.json (submodule:\*). Use git submodule update --init --recursive for initialization; there are helper npm scripts.

How the agent should behave

- Link, don't embed: reference existing documentation (docs/, README.md) rather than copying entire docs into AGENTS.md.
- Minimal changes by default: if making edits, prefer a small, well-tested patch and run typecheck + lint.
- When adding dependencies, update package.json and run pnpm install; prefer devDependencies for build-only tools.
- For Node scripts: respect "type": "module" or use .cjs for CommonJS.

Helpful links in repo

- Root README: ./README.md
- Docs/dev-journal README: ./docs/dev-journal/README.md
- NoCloudAI demo: ./docs/dev-journal/src/components/NoCloudAI.tsx
- repos.json and rename script: ./repos.json, ./rename-repos.js

If unsure, ask

- If a change may affect build or CI, ask for confirmation before making large edits.

--
Generated to help automated coding agents quickly understand how to work in this repository. Keep this file short; prefer adding specialized agent skill files for larger automation tasks.

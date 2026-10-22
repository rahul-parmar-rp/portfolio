# Project Cleanup & Refactor Plan

A checklist to make this repo look structured and intentional. Grouped by
priority. Commands assume you run them from the repo root.

> Tip: do each group as its own commit so it's easy to review/revert.

---

## 0. Decide the repo's story (from PLAN.md)

Two surfaces, kept separate:

- **Next.js app** (`src/`) → portfolio, CV, curated blog posts.
- **Docusaurus site** (`docs/dev-journal/`) → community docs, ideas, POCs.

Everything below serves that split. Loose notes should live inside the
Docusaurus `docs/` tree, not scattered at the repo root.

---

## 1. Security & tracked-artifact cleanup (do first)

### 1.1 `.env` is committed — untrack it

It's currently empty, so no secret leaked, but it should never be tracked.

```bash
git rm --cached .env
echo ".env" >> .gitignore   # already present, keep it
git commit -m "chore: stop tracking .env"
```

Keep `.env.example` as the tracked template.

### 1.2 Build artifact `tsconfig.tsbuildinfo` is tracked

```bash
git rm --cached tsconfig.tsbuildinfo
printf "\n# ts incremental build cache\ntsconfig.tsbuildinfo\n*.tsbuildinfo\n" >> .gitignore
git commit -m "chore: ignore tsconfig.tsbuildinfo"
```

### 1.3 AI-tool skill folders are committed despite `.gitignore`

`.gitignore` has `.agents/` but the files were committed **before** the rule
was added, so the rule is ignored for them. There are FOUR copies of the same
skills:

- `.agents/skills/` ← the real files (source of truth)
- `.agent/skills/`, `.codex/skills/`, `.gemini/skills/`, `.github/skills/`
  ← symlinks pointing back to `.agents/skills/`

Decide one of two options:

**Option A — stop tracking all agent skill dirs (recommended).**
They are local tooling, not part of the published site.

```bash
git rm -r --cached .agent .agents .codex .gemini .github/skills
cat >> .gitignore <<'EOF'

# AI agent tooling (local only)
.agent/
.agents/
.codex/
.gemini/
.github/skills/
EOF
git commit -m "chore: untrack local AI agent skill folders"
```

**Option B — keep only `.agents/` tracked, drop the symlink copies.**

```bash
git rm -r --cached .agent .codex .gemini .github/skills
# remove the ".agents/" line from .gitignore so it stays tracked
git commit -m "chore: keep single .agents skills dir, untrack duplicates"
```

Keep `.github/workflows/`, `.github/instructions/`, `.github/dependabot.yml` —
those are real CI/config, not duplicated skills.

### 1.4 Other AI chat history clutter (already ignored, just delete locally)

`.aider.chat.history.md`, `.aider.input.history`, `.aider.tags.cache.v4` are
covered by `.aider*` in `.gitignore`. Safe to delete from disk:

```bash
rm -f .aider.chat.history.md .aider.input.history .aider.tags.cache.v4
```

---

## 2. Consolidate scattered docs

Loose `.md`/`.html` files sit at the repo root and in `docs/` (not the
Docusaurus tree). They duplicate the idea of "notes/ideas."

### 2.1 Root-level planning docs

- `PLAN.md` → keep (repo setup/decision record).
- `PROJECT_PORTFOLIO_DECISION.md` → merge into `PLAN.md` or keep one, delete
  the other to avoid two "decision" files.
- `CLEANUP.md` (this file) → keep until done, then delete.

### 2.2 `docs/*.md|*.html` (NOT the Docusaurus site)

These are drafts (`browser-navigation-blog.md`, `git-rebase.md`,
`vitest-tests.md`, `index.html`, etc.). Pick one home:

- Publishable → move into `docs/dev-journal/docs/` (or `/blog/`).
- Raw scratch → move into a single `drafts/` folder (gitignored if private).

```bash
mkdir -p docs/dev-journal/docs/notes
git mv docs/vitest-tests.md docs/dev-journal/docs/notes/vitest-tests.md
# ...repeat for the ones worth publishing
```

### 2.3 `plans/` folder

The `android-utility-app-offline-otp-shield-*.md` files are a multi-part plan.
Move under the Docusaurus app-ideas tree so they show up on the site:

```bash
git mv plans docs/dev-journal/docs/app-ideas/otp-shield-plan
```

### 2.4 `docs/micro-sites/` HTML demos

Standalone HTML prototypes. Either:

- publish via Docusaurus `static/` so they get URLs, or
- move to `workspace/projects/` with the other POCs.

---

## 3. Root-level scripts & data

- `rename-repos.mjs`, `rename-repos-create-json.js` → two scripts doing similar
  work. Keep one (`.mjs`, since `"type": "module"`), delete the `.js`.
- `repos.json` → generated data; consider moving to `src/data/repos.json` and
  regenerating via a script (matches PLAN.md Step 7).
- `test-tweets.csv` → move under `tools/twitter-poster/` next to its scripts.
- `setup.sh` → fine at root; reference it from README.

```bash
mkdir -p tools/twitter-poster
git mv test-tweets.csv tools/twitter-poster/test-tweets.csv
git rm rename-repos-create-json.js   # keep rename-repos.mjs
```

---

## 4. Structure polish

- Move `lib/` (`ollama.ts`, `twitter.ts`) under `src/lib/` so all app code is in
  `src/`, OR document why it's top-level (shared across app + tools).
- Add a short `docs/dev-journal/docs/notes/_category_.json` if you create the
  notes folder, so the sidebar label is clean.
- Ensure every `app-ideas/*.md` has front-matter (`title`, `sidebar_label`) for
  consistent sidebar rendering.

---

## 5. Final verification

```bash
pnpm typecheck && pnpm lint
pnpm docs:typecheck
pnpm build          # optional, full prod build
git status          # should be clean of stray artifacts
```

---

## Cleanup summary table

| Item                            | Action                        | Priority |
| ------------------------------- | ----------------------------- | -------- |
| `.env` tracked                  | `git rm --cached`             | High     |
| `tsconfig.tsbuildinfo` tracked  | untrack + ignore              | High     |
| `.agent/.agents/.codex/.gemini` | untrack (Option A/B)          | High     |
| `.github/skills` symlinks       | untrack                       | High     |
| `.aider*` history               | delete locally                | Low      |
| duplicate decision docs         | merge into one                | Medium   |
| `docs/*.md/html` scratch        | move to dev-journal or drafts | Medium   |
| `plans/`                        | move to app-ideas             | Medium   |
| `rename-repos-create-json.js`   | delete (keep `.mjs`)          | Medium   |
| `repos.json`, `test-tweets.csv` | relocate                      | Low      |
| `lib/` placement                | move to `src/lib` or document | Low      |

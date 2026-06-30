# Portfolio Workspace Decision

Date: 2026-07-01
Owner: Rahul

## Final Decision

Keep this repository as the main workspace hub.

- Main app remains Next.js.
- Dev Journal remains Docusaurus inside this repo.
- Use submodules only for active projects.
- Keep reference-only repos in a registry list, not as submodules.

## Why This Decision

- Faster laptop setup with one main clone.
- Better focus on real outcomes instead of maintaining every old repo.
- Lower Git complexity than adding all repos as submodules.
- Keeps experimentation possible without losing control.

## Submodule Policy

Add as submodule only if the project is:

1. Active now (weekly or biweekly use), or
2. Revenue-relevant, or
3. Needed for current roadmap execution.

Do not add as submodule if it is only archival/reference.

## Old Repo Policy (2015 to 2019 and beyond)

Do not fix every old project.

Use this triage for each repository:

1. Needed for income, product, or current quarter learning goal?
2. Can become demo-ready in 1 to 3 days?
3. Stack still viable (not heavily deprecated)?
4. Strong portfolio signal (shows unique strength)?

Decision rule:

- Yes to 3 to 4: Keep and modernize.
- Yes to 1 to 2: Freeze and document.
- Yes to 0: Archive.

## Time Allocation Rule

- 70%: Real needed projects.
- 20%: Cool high-signal experiments.
- 10%: Maintenance and archival cleanup.

## Workspace Buckets

Create and maintain these buckets:

- Active
- Maybe Later
- Archive

Each repo should have a status note with:

- Last checked date
- Build status
- Next action
- Keep, Freeze, or Archive

## Execution Checklist

1. Keep only high-value submodules active.
2. Add all other repos to a reference registry file.
3. Use one setup command for new laptop restore:
   - clone main repo
   - init active submodules
   - install only selected project dependencies
4. Review and rebalance buckets once per month.

## Success Criteria

- New laptop ready quickly without manual chaos.
- Active projects always build and move forward.
- No time wasted reviving low-value legacy repos.
- Portfolio quality improves with fewer, stronger projects.

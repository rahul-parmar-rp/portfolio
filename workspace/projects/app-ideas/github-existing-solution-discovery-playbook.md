# Draft Plan: GitHub Existing-Solution Discovery Playbook

## Idea Summary

A repeatable method to find existing GitHub solutions for almost any requirement quickly and reliably.

## Short Answer

You can use **12 practical ways** to discover existing solutions on GitHub most of the time.

## 12 Ways to Find Existing Solutions on GitHub

1. Keyword search with filters (`stars`, `language`, `pushed`)
2. Exact phrase search for architecture terms
3. Search by package names from npm/pypi crates
4. Search in README only (problem statements and setup)
5. Search in `topics` and tags
6. Search by filename patterns (`docker-compose.yml`, `cli.ts`, `workflow.yml`)
7. Search in GitHub Actions marketplace repos for workflow patterns
8. Search forks of popular repos for customized implementations
9. Search issues/PRs for solved edge cases
10. Search code by API endpoint names and SDK method names
11. Search with "awesome-\*" curated lists and ecosystem indexes
12. Use Copilot Chat prompts over selected repos to summarize implementation fit

## Practical Query Templates

- `"<problem phrase>" language:TypeScript stars:>100 pushed:>2025-01-01`
- `"<api name>" "rate limit" "retry" language:JavaScript`
- `"<workflow goal>" path:.github/workflows extension:yml`
- `"<feature>" filename:README.md`

## Evaluation Scorecard (Fast)

Score each candidate 1 to 5 on:

- Recency of commits
- Test coverage or CI presence
- Clarity of docs and setup
- Architecture fit for your stack
- License compatibility
- Open issue quality and maintainer responsiveness

## Copilot-Assisted Research Flow

1. Define requirement in one sentence
2. Run 3 to 5 targeted GitHub queries
3. Shortlist top 10 repositories
4. Ask Copilot to summarize each repo's fit, tradeoffs, and risks
5. Keep top 3 for proof-of-concept benchmark

## MVP Deliverable

- one markdown report with:
  - search queries used
  - repo shortlist
  - scorecard table
  - final recommendation with fallback options

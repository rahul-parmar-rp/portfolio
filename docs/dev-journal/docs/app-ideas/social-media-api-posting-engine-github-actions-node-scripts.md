# Draft Plan: Social Media API Posting Engine (GitHub Actions + Node Scripts)

## Idea Summary

Build one posting engine that can publish to major social platforms from a shared queue using either:

- GitHub Actions scheduled workflows
- Node.js cron scripts on a server

Start with famous platforms first: X/Twitter, Instagram, LinkedIn, YouTube, Facebook Pages.

## Problem

Most creators and small teams run separate manual workflows per platform, causing inconsistent posting and poor iteration speed.

## Core MVP

- Unified post schema (`text`, `mediaUrl`, `tags`, `platformTargets`, `publishAt`)
- Provider adapters for:
  - X/Twitter API
  - Instagram Graph API (Business account)
  - LinkedIn API
  - YouTube Data API (short text + video metadata flow)
  - Facebook Graph API (Pages)
- Retry queue with rate-limit aware backoff
- Dry-run mode and preview logs

## Two Implementation Modes

### Mode A: GitHub Actions

- Schedule with cron in `.github/workflows/posting-engine.yml`
- Pull pending posts from JSON, CSV, or Google Sheet mirror
- Run `node scripts/posting-engine.js`
- Save run logs as artifacts

Best when:

- You want low ops
- Posting frequency is moderate
- You already manage content in GitHub

### Mode B: Node Script Scheduler

- Run on VPS or container (`node-cron` or Bull queue)
- Web dashboard for pending posts
- Better for high frequency and advanced retries

Best when:

- You want real-time controls
- You need robust retries/webhooks
- You plan multi-account scaling

## Suggested Tech Stack

- Runtime: Node.js + TypeScript
- Queue: BullMQ (Redis) or simple SQLite queue for MVP
- Secrets: GitHub Secrets or `.env`
- Storage: SQLite/Postgres + object storage for media cache
- Observability: structured JSON logs + daily summary report

## Security and Compliance

- Encrypt tokens at rest
- Token refresh workers per platform
- Per-platform policy checks before publishing
- Human approval state (`draft -> approved -> scheduled -> published`)

## Milestones

1. Build core queue and provider interface
2. Implement X + Instagram first
3. Add LinkedIn + Facebook
4. Add YouTube and analytics summary

## MVP Success Metrics

- 95% successful publishes without manual retry
- Under 10 minutes from content draft to scheduled publish
- Single content item published to 3+ platforms from one workflow

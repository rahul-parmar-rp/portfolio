# Draft Plan: Twitter Posting Using Central Google Spreadsheet

## Idea Summary

Use a Google Spreadsheet as a central content queue to schedule and publish Twitter posts reliably.

## Problem

Teams need a simple shared workflow for content planning without a heavy CMS.

## Core MVP

- Google Sheet as source of truth
- Status columns for draft, approved, scheduled, posted
- Automated scheduler reads pending rows
- Post result logging back into sheet

## Key Columns

- Post text
- Media URL
- Scheduled time
- Hashtags
- Status
- Error details

## Web MVP (built)

A client-side content queue tool in the Docusaurus dev-journal:

- Paste a Google Sheets CSV (published-to-web link) or raw CSV
- Parses standard columns into an editable queue
- Per-row validation: 280-char limit, schedule time, status
- Status pipeline: draft -> approved -> scheduled -> posted
- Persists to `localStorage` (offline-friendly)
- Exports a clean CSV / JSON payload for `lib/twitter.ts` or a GitHub Action

No API keys live in the browser. The tool prepares and validates the queue;
actual posting is done by the existing Node publisher (`lib/twitter.ts`).

- Page: `/tools/tweet-queue`
- Component: `docs/dev-journal/src/components/tweet-queue/`

## Milestones

1. Sheet schema and validation rules (done: CSV parse + validation)
2. Publisher service and retry logic (existing `lib/twitter.ts`)
3. Approval and audit trail (done: status pipeline in queue UI)
4. Analytics integration

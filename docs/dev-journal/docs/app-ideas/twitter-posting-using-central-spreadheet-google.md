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

## Milestones

1. Sheet schema and validation rules
2. Publisher service and retry logic
3. Approval and audit trail
4. Analytics integration

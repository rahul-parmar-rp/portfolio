---
title: URL-Driven Product Fetching With Search Params
description: Notes recovered from an implementation transcript about driving product API requests from URL search parameters to support browser back and forward navigation.
sidebar_position: 3
slug: /frontend/url-driven-product-fetching-with-search-params
---

This page reconstructs the useful engineering content from a mixed transcript note.

## Goal

Make product fetching react to URL search parameter changes so browser back and forward navigation update the UI correctly.

## Existing Shape In The Source Conversation

The original codebase already had three useful pieces:

- a `use-products` hook
- a URL synchronization helper
- a history synchronization hook for browser navigation

The implementation direction was not to throw that structure away, but to make API calls more directly driven by the URL state.

## Practical Pattern

1. Read current filters, sorting, and pagination from search params.
2. Trigger product fetching when those search params change.
3. Keep browser back and forward navigation wired into the same state update path.
4. Avoid direct render-time URL mutation loops.

## Why `useSearchParams` Helps

In Next.js App Router, `useSearchParams` gives you a framework-aware signal that the URL changed. That is usually a better trigger for request state than ad hoc reads of `window.location.search` during render.

## Architecture Rule

Do not maintain two unrelated sources of truth:

- one in React state
- one in the URL

Instead, decide which state is authoritative and derive the rest consistently. For filterable product lists, the URL is often the right external source of truth.

## Key Failure Modes To Avoid

- API calls only on mount, ignoring later browser navigation
- effects that both read from and write to the URL without loop protection
- URL mutations during initial hydration in Next.js App Router
- unstable callback dependencies causing repeated fetches

## Recommended Outcome

Use search params as the driver for request state, then layer browser-navigation handling and URL synchronization on top of that model instead of beside it.

## Related Docs

- `/frontend/history-replace-state-nextjs`
- `/blog/2026/05/28/browser-navigation-react-apps`

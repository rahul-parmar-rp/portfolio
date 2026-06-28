---
title: Resources
description: Staging page for tools, demos, and documents that are still outside the Docusaurus migration.
sidebar_position: 99
slug: /resources
---

This page tracks content that still lives outside the Docusaurus docs structure.

All files under `docs/micro-sites` now have a canonical destination inside Dev Journal.

The HTML demos that originally lived there now render as interactive MDX pages instead of guide-only migration notes.

## Micro-Site Migration Map

Canonical destinations for the original `docs/micro-sites` files:

- `docs/micro-sites/android-xml-xpath-validator.html` -> interactive page `/tools/android-xml-xpath-validator`
- `docs/micro-sites/gmail-send-guide.md` and `docs/micro-sites/gmail-send.html` -> interactive page `/google/gmail-send-multi-account`
- `docs/micro-sites/google-identity-services-guide.md` and `docs/micro-sites/google-identity-services-demo.html` -> interactive page `/google/google-identity-services-demo`
- `docs/micro-sites/google-multi-account-manager-guide.md` and `docs/micro-sites/google-multi-account-manager.html` -> interactive page `/google/google-multi-account-manager`
- `docs/micro-sites/google-multi-account-manager copy.html` -> interactive legacy variant `/google/google-multi-account-manager-legacy-copy`
- `docs/micro-sites/google-photos-library-docs.md` -> `/google/google-photos-api-notes`
- `docs/micro-sites/google-sign-in.html` -> interactive legacy reconstruction `/google/google-sign-in-legacy`
- `docs/micro-sites/offline-image-organizer-guide.md` and `docs/micro-sites/offline-image-organizer.html` -> interactive page `/tools/offline-image-organizer`
- `docs/micro-sites/simple-google-auth-guide.md` and `docs/micro-sites/simple-google-auth.html` -> interactive page `/google/simple-google-auth`

## Other Documents Already Migrated

- `docs/browser-navigation-blog.md` -> blog post `/blog/2026/05/28/browser-navigation-react-apps`
- `docs/git-commands-reference.mdx` -> `/git/commands-reference`
- `docs/git-rebase-change-authors.md` -> `/git/rebase-change-authors`
- `docs/git-rebase.md` -> `/frontend/url-driven-product-fetching-with-search-params`
- `docs/helpful-links.md` and `docs/helpful-tools.md` -> `/resources/helpful-links-and-tools`
- `docs/history-replace-state-behaves-weirdly-with-nextjs.md` -> `/frontend/history-replace-state-nextjs`
- `docs/hydration-issues-react-nested-tags.md` -> `/frontend/hydration-nested-tags`
- `docs/social-automation.md` -> `/social/social-automation`
- `docs/twitter-poster-with-auto-ai.md` -> `/social/twitter-poster-ai-mvp-spec`
- `docs/technical-challenges-and-ideas.md` -> `/tooling/eslint-rules-for-new-files`
- `docs/vscode-tips-and-tricks.md` -> `/tooling/vscode-tips-and-tricks`
- `docs/next-router-client-side-vs-history-api.md` -> folded into `/frontend/history-replace-state-nextjs`
- `docs/vitest-tests.md` -> `/testing/vitest-tests`

## Standalone HTML Still Outside Dev Journal

These are not part of the `docs/micro-sites` set and still remain outside the Docusaurus structure for now:

- `docs/hydration-issue-checker-using-dom-nested-links-buttons.html`
- `docs/index.html`

## Remaining Documents To Classify

No remaining Markdown source files are outside Dev Journal.

No remaining `docs/micro-sites` files are without a Dev Journal destination.

## Migration Rule

- evergreen technical reference content belongs in docs
- dated write-ups and evolving project notes belong in the blog
- duplicate or placeholder micro-site files should be consolidated into one canonical doc page

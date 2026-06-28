---
title: Google Photos API Notes
description: Notes on Google Photos authorization scopes, post-2025 API restrictions, and the difference between the Picker API and the Library API.
sidebar_position: 4
slug: /google/google-photos-api-notes
---

This page consolidates the standalone Google Photos notes that were previously living outside Dev Journal.

## Main Change To Remember

After the 2025 Google Photos API changes, some older Library API scopes and access patterns became much more limited.

The practical impact is simple:

- full-library assumptions are no longer safe for new app designs
- app-created content has clearer support
- the Picker API is the better fit when the user selects existing photos manually

## OAuth Basics

All Google Photos API requests must use OAuth 2.0 with a user-granted access token.

Service accounts are not supported for these user-library flows.

## Key Scope Groups

### Picker API

```text
https://www.googleapis.com/auth/photospicker.mediaitems.readonly
```

Use this when the user should explicitly pick photos in Google's UI.

### Library API

Useful app-created-data scopes include:

```text
https://www.googleapis.com/auth/photoslibrary.appendonly
https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata
https://www.googleapis.com/auth/photoslibrary.edit.appcreateddata
```

Broad legacy library scopes should be treated carefully and checked against current Google policy before relying on them.

## Resource Model Reference

### Album operations

- list app-created albums
- get album details
- create albums
- patch album metadata
- batch add or remove app-created media items

### Media item operations

- list app-created media items
- get one or many items
- search app-created media items
- batch create uploads
- patch app-created metadata

## Selection Guidance

### Use Picker API when:

- the user is selecting existing photos
- you want the least contentious permission story
- you do not need silent full-library traversal

### Use Library API when:

- your app creates and manages its own albums or media
- your workflow is centered on app-created content
- you can stay within the newer scope boundaries

## Best Practice

- request the narrowest scope possible
- add scopes incrementally when the user reaches a feature that needs them
- explain clearly why each permission is needed
- assume scope and review policy may evolve over time

## Related Docs

- `/google/google-multi-account-manager`
- `/tools/offline-image-organizer`

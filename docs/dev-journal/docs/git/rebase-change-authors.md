---
title: Change Git Authors And Fix Auth Issues
description: Practical notes for handling multiple GitHub accounts, rewriting commit history, and safely force-pushing corrected authorship.
sidebar_position: 2
slug: /git/rebase-change-authors
---

## Problem

A common push failure looks like this:

```text
ERROR: Permission to rahul-parmar-rp/portfolio.git denied to rahul-parmar-bsh.
```

The root cause is usually that Git is authenticating as one account while the repository belongs to another.

## Cleanest Simple Setup

If you do not want multiple SSH keys:

- use SSH for work repositories
- use HTTPS for personal repositories

Change the remote:

```bash
git remote add origin https://github.com/<username>/<repo>.git
```

Push normally and use a personal access token when prompted.

## Rewriting Commit Author Email

Recommended tool:

```bash
brew install git-filter-repo
```

Rewrite author and committer details:

```bash
git filter-repo --force --commit-callback '
if commit.author_email == b"old-email@example.com":
    commit.author_name = b"Your Name"
    commit.author_email = b"new-email@example.com"
if commit.committer_email == b"old-email@example.com":
    commit.committer_name = b"Your Name"
    commit.committer_email = b"new-email@example.com"
'
```

## Why `origin` Disappears

`git filter-repo` removes the remote on purpose to prevent an accidental force-push to a shared repository.

Add it back:

```bash
git remote add origin https://github.com/<username>/<repo>.git
git remote -v
```

## Force Push Rewritten History

After rewriting history, commit hashes change.

```bash
git push --force-with-lease origin main
```

## Verify Before Push

```bash
git log --pretty=format:"%h %an %ae"
```

Make sure the emails are correct before pushing.

## Set Correct Future Identity

```bash
git config --global user.name "Your Name"
git config --global user.email "new-email@example.com"
```

Or set it only for the current repository:

```bash
git config user.name "Your Name"
git config user.email "new-email@example.com"
```

## Best Practices

- Use SSH for work and HTTPS for personal if that keeps account boundaries clear.
- Prefer `git filter-repo` over deprecated `git filter-branch`.
- Verify rewritten history before force-pushing.
- Avoid rewriting shared branch history on team-owned repositories.

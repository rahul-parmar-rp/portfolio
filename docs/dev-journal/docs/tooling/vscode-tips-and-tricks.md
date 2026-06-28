---
title: VS Code Tips And Ideas
description: Small workflow ideas for VS Code automation, background tasks, and git editor setup.
sidebar_position: 2
slug: /tooling/vscode-tips-and-tricks
---

This page turns a short idea dump into a small working note.

## Ideas Worth Exploring

- create a VS Code task or extension that kicks off builds during idle time
- run lightweight background actions when the editor is open but not actively used
- automate repetitive local workflows so they do not depend on memory

## Useful Git Editor Setting

```bash
git config --global core.editor "code --wait"
```

This makes Git open VS Code for commit messages, rebases, and other editor-driven flows, then wait until the editor closes.

## Good Constraint

Any automation added to the editor should do one of two things clearly:

- save repeated manual effort
- surface useful feedback without interrupting editing

If it does neither, it is probably better as a one-off script.

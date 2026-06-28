---
title: Apply ESLint Rules To New Files First
description: Practical ways to roll out stricter ESLint rules to newly created or selected files without forcing a full repo-wide migration.
sidebar_position: 1
slug: /tooling/eslint-rules-for-new-files
---

ESLint does not dynamically change rules based on whether a file is newly created or currently open in the editor. Its config is static.

That said, there are workable ways to approximate gradual rule adoption.

## What ESLint Cannot Do Natively

- detect that a file is new and automatically switch to a different ruleset
- apply rules only to the file currently being edited based on editor focus alone
- change config at runtime from save event state

## Practical Approaches

### Use `overrides` by path or pattern

If new files live in a known folder or follow a naming convention, use `overrides`.

```json
{
  "overrides": [
    {
      "files": ["src/new-files/**/*.ts"],
      "rules": {
        "no-console": "error"
      }
    }
  ]
}
```

### Run ESLint selectively in scripts

Use targeted CLI runs for staged or newly added files instead of the full codebase.

```bash
eslint src/new-files/**/*.ts
```

This is often the simplest way to phase in stricter standards.

### Use git hooks or pre-commit tooling

Tools like `lint-staged` let you apply rules only to staged files. This is usually the best approximation of “new code must be clean”.

### Lean on editor workflows, but do not depend on them

VS Code and other editors can lint the currently open file on save, but this is an execution convenience, not a config model. Treat it as feedback, not policy enforcement.

## Best Practical Strategy

If the repo already contains a lot of legacy code:

1. apply stricter rules to new directories with `overrides`
2. run lint checks on staged files in pre-commit
3. keep the full-repo ruleset stable until the team is ready for a larger cleanup

That approach gives you progressive enforcement without blocking unrelated work.

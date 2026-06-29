# Draft Plan: Commit Message Writer Assistant

## Idea Summary

Build a commit message helper that suggests clean, context-aware commit messages from staged changes.

## Problem

Inconsistent commit quality makes history hard to understand and slows debugging.

## Core MVP

- Read staged diff summary
- Suggest conventional commit style messages
- Auto-generate short and long message variants
- Interactive edit and validation before commit

## Features

- Scope and type suggestions
- Breaking-change warnings
- Team-specific commit templates
- Optional changelog-ready output

## Milestones

1. Local CLI prototype
2. Diff parser and prompt rules
3. Team style profiles
4. Git hook integration

# Draft Plan: Agentic Local Loop (Ollama + Qwen Coder)

## Idea Summary

A fully local, offline coding agent that runs an agentic loop (think -> act ->
observe -> repeat) against a local Ollama model (`qwen2.5-coder`). It helps with
everyday coding tasks: reading files, editing code, running commands, and
iterating until a task is done. No cloud APIs.

## Installed Models (found via `ollama list`)

- `qwen2.5-coder:14b` (default, best quality)
- `qwen2.5-coder:7b` (faster fallback)
- `devstral:24b`, `qwen3.6:27b-coding-nvfp4`, `gemma4:12b-mlx`

## Problem

Cloud coding agents cost money and send code off-device. A local loop keeps
everything private, works offline, and reuses hardware you already have.

## Core MVP

- Connect to local Ollama (`http://localhost:11434`)
- Tool-calling loop with a small, safe tool set:
  - `list_dir` — list files
  - `read_file` — read a file
  - `write_file` — create/overwrite a file
  - `run_command` — run an allow-listed shell command
  - `finish` — end the task with a summary
- The model plans, calls tools via JSON, observes results, and repeats
- Guardrails: max steps, path sandboxing, command allow-list, confirmations

## Technical Approach

- Runtime: Node.js (ESM, matches repo `"type": "module"`)
- Ollama chat API: `POST /api/chat` with `stream: false`
- Loop protocol: model returns a single JSON action per turn
  `{ "thought": "...", "tool": "read_file", "args": { ... } }`
- Deterministic parsing with a JSON extractor + retry on malformed output

## Files

- `agentic-loop/ollama-client.mjs` — thin Ollama chat client
- `agentic-loop/tools.mjs` — tool implementations + sandbox
- `agentic-loop/agent.mjs` — the agentic loop
- `agentic-loop/run.mjs` — CLI entry
- `agentic-loop/README.md` — usage

## Guardrails

- Working directory sandbox (no writes outside project root)
- Command allow-list (`ls`, `cat`, `node`, `pnpm`, `git status`, tests, etc.)
- `--max-steps` cap and `--dry-run`
- `--yes` to auto-approve writes/commands, otherwise prompt

## Milestones

1. Ollama client + model discovery
2. Tool layer with sandbox
3. Agentic loop with JSON protocol
4. CLI + README
5. Guardrails and dry-run

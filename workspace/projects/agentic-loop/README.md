# Agentic Local Loop (Ollama + Qwen Coder)

A fully local coding agent. It runs a think → act → observe loop against a
local Ollama model (defaults to `qwen2.5-coder`). No cloud, no API keys.

## Prerequisites

- [Ollama](https://ollama.com) installed and running
- A coder model pulled:

```bash
ollama pull qwen2.5-coder:14b   # or :7b for a smaller/faster model
```

Check what you have:

```bash
node run.mjs --list-models
```

## Usage

```bash
# Run a coding task in the current directory (prompts before writes/commands)
node run.mjs "add a function sum(a, b) to math.mjs and a quick test"

# Pick a specific model and root, auto-approve actions
node run.mjs --model qwen2.5-coder:7b --root ./src --yes "refactor utils"

# Limit steps
node run.mjs --max-steps 8 "explain what index.tsx does"
```

## Options

| Flag              | Description                               |
| ----------------- | ----------------------------------------- |
| `--model <name>`  | Force a specific Ollama model             |
| `--root <dir>`    | Sandbox root (default: current directory) |
| `--max-steps <n>` | Max loop iterations (default: 15)         |
| `--yes`, `-y`     | Auto-approve file writes and commands     |
| `--list-models`   | List installed Ollama models and exit     |

## How It Works

1. The agent gets a system prompt describing the tools.
2. Each turn the model returns one JSON action:
   `{ "thought": "...", "tool": "read_file", "args": { "path": "x.js" } }`
3. The tool runs; its result is fed back as an observation.
4. Repeat until the model calls `finish` or `--max-steps` is hit.

## Tools

- `list_dir(path)` — list files
- `read_file(path)` — read a file
- `write_file(path, content)` — create/overwrite a file
- `run_command(command)` — run an allow-listed command
- `finish(summary)` — end the task

## Safety

- **Path sandbox**: reads/writes cannot escape `--root`.
- **Command allow-list**: only `ls, cat, node, pnpm, npm, npx, git, grep, rg,
find, head, tail, wc, tsc, echo, pwd` are permitted.
- **Confirmations**: writes and commands prompt unless `--yes` is passed.
- **Step cap**: the loop stops at `--max-steps`.

## Files

- `ollama-client.mjs` — Ollama chat client + model discovery
- `tools.mjs` — tool implementations + sandbox
- `agent.mjs` — the agentic loop
- `run.mjs` — CLI entry

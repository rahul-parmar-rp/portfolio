// Tool implementations for the agentic loop, with a working-directory sandbox
// and a command allow-list. All operations are local.

import { promises as fs } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

// Commands the agent is allowed to run. First token is matched.
const COMMAND_ALLOWLIST = new Set([
  "ls",
  "cat",
  "echo",
  "pwd",
  "node",
  "pnpm",
  "npm",
  "npx",
  "git",
  "grep",
  "rg",
  "find",
  "head",
  "tail",
  "wc",
  "tsc",
]);

// Resolve a path and ensure it stays inside the sandbox root.
function safeResolve(root, target) {
  const resolved = path.resolve(root, target);
  const rel = path.relative(root, resolved);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error(`Path escapes sandbox: ${target}`);
  }
  return resolved;
}

export function createTools({ root, allowWrite, allowRun, onConfirm }) {
  return {
    list_dir: {
      description: "List files and folders in a directory (relative to root).",
      args: { path: "string (default '.')" },
      async run({ path: p = "." }) {
        const dir = safeResolve(root, p);
        const entries = await fs.readdir(dir, { withFileTypes: true });
        return entries
          .map((e) => (e.isDirectory() ? `${e.name}/` : e.name))
          .join("\n");
      },
    },

    read_file: {
      description: "Read a text file (relative to root).",
      args: { path: "string" },
      async run({ path: p }) {
        if (!p) throw new Error("read_file requires 'path'");
        const file = safeResolve(root, p);
        const content = await fs.readFile(file, "utf8");
        // Cap size sent back to the model.
        return content.length > 12000
          ? content.slice(0, 12000) + "\n...[truncated]"
          : content;
      },
    },

    write_file: {
      description: "Create or overwrite a text file (relative to root).",
      args: { path: "string", content: "string" },
      async run({ path: p, content = "" }) {
        if (!p) throw new Error("write_file requires 'path'");
        if (!allowWrite) {
          const ok = await onConfirm?.(`Write file: ${p}?`);
          if (!ok) return "Write cancelled by user.";
        }
        const file = safeResolve(root, p);
        await fs.mkdir(path.dirname(file), { recursive: true });
        await fs.writeFile(file, content, "utf8");
        return `Wrote ${content.length} bytes to ${p}`;
      },
    },

    run_command: {
      description:
        "Run an allow-listed shell command (ls, cat, node, pnpm, git, grep, ...).",
      args: { command: "string" },
      async run({ command }) {
        if (!command) throw new Error("run_command requires 'command'");
        const first = command.trim().split(/\s+/)[0];
        if (!COMMAND_ALLOWLIST.has(first)) {
          return `Command '${first}' is not allow-listed. Allowed: ${[...COMMAND_ALLOWLIST].join(", ")}`;
        }
        if (!allowRun) {
          const ok = await onConfirm?.(`Run: ${command}?`);
          if (!ok) return "Command cancelled by user.";
        }
        return await execShell(command, root);
      },
    },
  };
}

function execShell(command, cwd) {
  return new Promise((resolve) => {
    const child = spawn(command, { cwd, shell: true });
    let out = "";
    let err = "";
    const cap = (s) => (out.length + s.length > 8000 ? out : (out += s));
    child.stdout.on("data", (d) => cap(d.toString()));
    child.stderr.on("data", (d) => (err += d.toString()));
    child.on("close", (code) => {
      const parts = [`exit code: ${code}`];
      if (out.trim()) parts.push(`stdout:\n${out.trim()}`);
      if (err.trim()) parts.push(`stderr:\n${err.trim().slice(0, 4000)}`);
      resolve(parts.join("\n"));
    });
    child.on("error", (e) => resolve(`spawn error: ${e.message}`));
  });
}

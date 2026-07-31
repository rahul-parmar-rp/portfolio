#!/usr/bin/env node
// CLI entry for the local agentic loop.
//
// Usage:
//   node run.mjs "your coding task here"
//   node run.mjs --model qwen2.5-coder:7b --root ./src --yes "refactor utils"
//   node run.mjs --list-models

import readline from "node:readline";
import { pickModel, listModels } from "./ollama-client.mjs";
import { createTools } from "./tools.mjs";
import { runAgent } from "./agent.mjs";

function parseArgs(argv) {
  const opts = {
    model: null,
    root: process.cwd(),
    maxSteps: 15,
    yes: false,
    listModels: false,
    task: "",
  };
  const rest = [];
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--model") opts.model = argv[++i];
    else if (a === "--root") opts.root = argv[++i];
    else if (a === "--max-steps") opts.maxSteps = Number(argv[++i]) || 15;
    else if (a === "--yes" || a === "-y") opts.yes = true;
    else if (a === "--list-models") opts.listModels = true;
    else rest.push(a);
  }
  opts.task = rest.join(" ").trim();
  return opts;
}

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(`${question} [y/N] `, (answer) => {
      rl.close();
      resolve(/^y(es)?$/i.test(answer.trim()));
    });
  });
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.listModels) {
    const models = await listModels();
    console.log("Installed Ollama models:");
    models.forEach((m) => console.log(`  - ${m}`));
    return;
  }

  if (!opts.task) {
    console.log('Usage: node run.mjs "your coding task"');
    console.log("       node run.mjs --list-models");
    console.log("Options: --model <name> --root <dir> --max-steps <n> --yes");
    process.exit(1);
  }

  const model = await pickModel(opts.model);
  console.log(`🤖 Model: ${model}`);
  console.log(`📁 Root:  ${opts.root}`);
  console.log(`🎯 Task:  ${opts.task}`);

  const tools = createTools({
    root: opts.root,
    allowWrite: opts.yes,
    allowRun: opts.yes,
    onConfirm: ask,
  });

  await runAgent({
    task: opts.task,
    model,
    tools,
    maxSteps: opts.maxSteps,
  });
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});

#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);

const args = process.argv.slice(2);

const jsonFile = args.find((arg) => !arg.startsWith("--")) ?? "repos.json";

const dryRun = args.includes("--dry-run");

const repos = JSON.parse(await readFile(jsonFile, "utf8"));

let renamed = 0;
let skipped = 0;
let failed = 0;

for (const repo of repos) {
  const { name, nameWithOwner, renameWith } = repo;

  if (!renameWith) {
    console.log(`⏭️  Skipping ${nameWithOwner}: renameWith is missing`);
    skipped++;
    continue;
  }

  if (name === renameWith) {
    console.log(`⏭️  Skipping ${nameWithOwner}: already named "${name}"`);
    skipped++;
    continue;
  }

  const cmd = ["gh", "repo", "rename", renameWith, "--repo", nameWithOwner];

  if (dryRun) {
    console.log(`[DRY RUN] ${cmd.join(" ")}`);
    continue;
  }

  console.log(`🔄 Renaming ${nameWithOwner} → ${renameWith}`);

  try {
    await exec(cmd[0], cmd.slice(1));
    console.log("✅ Success");
    renamed++;
  } catch (err) {
    console.error(`❌ Failed: ${nameWithOwner}`);
    console.error(err.stderr || err.message);
    failed++;
  }
}

console.log("\nSummary");
console.log("-------");
console.log(`Renamed : ${renamed}`);
console.log(`Skipped : ${skipped}`);
console.log(`Failed  : ${failed}`);

if (dryRun) {
  console.log("\n(Dry run: no repositories were renamed.)");
}

import { generateAndPost } from "../service.js";
import { getDryRunFlag, requireTopicFromArgs } from "./shared.js";

async function main() {
  try {
    const topic = requireTopicFromArgs();
    const dryRun = getDryRunFlag();

    const result = await generateAndPost(topic, { dryRun });
    console.log(JSON.stringify({ ok: true, dryRun, ...result }, null, 2));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(JSON.stringify({ ok: false, error: message }, null, 2));
    process.exit(1);
  }
}

await main();

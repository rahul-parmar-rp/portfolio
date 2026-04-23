import { generateOnly } from "../service.js";
import { requireTopicFromArgs } from "./shared.js";

async function main() {
  try {
    const topic = requireTopicFromArgs();
    const result = await generateOnly(topic);
    console.log(JSON.stringify({ ok: true, ...result }, null, 2));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(JSON.stringify({ ok: false, error: message }, null, 2));
    process.exit(1);
  }
}

await main();

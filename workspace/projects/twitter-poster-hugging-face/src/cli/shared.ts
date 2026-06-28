export function getArgValue(name: string): string | undefined {
  const prefix = `--${name}=`;
  const inline = process.argv.find((arg) => arg.startsWith(prefix));
  if (inline) {
    return inline.slice(prefix.length).trim();
  }

  const idx = process.argv.findIndex((arg) => arg === `--${name}`);
  if (idx >= 0 && process.argv[idx + 1]) {
    return process.argv[idx + 1].trim();
  }

  return undefined;
}

export function requireTopicFromArgs(): string {
  const topic = getArgValue("topic");
  if (!topic) {
    throw new Error('Missing required argument: --topic "your topic"');
  }
  return topic;
}

export function getDryRunFlag(): boolean {
  const dryRun = process.argv.includes("--dry-run");
  return dryRun;
}

const MAX_TWEET_LENGTH = 280;

export function sanitizeTweet(text: string): string {
  const singleLine = text.replace(/\s+/g, " ").trim();
  return singleLine;
}

export function assertTweetConstraints(text: string): void {
  if (!text || !text.trim()) {
    throw new Error("Generated tweet is empty");
  }

  if (text.length > MAX_TWEET_LENGTH) {
    throw new Error(`Tweet exceeds ${MAX_TWEET_LENGTH} characters`);
  }
}

export function normalizeToSingleTweet(raw: string): string {
  const firstLine =
    raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)[0] ?? "";

  const cleaned = sanitizeTweet(firstLine || raw);
  assertTweetConstraints(cleaned);
  return cleaned;
}

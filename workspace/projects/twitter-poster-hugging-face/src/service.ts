import { generateMiniTweet } from "./hf.js";
import { postTweet } from "./twitter.js";

export async function generateOnly(
  topic: string,
): Promise<{ topic: string; tweet: string }> {
  const tweet = await generateMiniTweet(topic);
  return { topic, tweet };
}

export async function generateAndPost(
  topic: string,
  options?: { dryRun?: boolean },
): Promise<{
  topic: string;
  tweet: string;
  posted: boolean;
  tweetId?: string;
}> {
  const tweet = await generateMiniTweet(topic);

  if (options?.dryRun) {
    return {
      topic,
      tweet,
      posted: false,
    };
  }

  const posted = await postTweet(tweet);

  return {
    topic,
    tweet,
    posted: true,
    tweetId: posted.id,
  };
}

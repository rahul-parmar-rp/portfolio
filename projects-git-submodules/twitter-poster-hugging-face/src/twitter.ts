import { TwitterApi } from "twitter-api-v2";
import { getTwitterConfig } from "./config.js";

type PostTweetResult = {
  id: string;
  text: string;
  createdAt: string;
};

export async function postTweet(text: string): Promise<PostTweetResult> {
  const config = getTwitterConfig();

  const client = new TwitterApi({
    appKey: config.twitterApiKey,
    appSecret: config.twitterApiSecret,
    accessToken: config.twitterAccessToken,
    accessSecret: config.twitterAccessSecret,
  });

  try {
    const result = await client.v2.tweet({ text });

    return {
      id: result.data.id,
      text,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Twitter posting failed: ${error.message}`);
    }
    throw new Error("Twitter posting failed");
  }
}

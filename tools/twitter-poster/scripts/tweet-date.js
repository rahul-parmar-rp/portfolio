const { TwitterApi } = require("twitter-api-v2");

(async () => {
  try {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });

    const now = new Date();
    const dateTime = now.toLocaleString();
    const text = `Current date and time: ${dateTime}`;

    console.log(`Posting: "${text}"`);
    const result = await client.v2.tweet({ text });

    console.log("Tweet posted successfully!", result.data.id);
    process.exit(0);
  } catch (error) {
    console.error("Error posting tweet:", error.message);
    process.exit(1);
  }
})();

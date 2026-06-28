import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

export async function POST() {
  try {
    // Initialize Twitter API client
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });

    const now = new Date();
    const dateTime = now.toLocaleString();
    const text = `Current date and time: ${dateTime}`;

    console.log(`Posting: "${text}"`);

    const result = await client.v2.tweet({ text });

    return NextResponse.json({
      success: true,
      message: 'Tweet posted successfully!',
      tweetId: result.data.id,
      text,
    });
  } catch (error: any) {
    console.error('Error posting tweet:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

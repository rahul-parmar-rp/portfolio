import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';

export async function POST() {
  try {
    // Initialize Twitter API client
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });

    const csvPath = path.join(process.cwd(), 'tools/twitter-poster/posts.csv');
    
    if (!fs.existsSync(csvPath)) {
      return NextResponse.json(
        { success: false, error: 'posts.csv not found' },
        { status: 404 }
      );
    }

    const rows: any[] = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => rows.push(row))
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`Found ${rows.length} tweets to post`);

    const results = [];

    for (const row of rows) {
      const text = `${row.tweet} ${row.url} ${row.hashtags}`.trim();

      try {
        const result = await client.v2.tweet({ text });
        console.log('Posted:', text);
        results.push({ success: true, text, tweetId: result.data.id });

        // Wait 10 seconds to avoid rate limiting
        if (rows.indexOf(row) < rows.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 10000));
        }
      } catch (error: any) {
        console.error('Error posting tweet:', error.message);
        results.push({ success: false, text, error: error.message });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Finished posting all tweets',
      total: rows.length,
      results,
    });
  } catch (error: any) {
    console.error('Error:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

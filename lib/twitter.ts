import { TwitterApi } from 'twitter-api-v2';
import fs from 'fs';
import csv from 'csv-parser';
import { Readable } from 'stream';

// Twitter API integration using OAuth 1.0a
export interface TwitterResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface TwitterCredentials {
  appKey: string;
  appSecret: string;
  accessToken: string;
  accessSecret: string;
}

export function createTwitterClient(): TwitterApi {
  const credentials: TwitterCredentials = {
    appKey: process.env.TWITTER_API_KEY || '',
    appSecret: process.env.TWITTER_API_SECRET || '',
    accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
    accessSecret: process.env.TWITTER_ACCESS_SECRET || '',
  };

  if (!credentials.appKey || !credentials.appSecret || !credentials.accessToken || !credentials.accessSecret) {
    throw new Error('Missing Twitter API credentials in environment variables');
  }

  return new TwitterApi(credentials);
}

export async function postTweet(content: string): Promise<TwitterResponse> {
  if (content.length > 280) {
    return { success: false, error: 'Tweet exceeds 280 character limit' };
  }

  try {
    const client = createTwitterClient();
    const result = await client.v2.tweet({ text: content });
    
    return { 
      success: true, 
      data: { 
        id: result.data.id, 
        text: result.data.text 
      } 
    };
  } catch (error) {
    console.error('Twitter API error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown Twitter API error' 
    };
  }
}

export interface CSVRow {
  tweet: string;
  url?: string;
  hashtags?: string;
}

export async function postTweetsFromCSV(csvContent: string): Promise<TwitterResponse[]> {
  return new Promise((resolve, reject) => {
    const rows: CSVRow[] = [];
    const results: TwitterResponse[] = [];
    
    // Create a readable stream from CSV content
    const stream = Readable.from([csvContent]);
    
    stream
      .pipe(csv())
      .on('data', (row: CSVRow) => rows.push(row))
      .on('end', async () => {
        try {
          for (const row of rows) {
            const text = `${row.tweet} ${row.url || ''} ${row.hashtags || ''}`.trim();
            
            const result = await postTweet(text);
            results.push(result);
            
            // Wait 2 seconds between posts to avoid rate limiting
            if (results.length < rows.length) {
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
          resolve(results);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', reject);
  });
}
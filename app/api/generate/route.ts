import { NextRequest, NextResponse } from 'next/server';
import { generateTweet } from '@/lib/ollama';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const result = await generateTweet(prompt);
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Generate tweet error:', error);
    return NextResponse.json(
      { error: 'Failed to generate tweet' },
      { status: 500 }
    );
  }
}
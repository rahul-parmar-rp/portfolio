// Twitter API integration
export interface TwitterResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export async function postTweet(content: string): Promise<TwitterResponse> {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  
  if (!bearerToken) {
    return { success: false, error: 'Twitter Bearer Token not configured' };
  }

  if (content.length > 280) {
    return { success: false, error: 'Tweet exceeds 280 character limit' };
  }

  try {
    const response = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: content,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        error: data.detail || data.title || 'Twitter API error' 
      };
    }

    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
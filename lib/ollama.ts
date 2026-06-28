// Ollama integration for tweet generation
export interface OllamaResponse {
  content: string;
}

export async function generateTweet(prompt: string): Promise<OllamaResponse> {
  const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  
  const response = await fetch(`${ollamaUrl}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3',
      prompt: `Write a short, engaging tweet (under 270 characters) about: ${prompt}. Make it punchy and social media friendly.`,
      stream: false,
      options: {
        temperature: 0.3,
        max_tokens: 100,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status}`);
  }

  const data = await response.json();
  return { content: data.response };
}
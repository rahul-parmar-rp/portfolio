import { getHfConfig } from "./config.js";
import { normalizeToSingleTweet } from "./tweet.js";

type HfResponseItem = {
  generated_text?: string;
};

export async function generateMiniTweet(topic: string): Promise<string> {
  const config = getHfConfig();

  if (!topic || !topic.trim()) {
    throw new Error("Topic is required");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.hfTimeoutMs);

  try {
    const prompt = [
      "Write exactly one concise tweet.",
      "Rules:",
      "- Output only the tweet text",
      "- Max 240 characters",
      "- No thread, no numbering",
      "- Keep it practical and engaging",
      `Topic: ${topic.trim()}`,
    ].join("\n");

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${encodeURIComponent(config.hfModelId)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.hfApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 90,
            temperature: 0.7,
            do_sample: true,
            return_full_text: false,
          },
          options: {
            wait_for_model: true,
          },
        }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Hugging Face API error ${response.status}: ${body}`);
    }

    const json = (await response.json()) as HfResponseItem[] | HfResponseItem;

    let rawText = "";
    if (Array.isArray(json)) {
      rawText = json[0]?.generated_text ?? "";
    } else {
      rawText = json.generated_text ?? "";
    }

    if (!rawText) {
      throw new Error("Hugging Face returned empty content");
    }

    return normalizeToSingleTweet(rawText);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Hugging Face request timed out");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

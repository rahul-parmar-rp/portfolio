// Thin Ollama chat client. Fully local, no cloud.
// Docs: POST http://localhost:11434/api/chat

const DEFAULT_HOST = process.env.OLLAMA_BASE_URL || "http://localhost:11434";

export async function listModels(host = DEFAULT_HOST) {
  const res = await fetch(`${host}/api/tags`);
  if (!res.ok) {
    throw new Error(`Ollama /api/tags failed: ${res.status}`);
  }
  const data = await res.json();
  return (data.models || []).map((m) => m.name);
}

// Pick the best available coder model, preferring qwen2.5-coder.
export async function pickModel(preferred, host = DEFAULT_HOST) {
  const available = await listModels(host);
  if (preferred && available.includes(preferred)) {
    return preferred;
  }
  const priority = [
    "qwen2.5-coder:14b",
    "qwen2.5-coder:7b",
    "qwen2.5-coder:latest",
    "devstral:24b",
  ];
  for (const name of priority) {
    if (available.includes(name)) {
      return name;
    }
  }
  const fallback = available.find((n) => n.includes("coder")) || available[0];
  if (!fallback) {
    throw new Error(
      "No Ollama models installed. Run: ollama pull qwen2.5-coder",
    );
  }
  return fallback;
}

// Send a non-streaming chat completion.
export async function chat({
  model,
  messages,
  host = DEFAULT_HOST,
  temperature = 0.1,
  format,
}) {
  const res = await fetch(`${host}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      format, // "json" forces valid JSON output when supported
      options: { temperature, num_ctx: 8192 },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Ollama /api/chat failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.message?.content ?? "";
}

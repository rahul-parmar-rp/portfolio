import { useState, useRef } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";

function LocalLLM() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const pipeRef = useRef<any>(null);

  async function loadModel() {
    if (pipeRef.current) return pipeRef.current;

    const { pipeline } = await import("@huggingface/transformers");

    pipeRef.current = await pipeline(
      "text-generation",
      "Xenova/distilgpt2", // ✅ smallest stable POC model
    );

    return pipeRef.current;
  }

  async function run() {
    setLoading(true);
    setOutput("");

    try {
      const pipe = await loadModel();

      const result = await pipe(input || "Hello", {
        max_new_tokens: 30, // 🔥 keep small for speed
      });

      setOutput(result?.[0]?.generated_text || "No output");
    } catch (e) {
      console.error(e);
      setOutput("Error running model");
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🧠 Local LLM POC</h2>

      <textarea
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "100%" }}
        placeholder="Type something..."
      />

      <button onClick={run} disabled={loading}>
        {loading ? "Running..." : "Generate"}
      </button>

      <pre style={{ marginTop: 20 }}>{output}</pre>
    </div>
  );
}

export default function Page() {
  return (
    <BrowserOnly fallback={<div>Loading...</div>}>
      {() => <LocalLLM />}
    </BrowserOnly>
  );
}

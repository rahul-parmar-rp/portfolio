import { useState, useRef, useEffect } from "react";

export default function NoCloudAI() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const pipeRef = useRef<any>(null);

  // ✅ ensure browser-only execution
  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ dynamically load model (SSR SAFE)
  async function loadModel(): Promise<any | null> {
    if (!isClient) return null;

    if (pipeRef.current) return pipeRef.current;

    setModelLoading(true);

    try {
      // 🔥 dynamic import (prevents SSR bundling issues)
      const transformers = await import("@huggingface/transformers");
      const { pipeline } = transformers;

      const pipe = await pipeline("text-generation", "distilgpt2");

      pipeRef.current = pipe;
      return pipe;
    } catch (err) {
      console.error("Model load failed:", err);
      setOutput("❌ Failed to load model");
    } finally {
      setModelLoading(false);
    }
  }

  // 🚀 run inference
  async function run() {
    if (!isClient) return;

    setLoading(true);
    setOutput("");

    try {
      const pipe = await loadModel();

      if (!pipe) {
        setOutput("❌ Failed to load model");
        return;
      }

      const result = await pipe(input, {
        max_new_tokens: 80,
        temperature: 0.7,
        top_p: 0.9,
      });

      const outputText = Array.isArray(result)
        ? typeof result[0] === "object" &&
          result[0] !== null &&
          "generated_text" in result[0]
          ? String(
              (result[0] as { generated_text?: unknown }).generated_text ?? "",
            )
          : JSON.stringify(result[0] ?? "")
        : typeof result === "object" &&
            result !== null &&
            "generated_text" in result
          ? String(
              (result as { generated_text?: unknown }).generated_text ?? "",
            )
          : JSON.stringify(result ?? "");

      setOutput(outputText || "No output");
    } catch (err) {
      console.error(err);
      setOutput("❌ Generation error");
    } finally {
      setLoading(false);
    }
  }

  // 🧠 SSR-safe render block
  if (!isClient) {
    return <div>Loading AI module...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🧠 Local LLM (100% Browser, No Cloud)</h2>

      <textarea
        rows={6}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "100%", padding: 10 }}
        placeholder="Type something..."
      />

      <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
        <button onClick={run} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>

        <button
          onClick={() => {
            setInput("");
            setOutput("");
          }}
        >
          Clear
        </button>
      </div>

      {modelLoading && <p>⏳ Loading model (first time only)...</p>}

      <h3>Output:</h3>
      <pre
        style={{
          background: "#f5f5f5",
          padding: 12,
          whiteSpace: "pre-wrap",
        }}
      >
        {output}
      </pre>
    </div>
  );
}

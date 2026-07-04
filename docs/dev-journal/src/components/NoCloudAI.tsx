import React, { useState, useRef } from "react";
import { pipeline } from "@xenova/transformers";

export default function NoCloudAI(): JSX.Element {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const generatorRef = useRef<any>(null);

  async function loadModel() {
    if (!generatorRef.current) {
      // small browser-friendly model
      generatorRef.current = await pipeline(
        "text-generation",
        "Xenova/distilgpt2",
      );
    }
    return generatorRef.current;
  }

  async function runModel() {
    setLoading(true);
    setOutput("");
    try {
      const pipe = await loadModel();
      const result = await pipe(input, {
        max_new_tokens: 80,
        temperature: 0.7,
        top_p: 0.9,
      });

      const text = Array.isArray(result)
        ? (result[0]?.generated_text ?? JSON.stringify(result[0]))
        : ((result as any).generated_text ?? JSON.stringify(result));
      setOutput(text);
    } catch (e: any) {
      console.error(e);
      setOutput("Error: " + (e.message || String(e)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>Local LLM (Browser Only)</h2>

      <textarea
        rows={5}
        cols={60}
        placeholder="Type something..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          width: "100%",
          fontSize: 14,
          padding: 8,
          boxSizing: "border-box",
        }}
      />

      <br />

      <div
        style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}
      >
        <button onClick={runModel} disabled={loading}>
          {loading ? "Running..." : "Generate"}
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

      <h3 style={{ marginTop: 12 }}>Output:</h3>
      <pre
        style={{
          background: "#f7f7f7",
          padding: 12,
          borderRadius: 6,
          whiteSpace: "pre-wrap",
        }}
      >
        {output}
      </pre>
    </div>
  );
}

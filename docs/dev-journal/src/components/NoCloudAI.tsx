import BrowserOnly from "@docusaurus/BrowserOnly";
import { useState, useRef, useEffect } from "react";

function LocalLLM() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const pipeRef = useRef<any>(null);

  // ✅ RUN ONCE IN BROWSER ONLY
  useEffect(() => {
    let mounted = true;

    (async () => {
      const { env, pipeline } = await import("@huggingface/transformers");

      // safe backend config
      if (env.backends?.onnx?.wasm) {
        env.backends.onnx.wasm.proxy = false;
        env.backends.onnx.wasm.numThreads = 1;
        env.backends.onnx.wasm.wasmPaths =
          "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/";
      }

      // preload model once
      const pipe = await pipeline("text-generation", "Xenova/distilgpt2", {
        device: "wasm",
      });

      if (mounted) {
        pipeRef.current = pipe;
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // 🚀 run inference
  async function run() {
    setLoading(true);
    setOutput("");

    try {
      const pipe = pipeRef.current;

      if (!pipe) {
        setOutput("Model still loading...");
        return;
      }

      const result = await pipe(input || "Hello", {
        max_new_tokens: 30,
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

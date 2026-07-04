import { useEffect, useState, useRef } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";

function NoCloudAI(): JSX.Element {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingModel, setLoadingModel] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generatorRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let cancelled = false;

    async function init() {
      try {
        const { pipeline } = await import("@xenova/transformers");
        if (cancelled) return;
        generatorRef.current = await pipeline(
          "text-generation",
          "Xenova/distilgpt2",
        );
        if (!cancelled) {
          setModelLoaded(true);
        }
      } catch (e: any) {
        if (!cancelled) {
          console.error("Model load failed", e);
          setError("Failed to load model: " + (e?.message || String(e)));
          setModelLoaded(false);
        }
      }
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, []);

  async function loadModel() {
    setError(null);
    if (modelLoaded) return generatorRef.current;
    setLoadingModel(true);
    try {
      if (typeof window === "undefined") {
        setLoadingModel(false);
        return null;
      }

      const { pipeline } = await import("@xenova/transformers");
      generatorRef.current = await pipeline(
        "text-generation",
        "Xenova/distilgpt2",
      );
      setModelLoaded(true);
      return generatorRef.current;
    } catch (e: any) {
      console.error("Model load failed", e);
      if (e?.message?.includes("network")) {
        setError(
          "Model download failed: network error. Check your connection and try again.",
        );
      } else if (
        e?.message?.includes("WebGL") ||
        e?.message?.includes("WebGPU")
      ) {
        setError(
          "Browser does not support required GPU features. Try a different browser or enable the required flags.",
        );
      } else {
        setError("Failed to load model: " + (e?.message || String(e)));
      }
      setModelLoaded(false);
      return null;
    } finally {
      setLoadingModel(false);
    }
  }

  async function runModel() {
    setError(null);
    if (!modelLoaded) {
      setError("Model is not loaded. Click 'Load model' first.");
      return;
    }

    setLoading(true);
    setOutput("");
    try {
      const pipe = await loadModel();
      if (!pipe) {
        setError("Model initialization failed. Please try again.");
        return;
      }

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
      setError("Generation error: " + (e?.message || String(e)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>Local LLM (Browser Only)</h2>

      <div style={{ marginBottom: 8 }}>
        <strong>Model status:</strong>{" "}
        {loadingModel ? (
          <span>Loading…</span>
        ) : modelLoaded ? (
          <span style={{ color: "green" }}>Loaded</span>
        ) : (
          <span style={{ color: "orange" }}>Not loaded</span>
        )}
      </div>

      {error && (
        <div style={{ marginBottom: 12, color: "#a00" }}>
          <div style={{ marginBottom: 6 }}>Error: {error}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => {
                setError(null);
              }}
            >
              Clear
            </button>
            <button
              onClick={() => {
                // Retry loading the model
                loadModel().catch(() => {});
              }}
            >
              Retry load
            </button>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 12, display: "flex", gap: 8 }}>
        <button
          onClick={() => loadModel()}
          disabled={loadingModel || modelLoaded}
        >
          {loadingModel
            ? "Loading model…"
            : modelLoaded
              ? "Loaded"
              : "Load model"}
        </button>
        <button
          onClick={() => {
            // unload model (free memory) — best-effort
            try {
              generatorRef.current = null;
            } finally {
              setModelLoaded(false);
              setOutput("");
            }
          }}
          disabled={!modelLoaded && !loadingModel}
        >
          Unload model
        </button>
      </div>

      <textarea
        rows={5}
        cols={60}
        placeholder={
          modelLoaded
            ? "Type something..."
            : "Load the model first to enable generation"
        }
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          width: "100%",
          fontSize: 14,
          padding: 8,
          boxSizing: "border-box",
        }}
        disabled={!modelLoaded}
      />

      <br />

      <div
        style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}
      >
        <button onClick={runModel} disabled={loading || !modelLoaded}>
          {loading ? "Running..." : "Generate"}
        </button>
        <button
          onClick={() => {
            setInput("");
            setOutput("");
            setError(null);
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

export default function NoCloudAIWrapper() {
  return (
    <BrowserOnly fallback={<div>Loading...</div>}>
      {() => <NoCloudAI />}
    </BrowserOnly>
  );
}

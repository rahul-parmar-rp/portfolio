import BrowserOnly from "@docusaurus/BrowserOnly";
import { useState, useRef, useEffect } from "react";

function LocalLLM() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false); // inference running

  const [shouldLoad, setShouldLoad] = useState(false); // button flips this true
  const [modelLoading, setModelLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const pipeRef = useRef<any>(null);

  // ✅ runs only after button sets shouldLoad = true
  useEffect(() => {
    if (!shouldLoad) return;

    let mounted = true;

    (async () => {
      setModelLoading(true);
      setModelError(null);
      setProgress(0);

      try {
        const { env, pipeline } = await import("@huggingface/transformers");

        if (env.backends?.onnx?.wasm) {
          env.backends.onnx.wasm.proxy = false;
          env.backends.onnx.wasm.numThreads = 1;
          env.backends.onnx.wasm.wasmPaths =
            "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/";
        }

        const pipe = await pipeline("text-generation", "Xenova/distilgpt2", {
          device: "wasm",
          progress_callback: (data: any) => {
            if (!mounted) return;
            if (
              data?.status === "progress" &&
              typeof data.progress === "number"
            ) {
              setProgress(Math.round(data.progress));
            }
          },
        });

        if (mounted) {
          pipeRef.current = pipe;
          setModelReady(true);
          setProgress(100);
        }
      } catch (e) {
        console.error(e);
        if (mounted) {
          setModelError(
            "Failed to download/load the model. Check your connection and try again.",
          );
          setModelReady(false);
          pipeRef.current = null;
        }
      } finally {
        if (mounted) setModelLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [shouldLoad]);

  // 🚀 run inference
  async function run() {
    if (!pipeRef.current) {
      setOutput("Model isn't loaded yet — click 'Load Model' first.");
      return;
    }

    setLoading(true);
    setOutput("");

    try {
      const result = await pipeRef.current(input || "Hello", {
        max_new_tokens: 30,
      });
      setOutput(result?.[0]?.generated_text || "No output");
    } catch (e) {
      console.error(e);
      setOutput("Error running model");
    } finally {
      setLoading(false);
    }
  }

  function handleLoadClick() {
    setModelError(null);
    setShouldLoad(true); // triggers the useEffect above
  }

  function handleRetry() {
    // toggle off then on so the effect re-fires even if shouldLoad was already true
    setShouldLoad(false);
    setTimeout(() => setShouldLoad(true), 0);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🧠 Local LLM POC</h2>

      <div style={{ marginBottom: 16 }}>
        <button onClick={handleLoadClick} disabled={modelLoading || modelReady}>
          {modelReady
            ? "Model Loaded ✅"
            : modelLoading
              ? `Loading... ${progress}%`
              : "Load Model"}
        </button>

        {modelLoading && (
          <div
            style={{
              marginTop: 8,
              height: 8,
              width: "100%",
              maxWidth: 300,
              background: "#eee",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "#4caf50",
                transition: "width 0.2s ease",
              }}
            />
          </div>
        )}

        {modelError && (
          <div style={{ color: "red", marginTop: 8 }}>
            {modelError}{" "}
            <button onClick={handleRetry} style={{ marginLeft: 8 }}>
              Retry
            </button>
          </div>
        )}
      </div>

      <textarea
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "100%" }}
      />

      <button onClick={run} disabled={loading || !modelReady}>
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

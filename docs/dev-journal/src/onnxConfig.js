import * as ort from "onnxruntime-web";

// Force WebAssembly backend (browser safe)
ort.env.wasm.numThreads = 1;

// Optional: improve compatibility in Docusaurus
ort.env.wasm.simd = true;

export default ort;

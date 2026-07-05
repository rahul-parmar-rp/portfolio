import BrowserOnly from "@docusaurus/BrowserOnly";
import { useEffect } from "react";
import { pipeline } from "@huggingface/transformers";

function LocalLLM() {
  useEffect(() => {
    async function run() {
      const classifier = await pipeline("sentiment-analysis");

      const result = await classifier("I love AI");

      console.log(result);
    }

    run();
  }, []);

  return <div>Check console output</div>;
}

export default function Page() {
  return (
    <BrowserOnly fallback={<div>Loading...</div>}>
      {() => <LocalLLM />}
    </BrowserOnly>
  );
}

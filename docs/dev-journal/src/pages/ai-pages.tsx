import BrowserOnly from "@docusaurus/BrowserOnly";

export default function AIPage() {
  return (
    <BrowserOnly fallback={<div>Loading AI...</div>}>
      {() => {
        const NoCloudAI = require("../components/NoCloudAI").default;
        return <NoCloudAI />;
      }}
    </BrowserOnly>
  );
}

import type { Metadata } from "next";
import { IpoPlannerApp } from "./components/app";

export const metadata: Metadata = {
  title: "IPO Application Planner",
  description:
    "Plan and optimize IPO applications across multiple people, accounts, brokers and quotas. Client-side, localStorage only.",
};

export default function Page() {
  return (
    <section>
      <h1 className="mb-2 text-2xl font-semibold tracking-tighter">
        IPO Application Planner
      </h1>
      <p className="mb-6 text-sm text-neutral-500">
        Figure out the best way to apply for IPOs across your accounts within a
        budget. All data stays in your browser (localStorage). Start from{" "}
        <b>Settings → Load sample data</b>, then open the <b>Optimizer</b>.
      </p>
      <IpoPlannerApp />
    </section>
  );
}

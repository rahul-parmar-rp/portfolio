"use client";

import React, { useState } from "react";
import { useStore } from "../lib/store";
import { DashboardTab } from "./dashboard-tab";
import { OptimizerTab } from "./optimizer-tab";
import { IposTab } from "./ipos-tab";
import { ApplicationsTab } from "./applications-tab";
import { AccountsTab } from "./accounts-tab";
import { SettingsTab } from "./settings-tab";

type Tab =
  | "dashboard"
  | "optimizer"
  | "ipos"
  | "applications"
  | "accounts"
  | "settings";

const TABS: { id: Tab; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "optimizer", label: "Optimizer" },
  { id: "ipos", label: "IPOs" },
  { id: "applications", label: "Applications" },
  { id: "accounts", label: "Accounts" },
  { id: "settings", label: "Settings" },
];

export function IpoPlannerApp() {
  const { data, hydrated, update, replaceAll, reset } = useStore();
  const [tab, setTab] = useState<Tab>("dashboard");

  if (!hydrated) {
    return <div className="text-sm text-neutral-500">Loading…</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-4 border-b border-neutral-200 dark:border-neutral-800">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`text-sm px-3 py-2 -mb-px border-b-2 ${
              tab === t.id
                ? "border-blue-600 text-blue-600 font-medium"
                : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && <DashboardTab data={data} />}
      {tab === "optimizer" && <OptimizerTab data={data} update={update} />}
      {tab === "ipos" && <IposTab data={data} update={update} />}
      {tab === "applications" && (
        <ApplicationsTab data={data} update={update} />
      )}
      {tab === "accounts" && <AccountsTab data={data} update={update} />}
      {tab === "settings" && (
        <SettingsTab data={data} replaceAll={replaceAll} reset={reset} />
      )}
    </div>
  );
}

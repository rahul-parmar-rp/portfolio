"use client";

import React, { useRef } from "react";
import type { AppData } from "../types";
import { emptyData } from "../types";
import { toCSV, download } from "../lib/export";
import { Card, Button, Empty } from "./ui";

const SAMPLE: AppData = {
  people: [
    { id: "p_rahul", name: "Rahul", active: true },
    { id: "p_kiran", name: "Kiran", active: true },
    { id: "p_naren", name: "Narendra", active: true },
  ],
  accounts: [
    {
      id: "a_1",
      personId: "p_rahul",
      bank: "SBI",
      broker: "Zerodha",
      availableFunds: 100000,
      active: true,
    },
    {
      id: "a_2",
      personId: "p_rahul",
      bank: "HDFC",
      broker: "Groww",
      availableFunds: 50000,
      active: true,
    },
    {
      id: "a_3",
      personId: "p_kiran",
      bank: "ICICI",
      broker: "Zerodha",
      availableFunds: 300000,
      active: true,
    },
    {
      id: "a_4",
      personId: "p_naren",
      bank: "ICICI",
      broker: "Groww",
      availableFunds: 250000,
      active: true,
    },
  ],
  ipos: [
    {
      id: "i_lumino",
      name: "Lumino",
      price: 3731,
      lotSize: 4,
      quotas: [
        {
          id: "q_l_small",
          name: "Small",
          minLots: 1,
          maxLots: 13,
          eligibility: "eligible",
        },
        {
          id: "q_l_shni",
          name: "SHNI",
          minLots: 14,
          maxLots: 67,
          eligibility: "eligible",
        },
      ],
      archived: false,
    },
    {
      id: "i_esds",
      name: "ESDS",
      price: 3646,
      lotSize: 4,
      quotas: [
        {
          id: "q_e_small",
          name: "Small",
          minLots: 1,
          maxLots: 13,
          eligibility: "eligible",
        },
        {
          id: "q_e_shni",
          name: "SHNI",
          minLots: 14,
          maxLots: 67,
          eligibility: "eligible",
        },
      ],
      archived: false,
    },
  ],
  applications: [],
};

export function SettingsTab({
  data,
  replaceAll,
  reset,
}: {
  data: AppData;
  replaceAll: (d: AppData) => void;
  reset: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  function exportJSON() {
    download(
      "ipo-planner-backup.json",
      JSON.stringify(data, null, 2),
      "application/json",
    );
  }

  function exportCSV() {
    download("ipo-applications.csv", toCSV(data));
  }

  function importJSON(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        replaceAll({
          people: parsed.people ?? [],
          accounts: parsed.accounts ?? [],
          ipos: parsed.ipos ?? [],
          applications: parsed.applications ?? [],
        });
      } catch {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-4">
      <Card title="Data">
        <div className="flex flex-wrap gap-2">
          <Button onClick={exportJSON}>Export backup (JSON)</Button>
          <Button onClick={exportCSV}>Export applications (CSV)</Button>
          <Button onClick={() => fileRef.current?.click()}>Import JSON</Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importJSON(f);
              e.target.value = "";
            }}
          />
        </div>
      </Card>

      <Card title="Quick start">
        <p className="text-sm text-neutral-500 mb-2">
          Load sample people, accounts and IPOs to try the planner.
        </p>
        <Button variant="primary" onClick={() => replaceAll(SAMPLE)}>
          Load sample data
        </Button>
      </Card>

      <Card title="Danger zone">
        <Button
          variant="danger"
          onClick={() => {
            if (confirm("Clear all data? This cannot be undone.")) reset();
          }}
        >
          Clear all data
        </Button>
      </Card>

      {data.people.length === 0 &&
        data.ipos.length === 0 &&
        data.accounts.length === 0 && (
          <Empty>Empty workspace — load sample data to start.</Empty>
        )}
    </div>
  );
}

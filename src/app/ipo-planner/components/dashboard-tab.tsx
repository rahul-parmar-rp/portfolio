"use client";

import React from "react";
import type { AppData } from "../types";
import { fmtINR, accountFundingView, ipoRequired } from "../lib/calc";
import { Card, Stat, Empty, Badge } from "./ui";

export function DashboardTab({ data }: { data: AppData }) {
  const activeIpos = data.ipos.filter((i) => !i.archived);
  const totalRequired = data.applications.reduce((s, a) => s + a.amount, 0);
  const totalAvailable = data.accounts.reduce(
    (s, a) => s + a.availableFunds,
    0,
  );
  const funding = accountFundingView(data);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Active IPOs" value={activeIpos.length} />
        <Stat label="Applications" value={data.applications.length} />
        <Stat label="Required" value={fmtINR(totalRequired)} />
        <Stat
          label="Available"
          value={fmtINR(totalAvailable)}
          tone={totalAvailable >= totalRequired ? "ok" : "warn"}
        />
        <Stat
          label="Remaining"
          value={fmtINR(totalAvailable - totalRequired)}
          tone={totalAvailable - totalRequired >= 0 ? "ok" : "warn"}
        />
      </div>

      <Card title="Active / Upcoming IPOs">
        {activeIpos.length === 0 ? (
          <Empty>No active IPOs.</Empty>
        ) : (
          <div className="space-y-1">
            {activeIpos.map((i) => (
              <div
                key={i.id}
                className="flex justify-between text-sm py-1 border-b border-neutral-100 dark:border-neutral-900"
              >
                <span>{i.name}</span>
                <span className="font-medium">
                  {fmtINR(ipoRequired(data, i.id))}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Account Funding">
        {funding.length === 0 ? (
          <Empty>No accounts.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                  <th className="py-1 pr-2">Person</th>
                  <th className="py-1 pr-2">Account</th>
                  <th className="py-1 pr-2 text-right">Required</th>
                  <th className="py-1 pr-2 text-right">Available</th>
                  <th className="py-1 pr-2 text-right">Remaining</th>
                  <th className="py-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {funding.map((f) => {
                  const p = data.people.find(
                    (x) => x.id === f.account.personId,
                  );
                  return (
                    <tr
                      key={f.account.id}
                      className="border-b border-neutral-100 dark:border-neutral-900"
                    >
                      <td className="py-1 pr-2">{p?.name}</td>
                      <td className="py-1 pr-2">
                        {f.account.bank}/{f.account.broker}
                      </td>
                      <td className="py-1 pr-2 text-right">
                        {fmtINR(f.required)}
                      </td>
                      <td className="py-1 pr-2 text-right">
                        {fmtINR(f.available)}
                      </td>
                      <td className="py-1 pr-2 text-right">
                        {fmtINR(f.remaining)}
                      </td>
                      <td className="py-1">
                        {f.ok ? (
                          <Badge tone="ok">✓ ok</Badge>
                        ) : (
                          <Badge tone="warn">
                            ⚠ short {fmtINR(-f.remaining)}
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

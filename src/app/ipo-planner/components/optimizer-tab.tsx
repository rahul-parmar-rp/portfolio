"use client";

import React, { useMemo, useState } from "react";
import type { AppData, Application } from "../types";
import {
  uid,
  fmtINR,
  optimize,
  applicationAmount,
  type OptimizerIPOConfig,
  type OptimizerSolution,
} from "../lib/calc";
import { Card, Button, Input, Empty, Badge, Stat } from "./ui";

export function OptimizerTab({
  data,
  update,
}: {
  data: AppData;
  update: (fn: (d: AppData) => AppData) => void;
}) {
  const activeIpos = data.ipos.filter((i) => !i.archived);
  const activeAccounts = data.accounts.filter((a) => a.active);

  const [budget, setBudget] = useState("");
  const [useAccountFunds, setUseAccountFunds] = useState(true);
  const [oneApp, setOneApp] = useState(true);
  const [accountIds, setAccountIds] = useState<string[]>(
    activeAccounts.map((a) => a.id),
  );
  const [configs, setConfigs] = useState<OptimizerIPOConfig[]>([]);
  const [solutions, setSolutions] = useState<OptimizerSolution[]>([]);
  const [applied, setApplied] = useState<string | null>(null);

  function toggleAccount(id: string) {
    setAccountIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    );
  }

  function toggleIpoQuota(ipoId: string, quotaId: string, lots: number) {
    setConfigs((cfgs) => {
      const existing = cfgs.find(
        (c) => c.ipoId === ipoId && c.quotaId === quotaId,
      );
      if (existing) {
        return cfgs.filter(
          (c) => !(c.ipoId === ipoId && c.quotaId === quotaId),
        );
      }
      return [...cfgs, { ipoId, quotaId, lots }];
    });
  }

  function setConfigLots(ipoId: string, quotaId: string, lots: number) {
    setConfigs((cfgs) =>
      cfgs.map((c) =>
        c.ipoId === ipoId && c.quotaId === quotaId ? { ...c, lots } : c,
      ),
    );
  }

  function run() {
    const totalBudget = !useAccountFunds && budget ? Number(budget) : undefined;
    const sols = optimize(data, {
      totalBudget,
      accountIds,
      configs,
      oneAppPerPersonPerIpo: oneApp,
    });
    setSolutions(sols);
    setApplied(null);
  }

  function applySolution(sol: OptimizerSolution) {
    const apps: Application[] = sol.applications.map((pa) => ({
      id: uid("app"),
      accountId: pa.accountId,
      ipoId: pa.ipoId,
      quotaId: pa.quotaId,
      lots: pa.lots,
      amount: pa.amount,
      status: "draft",
    }));
    update((d) => ({ ...d, applications: [...d.applications, ...apps] }));
    setApplied(sol.id);
  }

  const selectedBudget = useMemo(() => {
    if (!useAccountFunds && budget) return Number(budget);
    return accountIds.reduce((s, id) => {
      const a = data.accounts.find((x) => x.id === id);
      return s + (a?.availableFunds ?? 0);
    }, 0);
  }, [useAccountFunds, budget, accountIds, data.accounts]);

  const canRun =
    accountIds.length > 0 && configs.length > 0 && activeIpos.length > 0;

  return (
    <div className="space-y-4">
      <Card title="1. Budget">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={useAccountFunds}
              onChange={() => setUseAccountFunds(true)}
            />
            Use each account&apos;s available funds
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={!useAccountFunds}
              onChange={() => setUseAccountFunds(false)}
            />
            Use a single total budget
          </label>
          {!useAccountFunds && (
            <Input
              type="number"
              placeholder="Total budget ₹"
              className="w-48"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          )}
          <Badge tone="info">Budget: {fmtINR(selectedBudget)}</Badge>
        </div>
        <div className="mt-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={oneApp}
              onChange={(e) => setOneApp(e.target.checked)}
            />
            Max one application per person per IPO
          </label>
        </div>
      </Card>

      <Card title="2. Accounts to use">
        {activeAccounts.length === 0 ? (
          <Empty>No active accounts.</Empty>
        ) : (
          <div className="flex flex-wrap gap-2">
            {activeAccounts.map((a) => {
              const p = data.people.find((x) => x.id === a.personId);
              const on = accountIds.includes(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => toggleAccount(a.id)}
                  className={`text-xs rounded-md border px-2 py-1 ${
                    on
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-neutral-300 dark:border-neutral-700"
                  }`}
                >
                  {p?.name} · {a.bank}/{a.broker} · {fmtINR(a.availableFunds)}
                </button>
              );
            })}
          </div>
        )}
      </Card>

      <Card title="3. IPOs & quotas to consider">
        {activeIpos.length === 0 ? (
          <Empty>No active IPOs.</Empty>
        ) : (
          <div className="space-y-3">
            {activeIpos.map((ipo) => (
              <div key={ipo.id}>
                <div className="text-sm font-medium mb-1">
                  {ipo.name}{" "}
                  <span className="text-neutral-500 font-normal">
                    (1 lot = {fmtINR(ipo.price * ipo.lotSize)})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ipo.quotas.map((q) => {
                    const cfg = configs.find(
                      (c) => c.ipoId === ipo.id && c.quotaId === q.id,
                    );
                    const on = !!cfg;
                    const lots = cfg?.lots ?? q.minLots;
                    return (
                      <div
                        key={q.id}
                        className={`flex items-center gap-2 text-xs rounded-md border px-2 py-1 ${
                          on
                            ? "border-blue-500"
                            : "border-neutral-300 dark:border-neutral-700"
                        }`}
                      >
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={() =>
                              toggleIpoQuota(ipo.id, q.id, q.minLots)
                            }
                          />
                          {q.name}
                        </label>
                        {on && (
                          <>
                            <span className="text-neutral-500">lots</span>
                            <input
                              type="number"
                              min={q.minLots}
                              max={q.maxLots || undefined}
                              value={lots}
                              onChange={(e) =>
                                setConfigLots(
                                  ipo.id,
                                  q.id,
                                  Number(e.target.value) || q.minLots,
                                )
                              }
                              className="w-14 rounded border border-neutral-300 dark:border-neutral-700 bg-transparent px-1"
                            />
                            <span className="text-neutral-500">
                              ={fmtINR(applicationAmount(ipo, lots))}
                            </span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Button variant="primary" onClick={run} disabled={!canRun}>
        Calculate optimal plans
      </Button>

      {solutions.length === 0 ? null : (
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">
            Suggested plans (choose one)
          </h3>
          {solutions.map((sol) => (
            <Card
              key={sol.id}
              title={sol.title}
              right={
                <Button
                  size="sm"
                  variant={applied === sol.id ? "outline" : "primary"}
                  onClick={() => applySolution(sol)}
                  disabled={applied === sol.id}
                >
                  {applied === sol.id ? "Applied ✓" : "Use this plan"}
                </Button>
              }
            >
              <p className="text-xs text-neutral-500 mb-2">{sol.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                <Stat label="Applications" value={sol.totalApplications} />
                <Stat label="Capital used" value={fmtINR(sol.totalAmount)} />
                <Stat
                  label="Budget left"
                  value={fmtINR(sol.budgetLeft)}
                  tone={sol.budgetLeft >= 0 ? "ok" : "warn"}
                />
              </div>
              {sol.applications.length === 0 ? (
                <Empty>Nothing fits this budget.</Empty>
              ) : (
                <ul className="text-sm space-y-1">
                  {sol.applications.map((a, i) => (
                    <li
                      key={i}
                      className="flex justify-between border-b border-neutral-100 dark:border-neutral-900 py-1"
                    >
                      <span>{a.label}</span>
                      <span className="font-medium">{fmtINR(a.amount)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

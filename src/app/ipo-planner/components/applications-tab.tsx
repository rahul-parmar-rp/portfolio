"use client";

import React, { useMemo, useState } from "react";
import type { AppData, Application, ApplicationStatus } from "../types";
import { STATUS_LABELS, STATUS_ORDER } from "../types";
import {
  uid,
  fmtINR,
  applicationAmount,
  sharesForLots,
  validateApplication,
} from "../lib/calc";
import { Card, Button, Field, Input, Select, Empty } from "./ui";

export function ApplicationsTab({
  data,
  update,
}: {
  data: AppData;
  update: (fn: (d: AppData) => AppData) => void;
}) {
  const [form, setForm] = useState({
    accountId: "",
    ipoId: "",
    quotaId: "",
    lots: "1",
  });

  const ipo = data.ipos.find((i) => i.id === form.ipoId);
  const lots = Number(form.lots) || 0;
  const amount = ipo ? applicationAmount(ipo, lots) : 0;
  const shares = ipo ? sharesForLots(ipo, lots) : 0;

  const validation = useMemo(() => {
    if (!form.accountId || !form.ipoId || !form.quotaId) return null;
    return validateApplication(data, {
      accountId: form.accountId,
      ipoId: form.ipoId,
      quotaId: form.quotaId,
      lots,
    });
  }, [data, form, lots]);

  function addApplication() {
    if (!form.accountId || !form.ipoId || !form.quotaId || !ipo) return;
    if (validation && validation.errors.length > 0) return;
    const app: Application = {
      id: uid("app"),
      accountId: form.accountId,
      ipoId: form.ipoId,
      quotaId: form.quotaId,
      lots,
      amount,
      status: "draft",
    };
    update((d) => ({ ...d, applications: [...d.applications, app] }));
    setForm({ accountId: "", ipoId: "", quotaId: "", lots: "1" });
  }

  function removeApp(id: string) {
    update((d) => ({
      ...d,
      applications: d.applications.filter((a) => a.id !== id),
    }));
  }

  function setStatus(id: string, status: ApplicationStatus) {
    update((d) => ({
      ...d,
      applications: d.applications.map((a) =>
        a.id === id ? { ...a, status } : a,
      ),
    }));
  }

  return (
    <div className="space-y-4">
      <Card title="Create Application">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 items-end">
          <Field label="Account">
            <Select
              value={form.accountId}
              onChange={(e) => setForm({ ...form, accountId: e.target.value })}
            >
              <option value="">Select account</option>
              {data.accounts.map((a) => {
                const p = data.people.find((x) => x.id === a.personId);
                return (
                  <option key={a.id} value={a.id}>
                    {p?.name} — {a.bank}/{a.broker}
                  </option>
                );
              })}
            </Select>
          </Field>
          <Field label="IPO">
            <Select
              value={form.ipoId}
              onChange={(e) =>
                setForm({ ...form, ipoId: e.target.value, quotaId: "" })
              }
            >
              <option value="">Select IPO</option>
              {data.ipos
                .filter((i) => !i.archived)
                .map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
            </Select>
          </Field>
          <Field label="Quota">
            <Select
              value={form.quotaId}
              onChange={(e) => setForm({ ...form, quotaId: e.target.value })}
              disabled={!ipo}
            >
              <option value="">Select quota</option>
              {ipo?.quotas.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Lots">
            <Input
              type="number"
              value={form.lots}
              onChange={(e) => setForm({ ...form, lots: e.target.value })}
            />
          </Field>
          <Button variant="primary" onClick={addApplication}>
            Add
          </Button>
        </div>

        {ipo && (
          <div className="mt-3 text-sm">
            Shares: <b>{shares}</b> · Amount: <b>{fmtINR(amount)}</b>
          </div>
        )}
        {validation && (
          <div className="mt-2 space-y-1">
            {validation.errors.map((e, i) => (
              <div key={i} className="text-xs text-red-600">
                ⛔ {e}
              </div>
            ))}
            {validation.warnings.map((w, i) => (
              <div key={i} className="text-xs text-amber-600">
                ⚠️ {w}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title={`Applications (${data.applications.length})`}>
        {data.applications.length === 0 ? (
          <Empty>No applications.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                  <th className="py-1 pr-2">Person</th>
                  <th className="py-1 pr-2">Account</th>
                  <th className="py-1 pr-2">IPO</th>
                  <th className="py-1 pr-2">Quota</th>
                  <th className="py-1 pr-2 text-right">Lots</th>
                  <th className="py-1 pr-2 text-right">Amount</th>
                  <th className="py-1 pr-2">Status</th>
                  <th className="py-1"></th>
                </tr>
              </thead>
              <tbody>
                {data.applications.map((app) => {
                  const acc = data.accounts.find((a) => a.id === app.accountId);
                  const p = data.people.find((x) => x.id === acc?.personId);
                  const i = data.ipos.find((x) => x.id === app.ipoId);
                  const q = i?.quotas.find((x) => x.id === app.quotaId);
                  return (
                    <tr
                      key={app.id}
                      className="border-b border-neutral-100 dark:border-neutral-900"
                    >
                      <td className="py-1 pr-2">{p?.name}</td>
                      <td className="py-1 pr-2">
                        {acc?.bank}/{acc?.broker}
                      </td>
                      <td className="py-1 pr-2">{i?.name}</td>
                      <td className="py-1 pr-2">{q?.name}</td>
                      <td className="py-1 pr-2 text-right">{app.lots}</td>
                      <td className="py-1 pr-2 text-right">
                        {fmtINR(app.amount)}
                      </td>
                      <td className="py-1 pr-2">
                        <Select
                          value={app.status}
                          onChange={(e) =>
                            setStatus(
                              app.id,
                              e.target.value as ApplicationStatus,
                            )
                          }
                        >
                          {STATUS_ORDER.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABELS[s]}
                            </option>
                          ))}
                        </Select>
                      </td>
                      <td className="py-1">
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => removeApp(app.id)}
                        >
                          ✕
                        </Button>
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

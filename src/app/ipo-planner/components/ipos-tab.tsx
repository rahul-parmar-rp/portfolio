"use client";

import React, { useState } from "react";
import type { AppData, IPO, Quota, Eligibility } from "../types";
import { uid, fmtINR, ipoRequired } from "../lib/calc";
import { Card, Button, Field, Input, Select, Empty, Badge } from "./ui";

const blankQuota = (): Quota => ({
  id: uid("quota"),
  name: "",
  minLots: 1,
  maxLots: 0,
  eligibility: "eligible",
});

export function IposTab({
  data,
  update,
}: {
  data: AppData;
  update: (fn: (d: AppData) => AppData) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    lotSize: "",
    openDate: "",
    closeDate: "",
  });
  const [quotas, setQuotas] = useState<Quota[]>([
    { ...blankQuota(), name: "Retail", minLots: 1, maxLots: 13 },
    { ...blankQuota(), name: "SHNI", minLots: 14, maxLots: 67 },
  ]);

  function addIpo() {
    if (!form.name.trim() || !form.price || !form.lotSize) return;
    const ipo: IPO = {
      id: uid("ipo"),
      name: form.name.trim(),
      price: Number(form.price),
      lotSize: Number(form.lotSize),
      openDate: form.openDate || undefined,
      closeDate: form.closeDate || undefined,
      quotas: quotas
        .filter((q) => q.name.trim())
        .map((q) => ({ ...q, id: uid("quota") })),
      archived: false,
    };
    update((d) => ({ ...d, ipos: [...d.ipos, ipo] }));
    setForm({ name: "", price: "", lotSize: "", openDate: "", closeDate: "" });
    setQuotas([
      { ...blankQuota(), name: "Retail", minLots: 1, maxLots: 13 },
      { ...blankQuota(), name: "SHNI", minLots: 14, maxLots: 67 },
    ]);
  }

  function removeIpo(id: string) {
    update((d) => ({
      ...d,
      ipos: d.ipos.filter((i) => i.id !== id),
      applications: d.applications.filter((a) => a.ipoId !== id),
    }));
  }

  function toggleArchive(id: string) {
    update((d) => ({
      ...d,
      ipos: d.ipos.map((i) =>
        i.id === id ? { ...i, archived: !i.archived } : i,
      ),
    }));
  }

  return (
    <div className="space-y-4">
      <Card title="Add IPO">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
          <Field label="IPO name">
            <Input
              placeholder="Lumino"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Price (₹)">
            <Input
              type="number"
              placeholder="3731"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </Field>
          <Field label="Lot size">
            <Input
              type="number"
              placeholder="4"
              value={form.lotSize}
              onChange={(e) => setForm({ ...form, lotSize: e.target.value })}
            />
          </Field>
          <Field label="Open date">
            <Input
              type="date"
              value={form.openDate}
              onChange={(e) => setForm({ ...form, openDate: e.target.value })}
            />
          </Field>
          <Field label="Close date">
            <Input
              type="date"
              value={form.closeDate}
              onChange={(e) => setForm({ ...form, closeDate: e.target.value })}
            />
          </Field>
        </div>

        <div className="mb-2 text-xs text-neutral-500">Quotas</div>
        <div className="space-y-2">
          {quotas.map((q, idx) => (
            <div key={q.id} className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <Input
                placeholder="Quota name"
                value={q.name}
                onChange={(e) =>
                  setQuotas((qs) =>
                    qs.map((x, i) =>
                      i === idx ? { ...x, name: e.target.value } : x,
                    ),
                  )
                }
              />
              <Input
                type="number"
                placeholder="min lots"
                value={q.minLots}
                onChange={(e) =>
                  setQuotas((qs) =>
                    qs.map((x, i) =>
                      i === idx
                        ? { ...x, minLots: Number(e.target.value) || 0 }
                        : x,
                    ),
                  )
                }
              />
              <Input
                type="number"
                placeholder="max lots (0 = none)"
                value={q.maxLots}
                onChange={(e) =>
                  setQuotas((qs) =>
                    qs.map((x, i) =>
                      i === idx
                        ? { ...x, maxLots: Number(e.target.value) || 0 }
                        : x,
                    ),
                  )
                }
              />
              <Select
                value={q.eligibility}
                onChange={(e) =>
                  setQuotas((qs) =>
                    qs.map((x, i) =>
                      i === idx
                        ? { ...x, eligibility: e.target.value as Eligibility }
                        : x,
                    ),
                  )
                }
              >
                <option value="eligible">Eligible</option>
                <option value="not-eligible">Not eligible</option>
                <option value="unknown">Unknown</option>
              </Select>
              <Button
                variant="danger"
                size="sm"
                onClick={() =>
                  setQuotas((qs) => qs.filter((_, i) => i !== idx))
                }
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <Button
            size="sm"
            onClick={() => setQuotas((q) => [...q, blankQuota()])}
          >
            + Add quota
          </Button>
          <Button variant="primary" onClick={addIpo}>
            Save IPO
          </Button>
        </div>
      </Card>

      {data.ipos.length === 0 && <Empty>No IPOs yet.</Empty>}

      {data.ipos.map((ipo) => (
        <Card
          key={ipo.id}
          title={ipo.name}
          right={
            <div className="flex gap-2 items-center">
              {ipo.archived && <Badge tone="warn">archived</Badge>}
              <Button size="sm" onClick={() => toggleArchive(ipo.id)}>
                {ipo.archived ? "Reopen" : "Archive"}
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => removeIpo(ipo.id)}
              >
                Delete
              </Button>
            </div>
          }
        >
          <div className="text-sm text-neutral-500 mb-2">
            Price {fmtINR(ipo.price)} · Lot size {ipo.lotSize} · 1 lot ={" "}
            {fmtINR(ipo.price * ipo.lotSize)} · Required (all apps):{" "}
            {fmtINR(ipoRequired(data, ipo.id))}
          </div>
          <div className="flex flex-wrap gap-2">
            {ipo.quotas.map((q) => (
              <Badge key={q.id} tone="info">
                {q.name}: {q.minLots}-{q.maxLots || "∞"} lots
              </Badge>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

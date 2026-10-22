"use client";

import React, { useState } from "react";
import type { AppData, Person, Account } from "../types";
import { uid, fmtINR } from "../lib/calc";
import { Card, Button, Field, Input, Textarea, Empty, Badge } from "./ui";

export function AccountsTab({
  data,
  update,
}: {
  data: AppData;
  update: (fn: (d: AppData) => AppData) => void;
}) {
  const [name, setName] = useState("");

  function addPerson() {
    if (!name.trim()) return;
    const p: Person = { id: uid("person"), name: name.trim(), active: true };
    update((d) => ({ ...d, people: [...d.people, p] }));
    setName("");
  }

  function removePerson(id: string) {
    update((d) => ({
      ...d,
      people: d.people.filter((p) => p.id !== id),
      accounts: d.accounts.filter((a) => a.personId !== id),
    }));
  }

  return (
    <div className="space-y-4">
      <Card title="Add Person">
        <div className="flex gap-2">
          <Input
            placeholder="Name (e.g. Rahul)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addPerson()}
          />
          <Button variant="primary" onClick={addPerson}>
            Add
          </Button>
        </div>
      </Card>

      {data.people.length === 0 && <Empty>No people yet. Add one above.</Empty>}

      {data.people.map((person) => (
        <PersonCard
          key={person.id}
          person={person}
          data={data}
          update={update}
          onRemove={() => removePerson(person.id)}
        />
      ))}
    </div>
  );
}

function PersonCard({
  person,
  data,
  update,
  onRemove,
}: {
  person: Person;
  data: AppData;
  update: (fn: (d: AppData) => AppData) => void;
  onRemove: () => void;
}) {
  const accounts = data.accounts.filter((a) => a.personId === person.id);
  const [form, setForm] = useState({
    bank: "",
    broker: "",
    availableFunds: "",
    upiId: "",
  });

  function addAccount() {
    if (!form.bank.trim() || !form.broker.trim()) return;
    const acc: Account = {
      id: uid("acc"),
      personId: person.id,
      bank: form.bank.trim(),
      broker: form.broker.trim(),
      availableFunds: Number(form.availableFunds) || 0,
      upiId: form.upiId.trim() || undefined,
      active: true,
    };
    update((d) => ({ ...d, accounts: [...d.accounts, acc] }));
    setForm({ bank: "", broker: "", availableFunds: "", upiId: "" });
  }

  function removeAccount(id: string) {
    update((d) => ({
      ...d,
      accounts: d.accounts.filter((a) => a.id !== id),
      applications: d.applications.filter((ap) => ap.accountId !== id),
    }));
  }

  function updateFunds(id: string, val: number) {
    update((d) => ({
      ...d,
      accounts: d.accounts.map((a) =>
        a.id === id ? { ...a, availableFunds: val } : a,
      ),
    }));
  }

  function toggleActive(id: string) {
    update((d) => ({
      ...d,
      accounts: d.accounts.map((a) =>
        a.id === id ? { ...a, active: !a.active } : a,
      ),
    }));
  }

  return (
    <Card
      title={`${person.name}`}
      right={
        <Button size="sm" variant="danger" onClick={onRemove}>
          Delete person
        </Button>
      }
    >
      {accounts.length === 0 ? (
        <Empty>No accounts.</Empty>
      ) : (
        <div className="space-y-2 mb-3">
          {accounts.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center gap-2 text-sm border border-neutral-200 dark:border-neutral-800 rounded-md p-2"
            >
              <span className="font-medium">
                {a.bank} → {a.broker}
              </span>
              {!a.active && <Badge tone="warn">inactive</Badge>}
              <span className="text-neutral-500">funds:</span>
              <Input
                type="number"
                className="w-32"
                value={a.availableFunds}
                onChange={(e) => updateFunds(a.id, Number(e.target.value) || 0)}
              />
              <span className="text-neutral-500">
                {fmtINR(a.availableFunds)}
              </span>
              <div className="ml-auto flex gap-2">
                <Button size="sm" onClick={() => toggleActive(a.id)}>
                  {a.active ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => removeAccount(a.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 items-end">
        <Field label="Bank">
          <Input
            placeholder="SBI"
            value={form.bank}
            onChange={(e) => setForm({ ...form, bank: e.target.value })}
          />
        </Field>
        <Field label="Broker">
          <Input
            placeholder="Zerodha"
            value={form.broker}
            onChange={(e) => setForm({ ...form, broker: e.target.value })}
          />
        </Field>
        <Field label="Available funds">
          <Input
            type="number"
            placeholder="100000"
            value={form.availableFunds}
            onChange={(e) =>
              setForm({ ...form, availableFunds: e.target.value })
            }
          />
        </Field>
        <Field label="UPI ID (optional)">
          <Input
            placeholder="name@bank"
            value={form.upiId}
            onChange={(e) => setForm({ ...form, upiId: e.target.value })}
          />
        </Field>
        <Button variant="primary" onClick={addAccount}>
          Add account
        </Button>
      </div>
    </Card>
  );
}

import React, { useMemo, useState } from "react";

import styles from "./styles.module.css";

type IPOQuota = {
  id: string;
  name: string;
  minLots: number;
  maxLots: number;
  price: number;
  lotSize: number;
  eligibility?: "eligible" | "not-eligible" | "unknown";
};

type IPO = {
  id: string;
  name: string;
  company: string;
  quotas: IPOQuota[];
};

type Person = {
  id: string;
  name: string;
};

type Account = {
  id: string;
  personId: string;
  bank: string;
  broker: string;
  available: number;
};

type Application = {
  id: string;
  personId: string;
  accountId: string;
  ipoId: string;
  quotaId: string;
  lots: number;
  status: "Draft" | "Applied" | "Mandate Pending" | "Allotted";
};

const sampleIPOs: IPO[] = [
  {
    id: "lumino",
    name: "Lumino",
    company: "Lumino Industries",
    quotas: [
      {
        id: "retail",
        name: "Retail",
        minLots: 1,
        maxLots: 13,
        price: 3731,
        lotSize: 4,
      },
      {
        id: "shni",
        name: "SHNI",
        minLots: 14,
        maxLots: 67,
        price: 3731,
        lotSize: 4,
      },
    ],
  },
  {
    id: "esds",
    name: "ESDS",
    company: "ESDS Software",
    quotas: [
      {
        id: "retail",
        name: "Retail",
        minLots: 1,
        maxLots: 13,
        price: 3646,
        lotSize: 4,
      },
      {
        id: "shareholder",
        name: "Shareholder",
        minLots: 1,
        maxLots: 10,
        price: 3646,
        lotSize: 4,
      },
    ],
  },
];

const samplePeople: Person[] = [
  { id: "rahul", name: "Rahul" },
  { id: "kiran", name: "Kiran" },
  { id: "miral", name: "Miral" },
];

const sampleAccounts: Account[] = [
  {
    id: "sbi-zerodha",
    personId: "rahul",
    bank: "SBI",
    broker: "Zerodha",
    available: 100000,
  },
  {
    id: "hdfc-groww",
    personId: "rahul",
    bank: "HDFC",
    broker: "Groww",
    available: 50000,
  },
  {
    id: "icici-zerodha",
    personId: "kiran",
    bank: "ICICI",
    broker: "Zerodha",
    available: 300000,
  },
];

const sampleStatuses: Application["status"][] = [
  "Draft",
  "Applied",
  "Mandate Pending",
  "Allotted",
];

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const IPOPlannerPrototype = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedPerson, setSelectedPerson] = useState(
    samplePeople[0]?.id ?? "",
  );
  const [selectedAccount, setSelectedAccount] = useState(
    sampleAccounts[0]?.id ?? "",
  );
  const [selectedIPO, setSelectedIPO] = useState(sampleIPOs[0]?.id ?? "");
  const [selectedQuota, setSelectedQuota] = useState(
    sampleIPOs[0]?.quotas[0]?.id ?? "",
  );
  const [lots, setLots] = useState(1);
  const [status, setStatus] = useState<Application["status"]>("Draft");
  const [notes, setNotes] = useState("");

  const totals = useMemo(() => {
    const required = applications.reduce((sum, app) => {
      const ipo = sampleIPOs.find((item) => item.id === app.ipoId);
      const quota = ipo?.quotas.find((q) => q.id === app.quotaId);
      if (!ipo || !quota) {
        return sum;
      }
      return sum + quota.price * quota.lotSize * app.lots;
    }, 0);

    const available = sampleAccounts.reduce(
      (sum, acc) => sum + acc.available,
      0,
    );
    const remaining = available - required;

    return { required, available, remaining };
  }, [applications]);

  const availableAccounts = useMemo(
    () => sampleAccounts.filter((acc) => acc.personId === selectedPerson),
    [selectedPerson],
  );

  const ipoOptions = useMemo(() => sampleIPOs, []);

  const quotaOptions = useMemo(() => {
    const ipo = sampleIPOs.find((item) => item.id === selectedIPO);
    return ipo?.quotas ?? [];
  }, [selectedIPO]);

  const groupedApplications = useMemo(() => {
    return applications.map((app) => {
      const person = samplePeople.find((p) => p.id === app.personId);
      const account = sampleAccounts.find((acc) => acc.id === app.accountId);
      const ipo = sampleIPOs.find((ipo) => ipo.id === app.ipoId);
      const quota = ipo?.quotas.find((q) => q.id === app.quotaId);
      const amount = quota ? quota.price * quota.lotSize * app.lots : 0;

      return {
        ...app,
        personName: person?.name ?? "Unknown",
        accountLabel: account
          ? `${account.bank} → ${account.broker}`
          : "Unknown",
        ipoName: ipo?.name ?? "Unknown",
        quotaName: quota?.name ?? "Unknown",
        amount,
        status: app.status,
      };
    });
  }, [applications]);

  const addApplication = () => {
    const quota = quotaOptions.find((q) => q.id === selectedQuota);
    if (!selectedPerson || !selectedAccount || !selectedIPO || !quota) {
      return;
    }
    const clampedLots = Math.min(Math.max(lots, quota.minLots), quota.maxLots);
    const newApplication: Application = {
      id: crypto.randomUUID(),
      personId: selectedPerson,
      accountId: selectedAccount,
      ipoId: selectedIPO,
      quotaId: selectedQuota,
      lots: clampedLots,
      status,
    };
    setApplications((prev) => [...prev, newApplication]);
    setNotes("");
  };

  return (
    <section className={styles.shell}>
      <header className={styles.header}>
        <div>
          <p className={styles.label}>Playground</p>
          <h2>IPO Application Planner</h2>
          <p className={styles.subtitle}>
            Prototype view to test the core IPO planning primitives.
          </p>
        </div>
        <div className={styles.metrics}>
          <div>
            <span className={styles.metricLabel}>Required</span>
            <strong>{formatCurrency(totals.required)}</strong>
          </div>
          <div>
            <span className={styles.metricLabel}>Available</span>
            <strong>{formatCurrency(totals.available)}</strong>
          </div>
          <div>
            <span className={styles.metricLabel}>Remaining</span>
            <strong
              className={totals.remaining >= 0 ? styles.good : styles.bad}
            >
              {formatCurrency(totals.remaining)}
            </strong>
          </div>
        </div>
      </header>

      <div className={styles.columns}>
        <div className={styles.column}>
          <h3>Add Application</h3>
          <div className={styles.formGrid}>
            <label>
              <span>Person</span>
              <select
                value={selectedPerson}
                onChange={(evt) => setSelectedPerson(evt.target.value)}
              >
                {samplePeople.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Account</span>
              <select
                value={selectedAccount}
                onChange={(evt) => setSelectedAccount(evt.target.value)}
              >
                {availableAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.bank} → {account.broker}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>IPO</span>
              <select
                value={selectedIPO}
                onChange={(evt) => setSelectedIPO(evt.target.value)}
              >
                {ipoOptions.map((ipo) => (
                  <option key={ipo.id} value={ipo.id}>
                    {ipo.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Quota</span>
              <select
                value={selectedQuota}
                onChange={(evt) => setSelectedQuota(evt.target.value)}
              >
                {quotaOptions.map((quota) => (
                  <option key={quota.id} value={quota.id}>
                    {quota.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Lots</span>
              <input
                type="number"
                value={lots}
                min={1}
                onChange={(evt) => setLots(Number(evt.target.value))}
              />
            </label>
            <label>
              <span>Status</span>
              <select
                value={status}
                onChange={(evt) =>
                  setStatus(evt.target.value as Application["status"])
                }
              >
                {sampleStatuses.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.noteField}>
              <span>Notes</span>
              <textarea
                value={notes}
                onChange={(evt) => setNotes(evt.target.value)}
                placeholder="UPI, eligibility, reminders ..."
              />
            </label>
          </div>
          <button className={styles.primaryButton} onClick={addApplication}>
            Add application
          </button>
          {quotaOptions.length > 0 && (
            <div className={styles.hintCard}>
              <strong>{quotaOptions[0].name}</strong>
              <span>
                {quotaOptions[0].minLots}–{quotaOptions[0].maxLots} lots · Lot
                size {quotaOptions[0].lotSize} · ₹{quotaOptions[0].price}
              </span>
            </div>
          )}
        </div>

        <div className={styles.column}>
          <h3>Applications</h3>
          {applications.length === 0 ? (
            <p className={styles.columnHint}>
              No applications yet — add your first one on the left.
            </p>
          ) : (
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <span>Person</span>
                <span>Account</span>
                <span>IPO</span>
                <span>Quota</span>
                <span>Lots</span>
                <span>Status</span>
                <span>Amount</span>
              </div>
              {groupedApplications.map((app) => (
                <div key={app.id} className={styles.tableRow}>
                  <span>{app.personName}</span>
                  <span>{app.accountLabel}</span>
                  <span>{app.ipoName}</span>
                  <span>{app.quotaName}</span>
                  <span>{app.lots}</span>
                  <span>{app.status}</span>
                  <strong>{formatCurrency(app.amount)}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default IPOPlannerPrototype;

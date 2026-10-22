import React, { useCallback, useEffect, useMemo, useState } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";

import styles from "./styles.module.css";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

type Eligibility = "eligible" | "not-eligible" | "unknown";

type Person = { id: string; name: string; active: boolean };

type Account = {
  id: string;
  personId: string;
  bank: string;
  broker: string;
  availableFunds: number;
  active: boolean;
};

type Quota = {
  id: string;
  name: string;
  minLots: number;
  maxLots: number;
  eligibility: Eligibility;
};

type IPO = {
  id: string;
  name: string;
  price: number;
  lotSize: number;
  quotas: Quota[];
  archived: boolean;
};

type ApplicationStatus =
  | "draft"
  | "applied"
  | "mandate-pending"
  | "allotted"
  | "not-allotted";

type Application = {
  id: string;
  accountId: string;
  ipoId: string;
  quotaId: string;
  lots: number;
  amount: number;
  status: ApplicationStatus;
};

type AppData = {
  people: Person[];
  accounts: Account[];
  ipos: IPO[];
  applications: Application[];
};

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "ipo-planner-docs:v1";

const uid = (p = "id") =>
  `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

const fmt = (n: number) =>
  "₹" + Math.round(Number.isFinite(n) ? n : 0).toLocaleString("en-IN");

const appAmount = (ipo: IPO, lots: number) => ipo.price * ipo.lotSize * lots;

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: "Draft",
  applied: "Applied",
  "mandate-pending": "Mandate Pending",
  allotted: "Allotted",
  "not-allotted": "Not Allotted",
};

/* ------------------------------------------------------------------ */
/* Sample data                                                        */
/* ------------------------------------------------------------------ */

const SAMPLE: AppData = {
  people: [
    { id: "p_rahul", name: "Rahul", active: true },
    { id: "p_kiran", name: "Kiran", active: true },
    { id: "p_naren", name: "Narendra", active: true },
    { id: "p_miral", name: "Miral", active: true },
  ],
  accounts: [
    {
      id: "a1",
      personId: "p_rahul",
      bank: "SBI",
      broker: "Zerodha",
      availableFunds: 100000,
      active: true,
    },
    {
      id: "a2",
      personId: "p_rahul",
      bank: "HDFC",
      broker: "Groww",
      availableFunds: 50000,
      active: true,
    },
    {
      id: "a3",
      personId: "p_kiran",
      bank: "ICICI",
      broker: "Zerodha",
      availableFunds: 300000,
      active: true,
    },
    {
      id: "a4",
      personId: "p_naren",
      bank: "ICICI",
      broker: "Groww",
      availableFunds: 250000,
      active: true,
    },
    {
      id: "a5",
      personId: "p_miral",
      bank: "Axis",
      broker: "Upstox",
      availableFunds: 200000,
      active: true,
    },
  ],
  ipos: [
    {
      id: "i_lumino",
      name: "Lumino",
      price: 3731,
      lotSize: 4,
      archived: false,
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
    },
    {
      id: "i_esds",
      name: "ESDS",
      price: 3646,
      lotSize: 4,
      archived: false,
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
    },
  ],
  applications: [],
};

const EMPTY: AppData = { people: [], accounts: [], ipos: [], applications: [] };

/* ------------------------------------------------------------------ */
/* Optimizer                                                          */
/* ------------------------------------------------------------------ */

type OptConfig = { ipoId: string; quotaId: string; lots: number };

type PlannedApp = {
  accountId: string;
  personId: string;
  ipoId: string;
  quotaId: string;
  lots: number;
  amount: number;
  label: string;
};

type Solution = {
  id: string;
  title: string;
  description: string;
  applications: PlannedApp[];
  totalAmount: number;
  totalApplications: number;
  budgetLeft: number;
};

function buildCandidates(
  data: AppData,
  accountIds: string[],
  configs: OptConfig[],
): PlannedApp[] {
  const out: PlannedApp[] = [];
  for (const accId of accountIds) {
    const acc = data.accounts.find((a) => a.id === accId);
    if (!acc || !acc.active) continue;
    for (const cfg of configs) {
      const ipo = data.ipos.find((i) => i.id === cfg.ipoId);
      if (!ipo || ipo.archived) continue;
      const quota = ipo.quotas.find((q) => q.id === cfg.quotaId);
      if (!quota) continue;
      const lots = Math.max(cfg.lots, quota.minLots);
      const amount = appAmount(ipo, lots);
      const person = data.people.find((p) => p.id === acc.personId);
      out.push({
        accountId: acc.id,
        personId: acc.personId,
        ipoId: ipo.id,
        quotaId: quota.id,
        lots,
        amount,
        label: `${person?.name ?? "?"} · ${acc.bank}/${acc.broker} · ${ipo.name} · ${quota.name} · ${lots} lot(s)`,
      });
    }
  }
  return out;
}

function roundRobin(sorted: PlannedApp[]): PlannedApp[] {
  const byPerson = new Map<string, PlannedApp[]>();
  for (const c of sorted) {
    const arr = byPerson.get(c.personId) ?? [];
    arr.push(c);
    byPerson.set(c.personId, arr);
  }
  const buckets = Array.from(byPerson.values());
  const out: PlannedApp[] = [];
  let i = 0;
  let added = true;
  while (added) {
    added = false;
    for (const b of buckets) {
      if (i < b.length) {
        out.push(b[i]);
        added = true;
      }
    }
    i++;
  }
  return out;
}

function optimize(
  data: AppData,
  opts: {
    totalBudget?: number;
    accountIds: string[];
    configs: OptConfig[];
    oneAppPerPersonPerIpo: boolean;
  },
): Solution[] {
  const candidates = buildCandidates(data, opts.accountIds, opts.configs);
  if (candidates.length === 0) return [];

  const accountFunds = new Map<string, number>();
  for (const id of opts.accountIds) {
    const acc = data.accounts.find((a) => a.id === id);
    accountFunds.set(id, acc ? acc.availableFunds : 0);
  }
  const globalBudget =
    opts.totalBudget != null && opts.totalBudget > 0
      ? opts.totalBudget
      : Array.from(accountFunds.values()).reduce((s, v) => s + v, 0);

  const strategies: {
    title: string;
    desc: string;
    sorter: (a: PlannedApp, b: PlannedApp) => number;
    rr?: boolean;
  }[] = [
    {
      title: "Max applications (cheapest first)",
      desc: "Fits the most applications by preferring lower-cost ones.",
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Max capital deployed",
      desc: "Uses as much of your budget as possible, biggest first.",
      sorter: (a, b) => b.amount - a.amount,
    },
    {
      title: "Spread across people",
      desc: "Rotates across people/accounts for wider coverage.",
      sorter: (a, b) => a.amount - b.amount,
      rr: true,
    },
  ];

  const solutions: Solution[] = [];
  strategies.forEach((strat, idx) => {
    const funds = new Map(accountFunds);
    let budget = globalBudget;
    let ordered = [...candidates].sort(strat.sorter);
    if (strat.rr) ordered = roundRobin(ordered);
    const chosen: PlannedApp[] = [];
    const usedPersonIpo = new Set<string>();
    const seenAccountIpo = new Set<string>();

    for (const c of ordered) {
      const key = `${c.personId}|${c.ipoId}`;
      if (opts.oneAppPerPersonPerIpo && usedPersonIpo.has(key)) continue;
      const acctIpo = `${c.accountId}|${c.ipoId}`;
      if (seenAccountIpo.has(acctIpo)) continue;
      const avail = funds.get(c.accountId) ?? 0;
      if (c.amount > avail || c.amount > budget) continue;
      funds.set(c.accountId, avail - c.amount);
      budget -= c.amount;
      usedPersonIpo.add(key);
      seenAccountIpo.add(acctIpo);
      chosen.push(c);
    }
    const totalAmount = chosen.reduce((s, a) => s + a.amount, 0);
    solutions.push({
      id: `sol_${idx}`,
      title: strat.title,
      description: strat.desc,
      applications: chosen,
      totalAmount,
      totalApplications: chosen.length,
      budgetLeft: globalBudget - totalAmount,
    });
  });

  const seen = new Set<string>();
  const unique = solutions.filter((s) => {
    const sig = s.applications
      .map((a) => `${a.accountId}:${a.ipoId}:${a.lots}`)
      .sort()
      .join("|");
    if (seen.has(sig)) return false;
    seen.add(sig);
    return true;
  });
  return unique.sort(
    (a, b) =>
      b.totalApplications - a.totalApplications ||
      b.totalAmount - a.totalAmount,
  );
}

/* ------------------------------------------------------------------ */
/* Store hook                                                         */
/* ------------------------------------------------------------------ */

function useStore() {
  const [data, setData] = useState<AppData>(SAMPLE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        setData({
          people: p.people ?? [],
          accounts: p.accounts ?? [],
          ipos: p.ipos ?? [],
          applications: p.applications ?? [],
        });
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, [data, ready]);

  const update = useCallback(
    (fn: (d: AppData) => AppData) => setData((d) => fn(d)),
    [],
  );
  const replaceAll = useCallback((d: AppData) => setData(d), []);
  return { data, update, replaceAll };
}

/* ------------------------------------------------------------------ */
/* Main component                                                     */
/* ------------------------------------------------------------------ */

type Tab = "optimizer" | "people" | "ipos" | "applications";

function Planner() {
  const { data, update, replaceAll } = useStore();
  const [tab, setTab] = useState<Tab>("optimizer");

  return (
    <div className={styles.shell}>
      <div className={styles.header}>
        <div>
          <div className={styles.label}>Interactive demo</div>
          <h3 style={{ margin: "0.25rem 0 0" }}>IPO Application Planner</h3>
          <p className={styles.subtitle} style={{ marginBottom: 0 }}>
            Edit people, accounts and IPOs, then let the optimizer suggest the
            best way to apply within your budget. Saved in your browser.
          </p>
        </div>
        <div className={styles.toolbar}>
          <button className={styles.btn} onClick={() => replaceAll(SAMPLE)}>
            Reset sample
          </button>
          <button
            className={styles.btn}
            onClick={() => {
              if (confirm("Clear all data?")) replaceAll(EMPTY);
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <div className={styles.tabs}>
        {(
          [
            ["optimizer", "Optimizer"],
            ["people", "People & Accounts"],
            ["ipos", "IPOs"],
            ["applications", "Applications"],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            className={`${styles.tab} ${tab === id ? styles.tabActive : ""}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "optimizer" && <OptimizerTab data={data} update={update} />}
      {tab === "people" && <PeopleTab data={data} update={update} />}
      {tab === "ipos" && <IposTab data={data} update={update} />}
      {tab === "applications" && (
        <ApplicationsTab data={data} update={update} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Optimizer tab                                                      */
/* ------------------------------------------------------------------ */

function OptimizerTab({
  data,
  update,
}: {
  data: AppData;
  update: (fn: (d: AppData) => AppData) => void;
}) {
  const activeIpos = data.ipos.filter((i) => !i.archived);
  const activeAccounts = data.accounts.filter((a) => a.active);

  const [useAccountFunds, setUseAccountFunds] = useState(true);
  const [budget, setBudget] = useState("");
  const [oneApp, setOneApp] = useState(true);
  const [accountIds, setAccountIds] = useState<string[]>(
    activeAccounts.map((a) => a.id),
  );
  const [configs, setConfigs] = useState<OptConfig[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [applied, setApplied] = useState<string | null>(null);

  const toggleAccount = (id: string) =>
    setAccountIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    );

  const toggleQuota = (ipoId: string, quotaId: string, lots: number) =>
    setConfigs((cfgs) => {
      const exists = cfgs.find(
        (c) => c.ipoId === ipoId && c.quotaId === quotaId,
      );
      return exists
        ? cfgs.filter((c) => !(c.ipoId === ipoId && c.quotaId === quotaId))
        : [...cfgs, { ipoId, quotaId, lots }];
    });

  const setLots = (ipoId: string, quotaId: string, lots: number) =>
    setConfigs((cfgs) =>
      cfgs.map((c) =>
        c.ipoId === ipoId && c.quotaId === quotaId ? { ...c, lots } : c,
      ),
    );

  const selectedBudget = useMemo(() => {
    if (!useAccountFunds && budget) return Number(budget);
    return accountIds.reduce(
      (s, id) =>
        s + (data.accounts.find((a) => a.id === id)?.availableFunds ?? 0),
      0,
    );
  }, [useAccountFunds, budget, accountIds, data.accounts]);

  const run = () => {
    setSolutions(
      optimize(data, {
        totalBudget: !useAccountFunds && budget ? Number(budget) : undefined,
        accountIds,
        configs,
        oneAppPerPersonPerIpo: oneApp,
      }),
    );
    setApplied(null);
  };

  const applySolution = (sol: Solution) => {
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
  };

  const canRun = accountIds.length > 0 && configs.length > 0;

  return (
    <div className={styles.stack}>
      <section className={styles.card}>
        <strong>1. Budget</strong>
        <div className={styles.row} style={{ marginTop: "0.5rem" }}>
          <label className={styles.inline}>
            <input
              type="radio"
              checked={useAccountFunds}
              onChange={() => setUseAccountFunds(true)}
            />
            Use each account&apos;s funds
          </label>
          <label className={styles.inline}>
            <input
              type="radio"
              checked={!useAccountFunds}
              onChange={() => setUseAccountFunds(false)}
            />
            Single total budget
          </label>
          {!useAccountFunds && (
            <input
              className={styles.input}
              style={{ width: 160 }}
              type="number"
              placeholder="Total ₹"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          )}
          <span className={styles.badge}>Budget: {fmt(selectedBudget)}</span>
        </div>
        <label className={styles.inline} style={{ marginTop: "0.5rem" }}>
          <input
            type="checkbox"
            checked={oneApp}
            onChange={(e) => setOneApp(e.target.checked)}
          />
          Max one application per person per IPO
        </label>
      </section>

      <section className={styles.card}>
        <strong>2. Accounts to use</strong>
        <div className={styles.chips}>
          {activeAccounts.map((a) => {
            const p = data.people.find((x) => x.id === a.personId);
            const on = accountIds.includes(a.id);
            return (
              <button
                key={a.id}
                className={`${styles.chip} ${on ? styles.chipOn : ""}`}
                onClick={() => toggleAccount(a.id)}
              >
                {p?.name} · {a.bank}/{a.broker} · {fmt(a.availableFunds)}
              </button>
            );
          })}
          {activeAccounts.length === 0 && (
            <span className={styles.muted}>No active accounts.</span>
          )}
        </div>
      </section>

      <section className={styles.card}>
        <strong>3. IPOs &amp; quotas</strong>
        <div className={styles.stack} style={{ marginTop: "0.5rem" }}>
          {activeIpos.map((ipo) => (
            <div key={ipo.id}>
              <div className={styles.ipoName}>
                {ipo.name}{" "}
                <span className={styles.muted}>
                  (1 lot = {fmt(ipo.price * ipo.lotSize)})
                </span>
              </div>
              <div className={styles.chips}>
                {ipo.quotas.map((q) => {
                  const cfg = configs.find(
                    (c) => c.ipoId === ipo.id && c.quotaId === q.id,
                  );
                  const on = !!cfg;
                  const lots = cfg?.lots ?? q.minLots;
                  return (
                    <div
                      key={q.id}
                      className={`${styles.quotaChip} ${on ? styles.quotaOn : ""}`}
                    >
                      <label className={styles.inline}>
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => toggleQuota(ipo.id, q.id, q.minLots)}
                        />
                        {q.name}
                      </label>
                      {on && (
                        <>
                          <span className={styles.muted}>lots</span>
                          <input
                            className={styles.input}
                            style={{ width: 56 }}
                            type="number"
                            min={q.minLots}
                            max={q.maxLots || undefined}
                            value={lots}
                            onChange={(e) =>
                              setLots(
                                ipo.id,
                                q.id,
                                Number(e.target.value) || q.minLots,
                              )
                            }
                          />
                          <span className={styles.muted}>
                            ={fmt(appAmount(ipo, lots))}
                          </span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {activeIpos.length === 0 && (
            <span className={styles.muted}>No active IPOs.</span>
          )}
        </div>
      </section>

      <button className={styles.btnPrimary} disabled={!canRun} onClick={run}>
        Calculate optimal plans
      </button>

      {solutions.length > 0 && (
        <div className={styles.stack}>
          <strong>Suggested plans — choose one</strong>
          {solutions.map((sol) => (
            <section key={sol.id} className={styles.card}>
              <div className={styles.header}>
                <div>
                  <strong>{sol.title}</strong>
                  <p className={styles.muted} style={{ margin: "0.25rem 0 0" }}>
                    {sol.description}
                  </p>
                </div>
                <button
                  className={styles.btnPrimary}
                  disabled={applied === sol.id}
                  onClick={() => applySolution(sol)}
                >
                  {applied === sol.id ? "Applied ✓" : "Use this plan"}
                </button>
              </div>
              <div className={styles.metrics}>
                <Metric
                  label="Applications"
                  value={String(sol.totalApplications)}
                />
                <Metric label="Capital used" value={fmt(sol.totalAmount)} />
                <Metric label="Budget left" value={fmt(sol.budgetLeft)} />
              </div>
              {sol.applications.length === 0 ? (
                <p className={styles.muted}>Nothing fits this budget.</p>
              ) : (
                <ul className={styles.planList}>
                  {sol.applications.map((a, i) => (
                    <li key={i}>
                      <span>{a.label}</span>
                      <strong>{fmt(a.amount)}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.metric}>
      <span className={styles.label}>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* People & Accounts tab                                              */
/* ------------------------------------------------------------------ */

function PeopleTab({
  data,
  update,
}: {
  data: AppData;
  update: (fn: (d: AppData) => AppData) => void;
}) {
  const [name, setName] = useState("");

  const addPerson = () => {
    if (!name.trim()) return;
    update((d) => ({
      ...d,
      people: [...d.people, { id: uid("p"), name: name.trim(), active: true }],
    }));
    setName("");
  };
  const removePerson = (id: string) =>
    update((d) => ({
      ...d,
      people: d.people.filter((p) => p.id !== id),
      accounts: d.accounts.filter((a) => a.personId !== id),
    }));

  return (
    <div className={styles.stack}>
      <section className={styles.card}>
        <strong>Add person</strong>
        <div className={styles.row} style={{ marginTop: "0.5rem" }}>
          <input
            className={styles.input}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addPerson()}
          />
          <button className={styles.btnPrimary} onClick={addPerson}>
            Add
          </button>
        </div>
      </section>

      {data.people.map((person) => (
        <PersonCard
          key={person.id}
          person={person}
          data={data}
          update={update}
          onRemove={() => removePerson(person.id)}
        />
      ))}
      {data.people.length === 0 && (
        <p className={styles.muted}>No people yet.</p>
      )}
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
  });

  const addAccount = () => {
    if (!form.bank.trim() || !form.broker.trim()) return;
    update((d) => ({
      ...d,
      accounts: [
        ...d.accounts,
        {
          id: uid("acc"),
          personId: person.id,
          bank: form.bank.trim(),
          broker: form.broker.trim(),
          availableFunds: Number(form.availableFunds) || 0,
          active: true,
        },
      ],
    }));
    setForm({ bank: "", broker: "", availableFunds: "" });
  };
  const setFunds = (id: string, val: number) =>
    update((d) => ({
      ...d,
      accounts: d.accounts.map((a) =>
        a.id === id ? { ...a, availableFunds: val } : a,
      ),
    }));
  const removeAccount = (id: string) =>
    update((d) => ({
      ...d,
      accounts: d.accounts.filter((a) => a.id !== id),
      applications: d.applications.filter((ap) => ap.accountId !== id),
    }));

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <strong>{person.name}</strong>
        <button className={styles.btnDanger} onClick={onRemove}>
          Delete person
        </button>
      </div>
      {accounts.map((a) => (
        <div
          key={a.id}
          className={styles.row}
          style={{ alignItems: "center", marginTop: "0.5rem" }}
        >
          <span>
            {a.bank} → {a.broker}
          </span>
          <input
            className={styles.input}
            style={{ width: 120 }}
            type="number"
            value={a.availableFunds}
            onChange={(e) => setFunds(a.id, Number(e.target.value) || 0)}
          />
          <span className={styles.muted}>{fmt(a.availableFunds)}</span>
          <button
            className={styles.btnDanger}
            style={{ marginLeft: "auto" }}
            onClick={() => removeAccount(a.id)}
          >
            Remove
          </button>
        </div>
      ))}
      <div
        className={styles.row}
        style={{ marginTop: "0.5rem", alignItems: "flex-end" }}
      >
        <input
          className={styles.input}
          style={{ width: 110 }}
          placeholder="Bank"
          value={form.bank}
          onChange={(e) => setForm({ ...form, bank: e.target.value })}
        />
        <input
          className={styles.input}
          style={{ width: 110 }}
          placeholder="Broker"
          value={form.broker}
          onChange={(e) => setForm({ ...form, broker: e.target.value })}
        />
        <input
          className={styles.input}
          style={{ width: 120 }}
          type="number"
          placeholder="Funds"
          value={form.availableFunds}
          onChange={(e) => setForm({ ...form, availableFunds: e.target.value })}
        />
        <button className={styles.btn} onClick={addAccount}>
          Add account
        </button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* IPOs tab                                                           */
/* ------------------------------------------------------------------ */

function IposTab({
  data,
  update,
}: {
  data: AppData;
  update: (fn: (d: AppData) => AppData) => void;
}) {
  const [form, setForm] = useState({ name: "", price: "", lotSize: "" });
  const [quotas, setQuotas] = useState<Quota[]>([
    {
      id: uid("q"),
      name: "Small",
      minLots: 1,
      maxLots: 13,
      eligibility: "eligible",
    },
    {
      id: uid("q"),
      name: "SHNI",
      minLots: 14,
      maxLots: 67,
      eligibility: "eligible",
    },
  ]);

  const addIpo = () => {
    if (!form.name.trim() || !form.price || !form.lotSize) return;
    update((d) => ({
      ...d,
      ipos: [
        ...d.ipos,
        {
          id: uid("ipo"),
          name: form.name.trim(),
          price: Number(form.price),
          lotSize: Number(form.lotSize),
          archived: false,
          quotas: quotas
            .filter((q) => q.name.trim())
            .map((q) => ({ ...q, id: uid("q") })),
        },
      ],
    }));
    setForm({ name: "", price: "", lotSize: "" });
    setQuotas([
      {
        id: uid("q"),
        name: "Small",
        minLots: 1,
        maxLots: 13,
        eligibility: "eligible",
      },
      {
        id: uid("q"),
        name: "SHNI",
        minLots: 14,
        maxLots: 67,
        eligibility: "eligible",
      },
    ]);
  };
  const removeIpo = (id: string) =>
    update((d) => ({
      ...d,
      ipos: d.ipos.filter((i) => i.id !== id),
      applications: d.applications.filter((a) => a.ipoId !== id),
    }));
  const toggleArchive = (id: string) =>
    update((d) => ({
      ...d,
      ipos: d.ipos.map((i) =>
        i.id === id ? { ...i, archived: !i.archived } : i,
      ),
    }));

  return (
    <div className={styles.stack}>
      <section className={styles.card}>
        <strong>Add IPO</strong>
        <div className={styles.row} style={{ marginTop: "0.5rem" }}>
          <input
            className={styles.input}
            style={{ width: 130 }}
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className={styles.input}
            style={{ width: 110 }}
            type="number"
            placeholder="Price ₹"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            className={styles.input}
            style={{ width: 90 }}
            type="number"
            placeholder="Lot size"
            value={form.lotSize}
            onChange={(e) => setForm({ ...form, lotSize: e.target.value })}
          />
        </div>
        <div className={styles.muted} style={{ margin: "0.5rem 0 0.25rem" }}>
          Quotas
        </div>
        {quotas.map((q, idx) => (
          <div
            key={q.id}
            className={styles.row}
            style={{ marginBottom: "0.25rem" }}
          >
            <input
              className={styles.input}
              style={{ width: 120 }}
              placeholder="Quota"
              value={q.name}
              onChange={(e) =>
                setQuotas((qs) =>
                  qs.map((x, i) =>
                    i === idx ? { ...x, name: e.target.value } : x,
                  ),
                )
              }
            />
            <input
              className={styles.input}
              style={{ width: 80 }}
              type="number"
              placeholder="min"
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
            <input
              className={styles.input}
              style={{ width: 80 }}
              type="number"
              placeholder="max"
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
            <button
              className={styles.btnDanger}
              onClick={() => setQuotas((qs) => qs.filter((_, i) => i !== idx))}
            >
              ✕
            </button>
          </div>
        ))}
        <div className={styles.row} style={{ marginTop: "0.25rem" }}>
          <button
            className={styles.btn}
            onClick={() =>
              setQuotas((q) => [
                ...q,
                {
                  id: uid("q"),
                  name: "",
                  minLots: 1,
                  maxLots: 0,
                  eligibility: "eligible",
                },
              ])
            }
          >
            + Quota
          </button>
          <button className={styles.btnPrimary} onClick={addIpo}>
            Save IPO
          </button>
        </div>
      </section>

      {data.ipos.map((ipo) => (
        <section key={ipo.id} className={styles.card}>
          <div className={styles.header}>
            <strong>
              {ipo.name}{" "}
              {ipo.archived && <span className={styles.badge}>archived</span>}
            </strong>
            <div className={styles.row}>
              <button
                className={styles.btn}
                onClick={() => toggleArchive(ipo.id)}
              >
                {ipo.archived ? "Reopen" : "Archive"}
              </button>
              <button
                className={styles.btnDanger}
                onClick={() => removeIpo(ipo.id)}
              >
                Delete
              </button>
            </div>
          </div>
          <div className={styles.muted} style={{ marginTop: "0.25rem" }}>
            {fmt(ipo.price)} × {ipo.lotSize} = {fmt(ipo.price * ipo.lotSize)} /
            lot
          </div>
          <div className={styles.chips}>
            {ipo.quotas.map((q) => (
              <span key={q.id} className={styles.badge}>
                {q.name}: {q.minLots}-{q.maxLots || "∞"} lots
              </span>
            ))}
          </div>
        </section>
      ))}
      {data.ipos.length === 0 && <p className={styles.muted}>No IPOs yet.</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Applications tab                                                   */
/* ------------------------------------------------------------------ */

function ApplicationsTab({
  data,
  update,
}: {
  data: AppData;
  update: (fn: (d: AppData) => AppData) => void;
}) {
  const removeApp = (id: string) =>
    update((d) => ({
      ...d,
      applications: d.applications.filter((a) => a.id !== id),
    }));
  const setStatus = (id: string, status: ApplicationStatus) =>
    update((d) => ({
      ...d,
      applications: d.applications.map((a) =>
        a.id === id ? { ...a, status } : a,
      ),
    }));

  const total = data.applications.reduce((s, a) => s + a.amount, 0);

  return (
    <div className={styles.stack}>
      <section className={styles.card}>
        <div className={styles.header}>
          <strong>Applications ({data.applications.length})</strong>
          <span className={styles.badge}>Total: {fmt(total)}</span>
        </div>
        {data.applications.length === 0 ? (
          <p className={styles.muted}>
            No applications. Use the Optimizer and click “Use this plan”.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Account</th>
                  <th>IPO</th>
                  <th>Quota</th>
                  <th style={{ textAlign: "right" }}>Lots</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.applications.map((app) => {
                  const acc = data.accounts.find((a) => a.id === app.accountId);
                  const p = data.people.find((x) => x.id === acc?.personId);
                  const ipo = data.ipos.find((x) => x.id === app.ipoId);
                  const q = ipo?.quotas.find((x) => x.id === app.quotaId);
                  return (
                    <tr key={app.id}>
                      <td>{p?.name}</td>
                      <td>
                        {acc?.bank}/{acc?.broker}
                      </td>
                      <td>{ipo?.name}</td>
                      <td>{q?.name}</td>
                      <td style={{ textAlign: "right" }}>{app.lots}</td>
                      <td style={{ textAlign: "right" }}>{fmt(app.amount)}</td>
                      <td>
                        <select
                          className={styles.input}
                          value={app.status}
                          onChange={(e) =>
                            setStatus(
                              app.id,
                              e.target.value as ApplicationStatus,
                            )
                          }
                        >
                          {(
                            Object.keys(STATUS_LABELS) as ApplicationStatus[]
                          ).map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABELS[s]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          className={styles.btnDanger}
                          onClick={() => removeApp(app.id)}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Export (BrowserOnly guards localStorage/window during SSR)         */
/* ------------------------------------------------------------------ */

export default function IPOPlanner() {
  return (
    <BrowserOnly
      fallback={<div className={styles.shell}>Loading planner…</div>}
    >
      {() => <Planner />}
    </BrowserOnly>
  );
}

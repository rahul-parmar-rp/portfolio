import type { AppData, Account, IPO, Application } from "../types";

export function fmtINR(n: number): string {
  if (!isFinite(n)) return "₹0";
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

/** Amount for one application = price * lotSize * lots */
export function applicationAmount(ipo: IPO, lots: number): number {
  return ipo.price * ipo.lotSize * lots;
}

export function sharesForLots(ipo: IPO, lots: number): number {
  return ipo.lotSize * lots;
}

export interface AppValidation {
  errors: string[];
  warnings: string[];
}

export function validateApplication(
  data: AppData,
  app: Pick<Application, "accountId" | "ipoId" | "quotaId" | "lots"> & {
    id?: string;
  },
): AppValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  const account = data.accounts.find((a) => a.id === app.accountId);
  const ipo = data.ipos.find((i) => i.id === app.ipoId);
  const quota = ipo?.quotas.find((q) => q.id === app.quotaId);

  if (!account) errors.push("Account not found.");
  if (!ipo) errors.push("IPO not found.");
  if (!quota) errors.push("Quota not found.");
  if (!account || !ipo || !quota) return { errors, warnings };

  if (account.active === false) warnings.push("Account is inactive.");
  if (ipo.archived) warnings.push("IPO is archived/closed.");
  if (!ipo.price) errors.push("IPO price is missing.");
  if (!ipo.lotSize) errors.push("IPO lot size is missing.");

  if (app.lots < quota.minLots)
    errors.push(`Minimum ${quota.minLots} lot(s) required for ${quota.name}.`);
  if (quota.maxLots > 0 && app.lots > quota.maxLots)
    errors.push(`Maximum ${quota.maxLots} lot(s) allowed for ${quota.name}.`);

  if (quota.eligibility === "not-eligible")
    warnings.push(`Marked not eligible for ${quota.name} quota.`);
  if (quota.eligibility === "unknown")
    warnings.push(`Eligibility for ${quota.name} quota is unknown.`);

  const amount = applicationAmount(ipo, app.lots);
  if (amount > account.availableFunds)
    warnings.push(
      `Requires ${fmtINR(amount)} but account has ${fmtINR(
        account.availableFunds,
      )}.`,
    );

  // duplicate person + ipo
  const samePersonApps = data.applications.filter((a) => {
    if (a.id === app.id) return false;
    if (a.ipoId !== app.ipoId) return false;
    const acc = data.accounts.find((x) => x.id === a.accountId);
    return acc?.personId === account.personId;
  });
  if (samePersonApps.length > 0)
    warnings.push("This person already has an application for this IPO.");

  return { errors, warnings };
}

export interface AccountFunding {
  account: Account;
  required: number;
  available: number;
  remaining: number;
  ok: boolean;
}

export function accountFundingView(data: AppData): AccountFunding[] {
  return data.accounts.map((account) => {
    const required = data.applications
      .filter((a) => a.accountId === account.id)
      .reduce((s, a) => s + a.amount, 0);
    return {
      account,
      required,
      available: account.availableFunds,
      remaining: account.availableFunds - required,
      ok: required <= account.availableFunds,
    };
  });
}

export function ipoRequired(data: AppData, ipoId: string): number {
  return data.applications
    .filter((a) => a.ipoId === ipoId)
    .reduce((s, a) => s + a.amount, 0);
}

/* ------------------------------------------------------------------ */
/* OPTIMIZER: given a total budget (or per-account funds) + selected  */
/* IPOs, find the best combination of applications to maximize number */
/* of applications / lots within the money available.                 */
/* ------------------------------------------------------------------ */

export interface OptimizerIPOConfig {
  ipoId: string;
  quotaId: string;
  /** target lots to apply per application in this ipo/quota */
  lots: number;
}

export interface OptimizerInput {
  /** optional global budget cap overriding sum of account funds */
  totalBudget?: number;
  /** which accounts to use */
  accountIds: string[];
  /** which ipos + quota + lots to consider */
  configs: OptimizerIPOConfig[];
  /** at most one application per person per ipo */
  oneAppPerPersonPerIpo: boolean;
}

export interface PlannedApplication {
  accountId: string;
  personId: string;
  ipoId: string;
  quotaId: string;
  lots: number;
  amount: number;
  label: string;
}

export interface OptimizerSolution {
  id: string;
  title: string;
  applications: PlannedApplication[];
  totalAmount: number;
  totalApplications: number;
  budgetLeft: number;
  description: string;
}

interface Candidate {
  accountId: string;
  personId: string;
  ipoId: string;
  quotaId: string;
  lots: number;
  amount: number;
  label: string;
}

function buildCandidates(data: AppData, input: OptimizerInput): Candidate[] {
  const out: Candidate[] = [];
  for (const accId of input.accountIds) {
    const acc = data.accounts.find((a) => a.id === accId);
    if (!acc || !acc.active) continue;
    for (const cfg of input.configs) {
      const ipo = data.ipos.find((i) => i.id === cfg.ipoId);
      if (!ipo || ipo.archived) continue;
      const quota = ipo.quotas.find((q) => q.id === cfg.quotaId);
      if (!quota) continue;
      const lots = Math.max(cfg.lots, quota.minLots);
      const amount = applicationAmount(ipo, lots);
      const person = data.people.find((p) => p.id === acc.personId);
      out.push({
        accountId: acc.id,
        personId: acc.personId,
        ipoId: ipo.id,
        quotaId: quota.id,
        lots,
        amount,
        label: `${person?.name ?? "Unknown"} · ${acc.bank}/${acc.broker} · ${
          ipo.name
        } · ${quota.name} · ${lots} lot(s)`,
      });
    }
  }
  return out;
}

/**
 * Greedy knapsack-style planner. Respects per-account funds and an
 * optional global budget. Produces a few alternative solutions sorted
 * by different objectives so the user can choose.
 */
export function optimize(
  data: AppData,
  input: OptimizerInput,
): OptimizerSolution[] {
  const candidates = buildCandidates(data, input);
  if (candidates.length === 0) return [];

  const accountFunds = new Map<string, number>();
  for (const id of input.accountIds) {
    const acc = data.accounts.find((a) => a.id === id);
    accountFunds.set(id, acc ? acc.availableFunds : 0);
  }

  const globalBudget =
    input.totalBudget != null && input.totalBudget > 0
      ? input.totalBudget
      : Array.from(accountFunds.values()).reduce((s, v) => s + v, 0);

  type Sorter = (a: Candidate, b: Candidate) => number;
  const strategies: { title: string; desc: string; sorter: Sorter }[] = [
    {
      title: "Max applications (cheapest first)",
      desc: "Fits the most IPO applications by preferring lower-cost ones.",
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Max capital deployed",
      desc: "Uses as much of your budget as possible, biggest applications first.",
      sorter: (a, b) => b.amount - a.amount,
    },
    {
      title: "Spread across people",
      desc: "Rotates across people/accounts for wider coverage.",
      sorter: (a, b) => a.amount - b.amount,
    },
  ];

  const solutions: OptimizerSolution[] = [];

  strategies.forEach((strat, idx) => {
    const funds = new Map(accountFunds);
    let budget = globalBudget;
    const sorted = [...candidates].sort(strat.sorter);
    const chosen: PlannedApplication[] = [];
    const usedPersonIpo = new Set<string>();
    const seenAccountIpo = new Set<string>();

    // round-robin ordering for "spread" strategy
    let ordered = sorted;
    if (idx === 2) {
      ordered = roundRobinByPerson(sorted);
    }

    for (const c of ordered) {
      const key = `${c.personId}|${c.ipoId}`;
      if (input.oneAppPerPersonPerIpo && usedPersonIpo.has(key)) continue;

      const acctIpoKey = `${c.accountId}|${c.ipoId}`;
      if (seenAccountIpo.has(acctIpoKey)) continue;

      const accAvail = funds.get(c.accountId) ?? 0;
      if (c.amount > accAvail) continue;
      if (c.amount > budget) continue;

      funds.set(c.accountId, accAvail - c.amount);
      budget -= c.amount;
      usedPersonIpo.add(key);
      seenAccountIpo.add(acctIpoKey);
      chosen.push({
        accountId: c.accountId,
        personId: c.personId,
        ipoId: c.ipoId,
        quotaId: c.quotaId,
        lots: c.lots,
        amount: c.amount,
        label: c.label,
      });
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

  // dedupe identical solutions
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

function roundRobinByPerson(sorted: Candidate[]): Candidate[] {
  const byPerson = new Map<string, Candidate[]>();
  for (const c of sorted) {
    const arr = byPerson.get(c.personId) ?? [];
    arr.push(c);
    byPerson.set(c.personId, arr);
  }
  const buckets = Array.from(byPerson.values());
  const out: Candidate[] = [];
  let added = true;
  let i = 0;
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

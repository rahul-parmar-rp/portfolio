import type { AppData } from "../types";
import { STATUS_LABELS } from "../types";
import { sharesForLots } from "./calc";

export function toCSV(data: AppData): string {
  const header = [
    "Person",
    "Bank",
    "Broker",
    "IPO",
    "Quota",
    "Application #",
    "Lots",
    "Shares",
    "Amount",
    "Status",
  ];
  const rows = data.applications.map((app) => {
    const acc = data.accounts.find((a) => a.id === app.accountId);
    const person = data.people.find((p) => p.id === acc?.personId);
    const ipo = data.ipos.find((i) => i.id === app.ipoId);
    const quota = ipo?.quotas.find((q) => q.id === app.quotaId);
    const shares = ipo ? sharesForLots(ipo, app.lots) : 0;
    return [
      person?.name ?? "",
      acc?.bank ?? "",
      acc?.broker ?? "",
      ipo?.name ?? "",
      quota?.name ?? "",
      app.applicationNumber ?? "",
      String(app.lots),
      String(shares),
      String(app.amount),
      STATUS_LABELS[app.status],
    ];
  });
  return [header, ...rows]
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

export function ipoSummaryText(data: AppData, ipoId: string): string {
  const ipo = data.ipos.find((i) => i.id === ipoId);
  if (!ipo) return "";
  const apps = data.applications.filter((a) => a.ipoId === ipoId);
  const lines = apps.map((app) => {
    const acc = data.accounts.find((a) => a.id === app.accountId);
    const person = data.people.find((p) => p.id === acc?.personId);
    const quota = ipo.quotas.find((q) => q.id === app.quotaId);
    return `${person?.name ?? ""} — ${acc?.bank ?? ""} — ${
      quota?.name ?? ""
    } — ₹${app.amount.toLocaleString("en-IN")}`;
  });
  const total = apps.reduce((s, a) => s + a.amount, 0);
  return `${ipo.name}\n\n${lines.join("\n")}\n\nTotal: ₹${total.toLocaleString(
    "en-IN",
  )}`;
}

export function download(filename: string, content: string, type = "text/csv") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

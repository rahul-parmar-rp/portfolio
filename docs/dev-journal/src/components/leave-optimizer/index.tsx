import React, { useEffect, useMemo, useState } from "react";

import styles from "./styles.module.css";

// Corporate Holiday & Leave Optimizer
// Fully offline: no network calls. Holidays are entered by the user and
// persisted in localStorage. The optimizer finds "bridge" leave days that
// connect weekends and holidays into the longest consecutive breaks.

type Holiday = {
  id: string;
  date: string; // yyyy-mm-dd
  name: string;
};

type BreakWindow = {
  start: string;
  end: string;
  totalDays: number;
  leaveDays: string[]; // dates that must be taken as leave
  freeDays: string[]; // weekends + holidays inside window
};

const STORAGE_KEY = "leave-optimizer:v1";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function addDays(d: Date, days: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function isWeekend(d: Date): boolean {
  const day = d.getDay();
  return day === 0 || day === 6;
}

function formatHuman(key: string): string {
  return parseKey(key).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

const DEFAULT_HOLIDAYS: Holiday[] = [
  { id: "h1", date: `${new Date().getFullYear()}-12-25`, name: "Christmas" },
  { id: "h2", date: `${new Date().getFullYear()}-12-31`, name: "New Year Eve" },
];

function loadHolidays(): Holiday[] {
  if (typeof window === "undefined") {
    return DEFAULT_HOLIDAYS;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_HOLIDAYS;
    }
    const parsed = JSON.parse(raw) as Holiday[];
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : DEFAULT_HOLIDAYS;
  } catch {
    return DEFAULT_HOLIDAYS;
  }
}

// Core optimizer.
// For each holiday, scan a small window before/after. A "break" is any run of
// consecutive non-working days (weekend or holiday). We then try to extend the
// run by spending up to `maxLeave` leave days on the working days that sit
// between/around free days, keeping only windows that beat the ratio of
// free-to-leave days.
function optimize(holidays: Holiday[], maxLeave: number): BreakWindow[] {
  if (holidays.length === 0) {
    return [];
  }

  const holidaySet = new Set(holidays.map((h) => h.date));
  const isFree = (d: Date) => isWeekend(d) || holidaySet.has(toKey(d));

  const anchors = holidays
    .map((h) => parseKey(h.date))
    .sort((a, b) => a.getTime() - b.getTime());

  const seen = new Set<string>();
  const results: BreakWindow[] = [];

  for (const anchor of anchors) {
    // Search leave placements: from start offset to end offset around anchor.
    for (let startOffset = -4; startOffset <= 0; startOffset += 1) {
      for (let endOffset = 0; endOffset <= 4; endOffset += 1) {
        const start = addDays(anchor, startOffset);
        const end = addDays(anchor, endOffset);

        const leaveDays: string[] = [];
        const freeDays: string[] = [];
        let valid = true;

        for (let cur = new Date(start); cur <= end; cur = addDays(cur, 1)) {
          const key = toKey(cur);
          if (isFree(cur)) {
            freeDays.push(key);
          } else {
            leaveDays.push(key);
          }
        }

        if (leaveDays.length === 0 || leaveDays.length > maxLeave) {
          valid = false;
        }

        // Require the window to be bookended by free days for a real "bridge".
        if (!isFree(start) || !isFree(end)) {
          valid = false;
        }

        if (!valid) {
          continue;
        }

        const totalDays =
          Math.round(
            (parseKey(toKey(end)).getTime() -
              parseKey(toKey(start)).getTime()) /
              86400000,
          ) + 1;

        const signature = `${toKey(start)}_${toKey(end)}`;
        if (seen.has(signature)) {
          continue;
        }
        seen.add(signature);

        results.push({
          start: toKey(start),
          end: toKey(end),
          totalDays,
          leaveDays,
          freeDays,
        });
      }
    }
  }

  // Best value first: most total days per leave day spent.
  return results
    .sort((a, b) => {
      const ratioA = a.totalDays / a.leaveDays.length;
      const ratioB = b.totalDays / b.leaveDays.length;
      if (ratioB !== ratioA) {
        return ratioB - ratioA;
      }
      return b.totalDays - a.totalDays;
    })
    .slice(0, 8);
}

export default function LeaveOptimizer() {
  const [holidays, setHolidays] = useState<Holiday[]>(DEFAULT_HOLIDAYS);
  const [maxLeave, setMaxLeave] = useState(3);
  const [newDate, setNewDate] = useState("");
  const [newName, setNewName] = useState("");

  // Load persisted holidays on the client only (Docusaurus SSR safe).
  useEffect(() => {
    setHolidays(loadHolidays());
  }, []);

  // Persist on every change.
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(holidays));
  }, [holidays]);

  const suggestions = useMemo(
    () => optimize(holidays, maxLeave),
    [holidays, maxLeave],
  );

  function addHoliday() {
    if (!newDate) {
      return;
    }
    setHolidays((prev) => [
      ...prev,
      {
        id: `h_${Date.now()}`,
        date: newDate,
        name: newName.trim() || "Holiday",
      },
    ]);
    setNewDate("");
    setNewName("");
  }

  function removeHoliday(id: string) {
    setHolidays((prev) => prev.filter((h) => h.id !== id));
  }

  return (
    <div className={styles.shell}>
      <div className={styles.header}>
        <span className={styles.badge}>Offline · localStorage</span>
        <h2>Holiday &amp; Leave Optimizer</h2>
        <p>
          Enter public holidays. The optimizer suggests the fewest leave days
          that create the longest consecutive breaks by bridging weekends and
          holidays. Everything runs in your browser.
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.field}>
          <label htmlFor="lo-date">Holiday date</label>
          <input
            id="lo-date"
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="lo-name">Name</label>
          <input
            id="lo-name"
            type="text"
            placeholder="e.g. Independence Day"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="lo-max">Max leave days</label>
          <input
            id="lo-max"
            type="number"
            min={1}
            max={10}
            value={maxLeave}
            onChange={(e) => setMaxLeave(Number(e.target.value) || 1)}
          />
        </div>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={addHoliday}
        >
          Add holiday
        </button>
      </div>

      <div className={styles.columns}>
        <div className={styles.panel}>
          <h3>Holidays ({holidays.length})</h3>
          {holidays.length === 0 ? (
            <p className={styles.muted}>No holidays yet. Add one above.</p>
          ) : (
            <ul className={styles.list}>
              {holidays
                .slice()
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((h) => (
                  <li key={h.id} className={styles.listItem}>
                    <span>
                      <strong>{formatHuman(h.date)}</strong> — {h.name}
                    </span>
                    <button
                      type="button"
                      className={styles.linkButton}
                      onClick={() => removeHoliday(h.id)}
                    >
                      remove
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>

        <div className={styles.panel}>
          <h3>Suggested breaks</h3>
          {suggestions.length === 0 ? (
            <p className={styles.muted}>
              No bridge opportunities found for the current holidays and leave
              limit.
            </p>
          ) : (
            <ul className={styles.list}>
              {suggestions.map((s) => (
                <li key={`${s.start}_${s.end}`} className={styles.suggestion}>
                  <div className={styles.suggestionTop}>
                    <strong>{s.totalDays} days off</strong>
                    <span className={styles.cost}>
                      {s.leaveDays.length} leave day
                      {s.leaveDays.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className={styles.range}>
                    {formatHuman(s.start)} → {formatHuman(s.end)}
                  </div>
                  <div className={styles.takeLeave}>
                    Take leave on:{" "}
                    {s.leaveDays.map((d) => formatHuman(d)).join(", ")}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

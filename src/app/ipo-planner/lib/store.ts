"use client";

import { useCallback, useEffect, useState } from "react";
import { AppData, emptyData } from "../types";

const KEY = "ipo-planner:data:v1";

function load(): AppData {
  if (typeof window === "undefined") return emptyData;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyData;
    const parsed = JSON.parse(raw);
    return {
      people: parsed.people ?? [],
      accounts: parsed.accounts ?? [],
      ipos: parsed.ipos ?? [],
      applications: parsed.applications ?? [],
    };
  } catch {
    return emptyData;
  }
}

export function useStore() {
  const [data, setData] = useState<AppData>(emptyData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* ignore quota errors */
    }
  }, [data, hydrated]);

  const update = useCallback(
    (fn: (d: AppData) => AppData) => setData((d) => fn(d)),
    [],
  );

  const replaceAll = useCallback((d: AppData) => setData(d), []);

  const reset = useCallback(() => setData(emptyData), []);

  return { data, hydrated, update, replaceAll, reset };
}

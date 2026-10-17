"use client";

import { useCallback, useEffect, useState } from "react";
import { dashboardApi } from "../lib/dashboardApi";

const KEYS = ["pets", "appointments", "orders", "adoptions"];
const initial = Object.fromEntries(
  KEYS.map((k) => [k, { status: "loading", data: [] }]),
);

export function useDashboard() {
  const [state, setState] = useState(initial);

  const load = useCallback(async () => {
    setState(initial);
    const results = await Promise.allSettled(
      KEYS.map((k) => dashboardApi[k]()),
    );
    setState(
      Object.fromEntries(
        KEYS.map((k, i) => {
          const r = results[i];
          return [
            k,
            r.status === "fulfilled"
              ? { status: "ready", data: r.value }
              : { status: "error", data: [] },
          ];
        }),
      ),
    );
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}

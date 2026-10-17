"use client";

import { useCallback, useEffect, useState } from "react";

export function useDebounced(value, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

// Generic paged list. `fetcher` must be a stable function (module level).
export function useAdminList(fetcher, params) {
  const [state, setState] = useState({
    status: "loading",
    items: [],
    totalCount: 0,
  });
  const [tick, setTick] = useState(0);
  const key = JSON.stringify(params);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, status: "loading" }));
    fetcher(JSON.parse(key))
      .then((d) => {
        if (cancelled) return;
        setState({
          status: "ready",
          items: d.items ?? [],
          totalCount: d.totalCount ?? 0,
        });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error", items: [], totalCount: 0 });
      });
    return () => {
      cancelled = true;
    };
  }, [fetcher, key, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, reload };
}

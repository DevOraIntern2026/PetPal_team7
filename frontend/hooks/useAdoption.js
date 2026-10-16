"use client";

import { useEffect, useState } from "react";
import { adoptionApi, getErrorMessage } from "../lib/api";
import { mapListing } from "@/lib/adoption/mapListing";

export function useListings(params) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });
  const [tick, setTick] = useState(0);
  const key = JSON.stringify(params ?? {});

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));

    adoptionApi
      .list(params, controller.signal)
      .then((data) =>
        setState({
          data: { ...data, items: (data.items ?? []).map(mapListing) },
          loading: false,
          error: null,
        }),
      )
      .catch((err) => {
        if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
        setState({ data: null, loading: false, error: getErrorMessage(err) });
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, tick]);

  return { ...state, refetch: () => setTick((t) => t + 1) };
}

export function useListing(id) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });

    adoptionApi
      .get(id, controller.signal)
      .then((data) =>
        setState({ data: mapListing(data), loading: false, error: null }),
      )
      .catch((err) => {
        if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
        setState({ data: null, loading: false, error: getErrorMessage(err) });
      });

    return () => controller.abort();
  }, [id]);

  return state;
}
export function useMyListings(params, { enabled = true } = {}) {
  const [state, setState] = useState({
    data: null,
    loading: enabled,
    error: null,
  });
  const [tick, setTick] = useState(0);
  const key = JSON.stringify(params ?? {});

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));

    adoptionApi
      .mine(params, controller.signal)
      .then((data) => {
        const items = Array.isArray(data) ? data : (data.items ?? []);
        setState({
          data: {
            ...(Array.isArray(data) ? {} : data),
            items: items.map(mapListing),
          },
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
        setState({ data: null, loading: false, error: getErrorMessage(err) });
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, tick, enabled]);

  return { ...state, refetch: () => setTick((t) => t + 1) };
}

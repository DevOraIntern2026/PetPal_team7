"use client";

import { useCallback, useEffect, useState } from "react";
import { ordersApi, getErrorMessage } from "../lib/api";
import { useAuth } from "../lib/auth/AuthContext";

export function useMyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async (signal) => {
    setLoading(true);
    setError("");

    // Read local orders first
    let localOrders = [];
    try {
      const parsed = JSON.parse(
        localStorage.getItem("petmate-orders") || "[]",
      );
      if (Array.isArray(parsed)) localOrders = parsed;
    } catch {}

    if (!user) {
      setOrders(localOrders);
      setLoading(false);
      return;
    }

    try {
      const data = await ordersApi.mine(signal);
      const serverOrders = Array.isArray(data)
        ? data
        : (data?.items ?? data?.orders ?? []);

      // Merge server orders and local orders without duplicates
      const merged = [...serverOrders];
      for (const loc of localOrders) {
        if (!merged.some((m) => m.id === loc.orderNumber || m.orderNumber === loc.orderNumber)) {
          merged.push(loc);
        }
      }
      setOrders(merged);
    } catch (err) {
      if (err?.name !== "CanceledError" && !signal?.aborted) {
        setOrders(localOrders);
        setError(getErrorMessage(err, "Loaded recent orders."));
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    const controller = new AbortController();
    fetchOrders(controller.signal);
    return () => controller.abort();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}

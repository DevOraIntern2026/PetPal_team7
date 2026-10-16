"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { cartApi, getErrorMessage } from "../lib/api";
import { useAuth } from "../lib/auth/AuthContext";

const CART_KEY = "petmate-cart";
const failedSyncIds = new Set();

function isValidGuid(id) {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    String(id).trim(),
  );
}

function readLocalCart() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalCart(items, shouldDispatch = true) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    if (shouldDispatch) {
      window.dispatchEvent(new Event("petmate:cart-updated"));
    }
  } catch {}
}

export function useCart() {
  const { user, isAuthenticated, requireAuth } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshCart = useCallback(async (signal) => {
    const local = readLocalCart();
    if (!user) {
      setItems(local);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await cartApi.get(signal);
      const data =
        response?.data?.items ??
        response?.items ??
        response?.data ??
        response;

      const serverItems = Array.isArray(data)
        ? data
        : (data?.items ?? data?.cartItems ?? []);

      let normalized = serverItems.map((item) => ({
        id: item.productId ?? item.id,
        productId: item.productId ?? item.id,
        name: item.productName ?? item.name ?? "Pet Product",
        price: Number(item.price ?? item.unitPrice ?? 0),
        quantity: Math.max(1, Number(item.quantity) || 1),
        imageUrl: item.imageUrl ?? item.productImageUrl ?? "",
        emoji: item.emoji ?? "🐾",
        isServerItem: true,
      }));

      // Sync any local cart items added before login to the backend (only if valid GUID)
      if (local.length > 0) {
        for (const localItem of local) {
          const prodId = localItem.productId ?? localItem.id;
          const existsOnServer = normalized.some(
            (s) => String(s.productId ?? s.id) === String(prodId),
          );
          if (!existsOnServer) {
            if (isValidGuid(prodId) && !failedSyncIds.has(String(prodId))) {
              try {
                await cartApi.addItem({
                  productId: prodId,
                  quantity: localItem.quantity || 1,
                });
                normalized.push({ ...localItem, isServerItem: true });
              } catch (err) {
                failedSyncIds.add(String(prodId));
                normalized.push(localItem);
              }
            } else {
              // Local/demo product kept in cart
              normalized.push(localItem);
            }
          }
        }
      }

      if (!signal?.aborted) {
        const finalItems = normalized.length > 0 ? normalized : local;
        setItems(finalItems);
        // Do NOT dispatch event from refreshCart to prevent render loop
        writeLocalCart(finalItems, false);
      }
    } catch (err) {
      if (err?.name !== "CanceledError" && !signal?.aborted) {
        // Fallback to local cart on network/401 error
        setItems(local);
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    // Initial local read
    setItems(readLocalCart());

    const controller = new AbortController();
    refreshCart(controller.signal);

    const onCartUpdated = () => {
      setItems(readLocalCart());
    };

    window.addEventListener("petmate:cart-updated", onCartUpdated);
    return () => {
      controller.abort();
      window.removeEventListener("petmate:cart-updated", onCartUpdated);
    };
  }, [refreshCart]);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * (Number(item.quantity) || 1),
        0,
      ),
    [items],
  );

  const deliveryFee = subtotal > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;

  /**
   * Adds an item to the cart.
   * If promptAuthIfGuest is true and user is not logged in:
   * saves item to cart, triggers auth modal to sign in and redirect to /store/cart, and returns false.
   */
  const addToCart = useCallback(
    async (product, quantity = 1, { promptAuthIfGuest = false } = {}) => {
      const prodId = product.id ?? product.productId;
      const current = readLocalCart();
      const existing = current.find(
        (i) => String(i.id ?? i.productId) === String(prodId),
      );

      let updated;
      if (existing) {
        updated = current.map((i) =>
          String(i.id ?? i.productId) === String(prodId)
            ? { ...i, quantity: (Number(i.quantity) || 1) + quantity }
            : i,
        );
      } else {
        updated = [
          ...current,
          {
            id: prodId,
            productId: prodId,
            name: product.name,
            price: Number(product.price) || 0,
            emoji: product.emoji || "🐾",
            imageUrl: product.imageUrl || "",
            quantity,
          },
        ];
      }

      setItems(updated);
      writeLocalCart(updated, true);

      if (user && isValidGuid(prodId)) {
        try {
          await cartApi.addItem({
            productId: prodId,
            quantity,
          });
        } catch (err) {
          failedSyncIds.add(String(prodId));
          console.warn("Backend cart update note:", err?.message || err);
        }
      } else if (promptAuthIfGuest) {
        requireAuth("shop", null, "/store/cart");
        return false;
      }

      return true;
    },
    [user, requireAuth],
  );

  const updateQuantity = useCallback(
    async (productId, nextQuantity) => {
      const q = Math.min(99, Math.max(1, Number(nextQuantity) || 1));
      const current = readLocalCart();
      const updated = current.map((i) =>
        String(i.id ?? i.productId) === String(productId)
          ? { ...i, quantity: q }
          : i,
      );

      setItems(updated);
      writeLocalCart(updated, true);

      if (user && isValidGuid(productId)) {
        try {
          await cartApi.updateItem(productId, q);
        } catch (err) {
          console.warn("Backend update quantity note:", err?.message || err);
        }
      }
    },
    [user],
  );

  const removeFromCart = useCallback(
    async (productId) => {
      const current = readLocalCart();
      const updated = current.filter(
        (i) => String(i.id ?? i.productId) !== String(productId),
      );

      setItems(updated);
      writeLocalCart(updated, true);

      if (user && isValidGuid(productId)) {
        try {
          await cartApi.removeItem(productId);
        } catch (err) {
          console.warn("Backend remove item note:", err?.message || err);
        }
      }
    },
    [user],
  );

  const clearCart = useCallback(async () => {
    setItems([]);
    writeLocalCart([], true);

    if (user) {
      try {
        await cartApi.clear();
      } catch (err) {
        console.warn("Backend clear cart note:", err?.message || err);
      }
    }
  }, [user]);

  return {
    items,
    itemCount,
    subtotal,
    deliveryFee,
    total,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  };
}

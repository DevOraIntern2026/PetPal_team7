"use client";

import { RefreshCw, ShoppingBag, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { useMyOrders } from "../../hooks/useMyOrders";
import Link from "next/link";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

const money = (v) => `${Number(v || 0).toLocaleString("en-US")} EGP`;

function statusInfo(status) {
  const s = (status || "").toLowerCase();
  if (s === "delivered" || s === "completed")
    return { color: "bg-emerald-100 text-emerald-700", Icon: CheckCircle };
  if (s === "pending" || s === "processing")
    return { color: "bg-amber-100 text-amber-700", Icon: Clock };
  if (s === "cancelled" || s === "canceled")
    return { color: "bg-red-100 text-red-600", Icon: XCircle };
  return { color: "bg-blue-100 text-blue-700", Icon: Package };
}

export default function OrdersTab() {
  const { orders, loading, error, refetch } = useMyOrders();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-ink/40">
        <RefreshCw size={32} className="animate-spin mb-3" />
        <p className="text-sm font-medium">Loading orders…</p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-ink/40">
        <ShoppingBag size={48} className="mb-4 text-primary/30" />
        <p className="text-lg font-bold text-ink/50">No orders yet</p>
        <p className="mt-1 text-sm">Head to the store to place your first order.</p>
        <Link
          href="/store"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-strong px-6 py-2.5 text-sm font-bold text-white transition hover:bg-primary-deep"
        >
          <ShoppingBag size={15} />
          Browse Store
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-ink">My Orders</h2>
        <button
          type="button"
          onClick={() => refetch()}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-primary-strong hover:bg-primary-tint transition"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4">
        {orders.map((order, idx) => {
          const id = order.id ?? order.orderId ?? order.orderNumber ?? idx;
          const status = order.status ?? "Pending";
          const { color, Icon } = statusInfo(status);
          const total =
            order.totalAmount ?? order.total ?? order.totalPrice ?? 0;
          const createdAt = order.createdAt ?? order.date ?? order.orderDate;
          const items = Array.isArray(order.items)
            ? order.items
            : Array.isArray(order.orderItems)
            ? order.orderItems
            : [];

          return (
            <div
              key={id}
              className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm"
            >
              {/* Header row */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-ink/40">Order ID</p>
                  <p className="font-extrabold text-ink">
                    #{String(id).slice(0, 8).toUpperCase()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-ink">
                    {money(total)}
                  </span>
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${color}`}
                  >
                    <Icon size={12} />
                    {status}
                  </span>
                </div>
              </div>

              {/* Date + address */}
              {(createdAt || order.deliveryAddress) && (
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-ink/50">
                  {createdAt && <span>Ordered: {formatDate(createdAt)}</span>}
                  {order.deliveryAddress && (
                    <span>📍 {order.deliveryAddress}</span>
                  )}
                </div>
              )}

              {/* Items */}
              {items.length > 0 && (
                <div className="mt-4 space-y-2 border-t border-primary/10 pt-4">
                  {items.map((item, i) => {
                    const itemId = item.productId ?? item.id ?? i;
                    const itemName =
                      item.productName ?? item.name ?? `Item #${i + 1}`;
                    const qty = item.quantity ?? 1;
                    const price = item.price ?? item.unitPrice ?? 0;
                    return (
                      <div
                        key={itemId}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-ink/70">
                          {itemName}{" "}
                          <span className="text-ink/40">× {qty}</span>
                        </span>
                        <span className="font-semibold text-ink">
                          {money(price * qty)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

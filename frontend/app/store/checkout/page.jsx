"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  PawPrint,
  ShieldCheck,
  Truck,
  ShoppingBag,
  MapPin,
  UserRound,
} from "lucide-react";

import { useCart } from "../../../hooks/useCart";
import { useAuth } from "../../../lib/auth/AuthContext";
import { readSession } from "../../../lib/auth/session";
import { ordersApi, getErrorMessage } from "../../../lib/api";

const money = (value) => `${Number(value || 0).toLocaleString("en-US")} EGP`;

export default function CheckoutPage() {
  const { user, ready, requireAuth } = useAuth();
  const {
    items: cart,
    subtotal,
    deliveryFee: delivery,
    total,
    clearCart,
  } = useCart();

  const [placed, setPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
    payment: "cash",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) return;
    const activeUser =
      user || (typeof window !== "undefined" ? readSession()?.user : null);
    if (!activeUser) {
      requireAuth("shop", null, "/store/checkout");
    } else {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || activeUser.name || "",
        email: prev.email || activeUser.email || "",
      }));
    }
  }, [user, ready, requireAuth]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function placeOrder(event) {
    event.preventDefault();
    setError("");

    if (!cart.length) {
      setError("Your bag is empty. Add a product before checkout.");
      return;
    }

    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    setSubmitting(true);
    let orderNum = `PM-${Date.now().toString().slice(-8)}`;

    const isGuid = (val) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        String(val || ""),
      );

    if (user) {
      const hasServerItems = cart.some((i) => isGuid(i.productId || i.id));
      if (hasServerItems) {
        try {
          const res = await ordersApi.checkout({
            deliveryAddress: `${form.address}, ${form.city}`,
            paymentMethod: form.payment === "card" ? "Card" : "Cash",
          });
          const serverId = res?.id ?? res?.data?.id ?? res?.orderId;
          if (serverId) orderNum = serverId;
        } catch (err) {
          console.warn("Backend order submission note:", err?.message || err);
        }
      }
    }

    try {
      const order = {
        orderNumber: orderNum,
        createdAt: new Date().toISOString(),
        customer: { ...form },
        items: cart,
        subtotal,
        delivery,
        total,
        payment: form.payment,
        status: "Confirmed",
      };
      const previous = JSON.parse(
        localStorage.getItem("petmate-orders") || "[]",
      );
      localStorage.setItem(
        "petmate-orders",
        JSON.stringify([order, ...(Array.isArray(previous) ? previous : [])]),
      );
    } catch {}

    await clearCart();
    setConfirmedOrderId(orderNum);
    setPlaced(true);
    setSubmitting(false);
  }

  if (placed)
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-5 py-12 text-ink">
        <section className="w-full max-w-xl rounded-[2rem] border border-primary/10 bg-white p-7 text-center shadow-xl sm:p-10">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-tint text-primary-strong">
            <CheckCircle2 size={38} />
          </span>
          <p className="mt-6 text-xs font-black uppercase tracking-[.2em] text-primary-strong">
            Order received
          </p>
          <h1 className="mt-2 text-3xl font-black">
            Thank you, {form.fullName.split(" ")[0]}!
          </h1>
          <p className="mt-4 leading-7 text-ink-muted">
            Your demo order has been saved in this browser. No real payment was
            processed and no order was sent to a server.
          </p>
          <div className="mt-6 rounded-2xl bg-cream p-5 text-left">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-ink-muted">Order total</span>
              <span className="font-black">{money(total)}</span>
            </div>
            <div className="mt-3 flex justify-between gap-4 text-sm">
              <span className="text-ink-muted">Payment</span>
              <span className="font-bold">
                {form.payment === "cash"
                  ? "Cash on delivery"
                  : "Card (demo only)"}
              </span>
            </div>
          </div>
          <Link
            href="/store"
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary-strong px-6 py-3 font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-primary-deep"
          >
            Back to the store <ArrowRight size={18} />
          </Link>
        </section>
      </main>
    );

  return (
    <main className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-30 border-b border-primary/10 bg-cream/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/store" className="group flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white">
              <PawPrint size={23} />
            </span>
            <span className="text-xl font-black tracking-tight">
              Pet<span className="text-primary-strong">Mate</span>
              <span className="ml-2 text-sm font-medium text-ink-muted">
                Checkout
              </span>
            </span>
          </Link>
          <Link
            href="/store/cart"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/15 bg-white px-4 text-sm font-bold text-primary-strong transition hover:bg-primary-tint"
          >
            <ArrowLeft size={16} /> Back to bag
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[.2em] text-primary-strong">
            Almost there
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Checkout
          </h1>
          <p className="mt-3 text-ink-muted">
            A few details and your pet’s goodies are nearly on their way.
          </p>
        </div>
        {!ready ? (
          <div className="rounded-3xl border border-primary/10 bg-white p-10 text-center text-ink-muted">
            Loading checkout…
          </div>
        ) : cart.length === 0 ? (
          <div className="rounded-[2rem] border border-primary/10 bg-white px-6 py-14 text-center shadow-sm">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-tint text-primary-strong">
              <ShoppingBag size={29} />
            </span>
            <h2 className="mt-5 text-2xl font-black">Your bag is empty</h2>
            <p className="mt-2 text-ink-muted">
              Add a product before continuing to checkout.
            </p>
            <Link
              href="/store"
              className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary-strong px-6 py-3 font-bold text-white transition hover:bg-primary-deep"
            >
              Browse products <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_370px]">
            <form
              onSubmit={placeOrder}
              className="space-y-7 rounded-[1.7rem] border border-primary/10 bg-white p-5 shadow-sm sm:p-7"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-tint text-primary-strong">
                    <UserRound size={20} />
                  </span>
                  <div>
                    <h2 className="text-xl font-black">Contact details</h2>
                    <p className="mt-1 text-sm text-ink-muted">
                      How can we reach you about your order?
                    </p>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Full name *"
                    value={form.fullName}
                    onChange={(v) => update("fullName", v)}
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                  <Field
                    label="Email address *"
                    value={form.email}
                    onChange={(v) => update("email", v)}
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                  />
                  <Field
                    label="Phone number *"
                    value={form.phone}
                    onChange={(v) => update("phone", v)}
                    placeholder="01xxxxxxxxx"
                    type="tel"
                    autoComplete="tel"
                  />
                </div>
              </div>
              <div className="border-t border-primary/10 pt-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-tint text-primary-strong">
                    <MapPin size={20} />
                  </span>
                  <div>
                    <h2 className="text-xl font-black">Delivery address</h2>
                    <p className="mt-1 text-sm text-ink-muted">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field
                    label="City *"
                    value={form.city}
                    onChange={(v) => update("city", v)}
                    placeholder="Your city"
                    autoComplete="address-level2"
                  />
                  <div className="sm:col-span-2">
                    <Field
                      label="Full address *"
                      value={form.address}
                      onChange={(v) => update("address", v)}
                      placeholder="Street, building, apartment"
                      autoComplete="street-address"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold">
                      Delivery notes{" "}
                      <span className="font-normal text-ink-muted">
                        (optional)
                      </span>
                      <textarea
                        value={form.notes}
                        onChange={(e) => update("notes", e.target.value)}
                        rows={3}
                        placeholder="Apartment number, landmark, or delivery instructions"
                        className="mt-2 w-full resize-y rounded-2xl border border-primary/15 bg-cream/50 px-4 py-3 text-sm font-medium outline-none transition placeholder:text-ink-muted/70 focus:border-primary-strong focus:ring-4 focus:ring-primary/10"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="border-t border-primary/10 pt-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-tint text-primary-strong">
                    <CreditCard size={20} />
                  </span>
                  <div>
                    <h2 className="text-xl font-black">Payment method</h2>
                    <p className="mt-1 text-sm text-ink-muted">
                      Choose your preferred payment option.
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <PaymentOption
                    value="cash"
                    selected={form.payment}
                    onChange={(v) => update("payment", v)}
                    title="Cash on delivery"
                    description="Pay when your order arrives."
                  />
                  <PaymentOption
                    value="card"
                    selected={form.payment}
                    onChange={(v) => update("payment", v)}
                    title="Credit / debit card"
                    description="Demo selection only — no payment is processed."
                  />
                </div>
              </div>
              {error && (
                <p
                  role="alert"
                  className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
                >
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-primary-strong px-6 py-3 font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-deep"
              >
                Place demo order <ArrowRight size={18} />
              </button>
              <p className="flex items-center justify-center gap-2 text-center text-xs text-ink-muted">
                <ShieldCheck size={15} /> Demo checkout · No real payment will
                be taken
              </p>
            </form>

            <aside className="rounded-[1.7rem] border border-primary/10 bg-white p-6 shadow-sm lg:sticky lg:top-28">
              <h2 className="text-xl font-black">Order summary</h2>
              <p className="mt-1 text-sm text-ink-muted">
                {cart.length} product {cart.length === 1 ? "type" : "types"}
              </p>
              <div className="mt-5 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-2xl">
                      {item.emoji || "🐾"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-extrabold">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-ink-muted">
                        Qty: {Math.max(1, Number(item.quantity) || 1)}
                      </p>
                    </div>
                    <span className="text-sm font-black">
                      {money(
                        Number(item.price || 0) *
                          Math.max(1, Number(item.quantity) || 1),
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-3 border-t border-primary/10 pt-5 text-sm">
                <div className="flex justify-between text-ink-muted">
                  <span>Subtotal</span>
                  <span className="font-bold text-ink">{money(subtotal)}</span>
                </div>
                <div className="flex justify-between text-ink-muted">
                  <span className="flex items-center gap-2">
                    <Truck size={15} /> Delivery
                  </span>
                  <span className="font-bold text-ink">{money(delivery)}</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-primary/20 pt-4 text-base">
                  <span className="font-extrabold">Total</span>
                  <span className="text-xl font-black">{money(total)}</span>
                </div>
              </div>
              <div className="mt-5 flex items-start gap-3 rounded-2xl bg-primary-tint/70 p-3">
                <Check
                  size={18}
                  className="mt-0.5 shrink-0 text-primary-strong"
                />
                <p className="text-xs leading-5 text-ink-muted">
                  Double-check your delivery details before placing the order.
                </p>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-2 min-h-12 w-full rounded-2xl border border-primary/15 bg-cream/50 px-4 py-3 text-sm font-medium outline-none transition placeholder:text-ink-muted/70 focus:border-primary-strong focus:ring-4 focus:ring-primary/10"
      />
    </label>
  );
}

function PaymentOption({ value, selected, onChange, title, description }) {
  const active = selected === value;
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${active ? "border-primary-strong bg-primary-tint/60 ring-2 ring-primary/10" : "border-primary/15 hover:bg-cream"}`}
    >
      <input
        type="radio"
        name="payment"
        value={value}
        checked={active}
        onChange={() => onChange(value)}
        className="mt-1 accent-[#1a7b97]"
      />
      <span>
        <span className="block font-extrabold">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-ink-muted">
          {description}
        </span>
      </span>
    </label>
  );
}

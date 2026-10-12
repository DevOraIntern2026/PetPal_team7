"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  PawPrint,
  Heart,
  ShieldCheck,
  Truck,
  ShoppingCart,
} from "lucide-react";

const CART_KEY = "petmate-cart";
const FAVORITES_KEY = "petmate-favorites";
const money = (value) => `${Number(value || 0).toLocaleString("en-US")} EGP`;

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const parsedCart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      const parsedFavorites = JSON.parse(
        localStorage.getItem(FAVORITES_KEY) || "[]",
      );
      setCart(Array.isArray(parsedCart) ? parsedCart : []);
      setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : []);
    } catch {
      setCart([]);
      setFavorites([]);
    }
    setReady(true);
  }, []);

  const itemCount = cart.reduce(
    (sum, item) => sum + Math.max(1, Number(item.quantity) || 1),
    0,
  );
  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum +
          Number(item.price || 0) * Math.max(1, Number(item.quantity) || 1),
        0,
      ),
    [cart],
  );
  const delivery = subtotal > 0 ? 50 : 0;
  const total = subtotal + delivery;

  function saveCart(next) {
    setCart(next);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
  }

  function changeQuantity(id, delta) {
    saveCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.min(
                99,
                Math.max(1, (Number(item.quantity) || 1) + delta),
              ),
            }
          : item,
      ),
    );
  }

  function removeItem(id) {
    saveCart(cart.filter((item) => item.id !== id));
  }

  function toggleFavorite(item) {
    const next = favorites.includes(item.id)
      ? favorites.filter((id) => id !== item.id)
      : [...favorites, item.id];
    setFavorites(next);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  }

  return (
    <main className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-30 border-b border-primary/10 bg-cream/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/store" className="group flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
              <PawPrint size={23} />
            </span>
            <span className="text-xl font-black tracking-tight">
              Pet<span className="text-primary-strong">Mate</span>
              <span className="ml-2 text-sm font-medium text-ink-muted">
                Bag
              </span>
            </span>
          </Link>
          <Link
            href="/store"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/15 bg-white px-4 text-sm font-bold text-primary-strong transition hover:bg-primary-tint"
          >
            <ArrowLeft size={16} /> Continue shopping
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[.2em] text-primary-strong">
            Your picks, all in one place
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Shopping bag
              </h1>
              <p className="mt-2 text-ink-muted">
                {ready
                  ? `${itemCount} ${itemCount === 1 ? "item" : "items"} in your bag`
                  : "Loading your bag…"}
              </p>
            </div>
            {ready && cart.length > 0 && (
              <button
                onClick={() => saveCart([])}
                className="text-sm font-bold text-ink-muted underline decoration-rose-200 underline-offset-4 transition hover:text-rose-600"
              >
                Clear bag
              </button>
            )}
          </div>
        </div>

        {!ready ? (
          <div className="rounded-3xl border border-primary/10 bg-white p-10 text-center text-ink-muted">
            Loading your bag…
          </div>
        ) : cart.length === 0 ? (
          <div className="rounded-[2rem] border border-primary/10 bg-white px-6 py-14 text-center shadow-sm sm:py-20">
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-tint text-primary-strong">
              <ShoppingBag size={34} />
            </span>
            <h2 className="mt-6 text-2xl font-black">
              Your bag is waiting for something lovely
            </h2>
            <p className="mx-auto mt-3 max-w-md leading-7 text-ink-muted">
              Explore our pet essentials and add your favorites. They’ll be
              waiting here when you’re ready.
            </p>
            <Link
              href="/store"
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary-strong px-6 py-3 font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-deep"
            >
              Explore the store <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="overflow-hidden rounded-[1.7rem] border border-primary/10 bg-white shadow-sm">
              <div className="hidden grid-cols-[minmax(0,1fr)_110px_110px] gap-4 border-b border-primary/10 bg-primary-tint/40 px-6 py-4 text-xs font-black uppercase tracking-wider text-ink-muted sm:grid">
                <span>Product</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Total</span>
              </div>
              <div className="divide-y divide-primary/10">
                {cart.map((item) => (
                  <article
                    key={item.id}
                    className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_110px_110px] sm:items-center sm:gap-4 sm:px-6 sm:py-5"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary-tint text-4xl sm:h-24 sm:w-24">
                        {item.emoji || "🐾"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/store/${item.id}`}
                          className="line-clamp-2 font-black transition hover:text-primary-strong"
                        >
                          {item.name || "PetMate product"}
                        </Link>
                        <p className="mt-1 text-sm font-bold text-primary-strong">
                          {money(item.price)}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-3">
                          <button
                            onClick={() => toggleFavorite(item)}
                            className={`inline-flex items-center gap-1.5 text-xs font-bold transition ${favorites.includes(item.id) ? "text-rose-500" : "text-ink-muted hover:text-rose-500"}`}
                          >
                            <Heart
                              size={14}
                              fill={
                                favorites.includes(item.id)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                            {favorites.includes(item.id)
                              ? "Saved"
                              : "Save for later"}
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted transition hover:text-rose-600"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-center">
                      <span className="text-xs font-bold text-ink-muted sm:hidden">
                        Quantity
                      </span>
                      <div className="flex h-10 items-center rounded-full border border-primary/15 bg-cream p-1">
                        <button
                          aria-label={`Decrease ${item.name} quantity`}
                          disabled={Number(item.quantity) <= 1}
                          onClick={() => changeQuantity(item.id, -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition hover:bg-white disabled:opacity-30"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="min-w-8 text-center text-sm font-black">
                          {Math.max(1, Number(item.quantity) || 1)}
                        </span>
                        <button
                          aria-label={`Increase ${item.name} quantity`}
                          disabled={Number(item.quantity) >= 99}
                          onClick={() => changeQuantity(item.id, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-primary-strong transition hover:bg-white disabled:opacity-30"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end">
                      <span className="text-xs font-bold text-ink-muted sm:hidden">
                        Item total
                      </span>
                      <span className="font-black">
                        {money(
                          Number(item.price || 0) *
                            Math.max(1, Number(item.quantity) || 1),
                        )}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-primary/10 bg-cream/50 px-5 py-4 sm:px-6">
                <p className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
                  <ShieldCheck size={16} className="text-primary-strong" /> Safe
                  and simple demo checkout
                </p>
                <Link
                  href="/store"
                  className="text-sm font-extrabold text-primary-strong hover:underline"
                >
                  + Add more items
                </Link>
              </div>
            </section>

            <aside className="rounded-[1.7rem] border border-primary/10 bg-white p-6 shadow-sm lg:sticky lg:top-28">
              <h2 className="text-xl font-black">Order summary</h2>
              <p className="mt-1 text-sm text-ink-muted">
                A quick look before checkout.
              </p>
              <div className="mt-5 space-y-4 border-b border-primary/10 pb-5 text-sm">
                <div className="flex justify-between gap-3 text-ink-muted">
                  <span>Subtotal</span>
                  <span className="font-bold text-ink">{money(subtotal)}</span>
                </div>
                <div className="flex justify-between gap-3 text-ink-muted">
                  <span className="flex items-center gap-2">
                    <Truck size={15} /> Delivery
                  </span>
                  <span className="font-bold text-ink">{money(delivery)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 py-5">
                <span className="font-extrabold">Total</span>
                <span className="text-2xl font-black">{money(total)}</span>
              </div>
              <Link
                href="/store/checkout"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary-strong px-5 py-3 font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-deep"
              >
                Proceed to checkout <ArrowRight size={17} />
              </Link>
              <div className="mt-4 flex items-start gap-2 rounded-2xl bg-primary-tint/60 p-3 text-xs leading-5 text-ink-muted">
                <ShieldCheck
                  size={16}
                  className="mt-0.5 shrink-0 text-primary-strong"
                />
                No real payment is collected in this demo store.
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  ShoppingBag,
  PawPrint,
  Trash2,
  Check,
  X,
} from "lucide-react";

const CART_KEY = "petmate-cart";
const FAVORITES_KEY = "petmate-favorites";
const products = [
  {
    id: 1,
    name: "Premium Pet Food",
    category: "Food",
    price: 420,
    emoji: "🥣",
    bg: "bg-[#e4f4f8]",
    description: "Daily nutrition for happy, healthy pets.",
    tag: "Bestseller",
  },
  {
    id: 2,
    name: "Interactive Toy",
    category: "Toys",
    price: 185,
    emoji: "🧸",
    bg: "bg-[#fff0e2]",
    description: "Keep your little friend active and playful.",
    tag: "Popular",
  },
  {
    id: 3,
    name: "Pet Care Kit",
    category: "Care",
    price: 290,
    emoji: "🧴",
    bg: "bg-[#f0f2df]",
    description: "Everyday essentials for gentle pet care.",
    tag: "",
  },
  {
    id: 4,
    name: "Cozy Pet Bed",
    category: "Accessories",
    price: 650,
    emoji: "🛏️",
    bg: "bg-[#f7e9e3]",
    description: "A soft and cozy place to rest.",
    tag: "New",
  },
  {
    id: 5,
    name: "Healthy Pet Treats",
    category: "Food",
    price: 120,
    emoji: "🦴",
    bg: "bg-[#f0f2df]",
    description: "A tasty little reward for your best friend.",
    tag: "",
  },
  {
    id: 6,
    name: "Playtime Ball",
    category: "Toys",
    price: 95,
    emoji: "🎾",
    bg: "bg-[#e4f4f8]",
    description: "Made for everyday fun and activity.",
    tag: "",
  },
];
const money = (value) => `${Number(value || 0).toLocaleString("en-US")} EGP`;

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeProduct, setNoticeProduct] = useState("");

  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
      const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      setFavorites(Array.isArray(favs) ? favs : []);
      setCartCount(
        Array.isArray(cart)
          ? cart.reduce(
              (sum, item) => sum + Math.max(1, Number(item.quantity) || 1),
              0,
            )
          : 0,
      );
    } catch {
      setFavorites([]);
      setCartCount(0);
    }
    setReady(true);
  }, []);

  const savedProducts = products.filter((product) =>
    favorites.includes(product.id),
  );

  function removeFavorite(id) {
    const next = favorites.filter((item) => item !== id);
    setFavorites(next);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  }

  function addToCart(product) {
    let current = [];
    try {
      current = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
      current = [];
    }
    const existing = current.find((item) => item.id === product.id);
    const next = existing
      ? current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(99, (Number(item.quantity) || 1) + 1),
              }
            : item,
        )
      : [
          ...current,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            emoji: product.emoji,
            quantity: 1,
          },
        ];
    localStorage.setItem(CART_KEY, JSON.stringify(next));
    setCartCount(
      next.reduce(
        (sum, item) => sum + Math.max(1, Number(item.quantity) || 1),
        0,
      ),
    );
    setNoticeProduct(product.name);
    setNotice("Added to your bag");
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
                Favorites
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/store"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/15 bg-white px-4 text-sm font-bold text-primary-strong transition hover:bg-primary-tint"
            >
              <ArrowLeft size={16} /> Store
            </Link>
            <Link
              href="/store/cart"
              aria-label="Shopping bag"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-strong text-white shadow-sm transition hover:bg-primary-deep"
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-black text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-primary-strong">
              Kept close to heart
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Your favorites{" "}
              <span className="text-lg font-bold text-ink-muted">
                ({ready ? savedProducts.length : 0})
              </span>
            </h1>
            <p className="mt-3 text-ink-muted">
              The little things you love, saved for later.
            </p>
          </div>
          {ready && savedProducts.length > 0 && (
            <Link
              href="/store"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/15 bg-white px-4 text-sm font-extrabold text-primary-strong transition hover:bg-primary-tint"
            >
              <ArrowLeft size={16} /> Explore more
            </Link>
          )}
        </div>
        {!ready ? (
          <div className="rounded-3xl border border-primary/10 bg-white p-10 text-center text-ink-muted">
            Loading your favorites…
          </div>
        ) : savedProducts.length === 0 ? (
          <div className="rounded-[2rem] border border-primary/10 bg-white px-6 py-14 text-center shadow-sm sm:py-20">
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-500">
              <Heart size={34} />
            </span>
            <h2 className="mt-6 text-2xl font-black">No favorites just yet</h2>
            <p className="mx-auto mt-3 max-w-md leading-7 text-ink-muted">
              Tap the heart on any product to save it here. Your saved picks
              will be ready whenever you are.
            </p>
            <Link
              href="/store"
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary-strong px-6 py-3 font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-primary-deep"
            >
              Explore the store <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {savedProducts.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-[1.7rem] border border-primary/10 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.25rem] ${product.bg}`}
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/35" />
                  <span className="relative text-8xl drop-shadow-sm transition duration-300 group-hover:scale-110">
                    {product.emoji}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFavorite(product.id)}
                    aria-label={`Remove ${product.name} from favorites`}
                    className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-rose-500 shadow-md transition hover:scale-105 hover:bg-rose-50"
                  >
                    <Heart size={19} fill="currentColor" />
                  </button>
                  {product.tag && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-primary-strong shadow-sm">
                      {product.tag}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[11px] font-black uppercase tracking-[.16em] text-primary-strong">
                    {product.category}
                  </p>
                  <Link
                    href={`/store/${product.id}`}
                    className="mt-2 block text-lg font-black transition hover:text-primary-strong"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-2 min-h-10 text-sm leading-5 text-ink-muted">
                    {product.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="text-lg font-black">
                      {money(product.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="inline-flex min-h-10 items-center gap-2 rounded-full bg-primary-strong px-4 text-sm font-extrabold text-white transition hover:bg-primary-deep"
                    >
                      <ShoppingBag size={16} /> Add to bag
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFavorite(product.id)}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted transition hover:text-rose-600"
                  >
                    <Trash2 size={14} /> Remove from favorites
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {notice && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/10 bg-ink px-4 py-4 text-white shadow-2xl"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
            <Check size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black">{notice}</p>
            <p className="mt-0.5 truncate text-xs text-white/65">
              {noticeProduct}
            </p>
          </div>
          <Link
            href="/store/cart"
            className="shrink-0 text-sm font-extrabold text-primary"
          >
            View bag
          </Link>
          <button
            onClick={() => setNotice("")}
            aria-label="Dismiss message"
            className="rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </main>
  );
}

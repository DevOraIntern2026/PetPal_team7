"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  RotateCcw,
  PawPrint,
  Check,
  X,
  Star,
} from "lucide-react";

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
    rating: 4.8,
    reviews: 124,
    stock: "In stock",
    details:
      "Give your furry friend the care they deserve with a thoughtfully selected everyday meal. A great addition to your pet's daily routine.",
    features: [
      "Suitable for everyday feeding",
      "Easy to store and serve",
      "Made for happy mealtimes",
    ],
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
    rating: 4.7,
    reviews: 86,
    stock: "In stock",
    details:
      "Make playtime more exciting with a fun toy that encourages activity and interaction with your pet.",
    features: [
      "Encourages active play",
      "Great for daily entertainment",
      "A fun addition to playtime",
    ],
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
    rating: 4.9,
    reviews: 58,
    stock: "In stock",
    details:
      "Keep your pet's care routine simple with a convenient kit designed for everyday grooming and care.",
    features: [
      "Convenient care essentials",
      "Suitable for regular routines",
      "Easy to keep organized",
    ],
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
    rating: 4.8,
    reviews: 42,
    stock: "In stock",
    details:
      "Create a comfortable little corner for your pet to relax and enjoy some well-deserved rest.",
    features: [
      "Comfort-focused design",
      "A cozy resting spot",
      "Fits beautifully into your pet's space",
    ],
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
    rating: 4.6,
    reviews: 73,
    stock: "In stock",
    details:
      "Make those little moments extra special with a treat for rewarding and bonding with your pet.",
    features: [
      "Convenient treat-time option",
      "Great for rewarding moments",
      "Easy to serve",
    ],
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
    rating: 4.5,
    reviews: 39,
    stock: "In stock",
    details:
      "Bring a little more fun into your pet's day with a simple toy for active play and interaction.",
    features: [
      "Encourages playful activity",
      "Simple and fun to use",
      "Perfect for playtime",
    ],
  },
];
const CART_KEY = "petmate-cart";
const FAVORITES_KEY = "petmate-favorites";

export default function ProductDetailsPage() {
  const params = useParams();
  const product = products.find((item) => item.id === Number(params.productId));
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      setCartCount(
        cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0),
      );
      const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
      if (product) setIsFavorite(favorites.includes(product.id));
    } catch {
      setCartCount(0);
    }
  }, [product]);

  function addToCart() {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    const existing = cart.find((item) => item.id === product.id);
    const updated = existing
      ? cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (Number(item.quantity) || 1) + quantity }
            : item,
        )
      : [
          ...cart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            emoji: product.emoji,
            quantity,
          },
        ];
    localStorage.setItem(CART_KEY, JSON.stringify(updated));
    setCartCount(
      updated.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0),
    );
    setShowSuccess(true);
  }

  function toggleFavorite() {
    if (!product) return;
    const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    const updated = favorites.includes(product.id)
      ? favorites.filter((id) => id !== product.id)
      : [...favorites, product.id];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    setIsFavorite(updated.includes(product.id));
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-5 text-ink">
        <div className="max-w-md text-center">
          <span className="text-6xl">🐾</span>
          <h1 className="mt-5 text-3xl font-black">Product not found</h1>
          <p className="mt-3 text-ink-muted">
            This product may no longer be available.
          </p>
          <Link
            href="/store"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary-strong px-6 py-3 font-bold text-white transition hover:bg-primary-deep"
          >
            <ArrowLeft size={18} /> Back to Store
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-30 border-b border-primary/10 bg-cream/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-sm transition group-hover:rotate-[-5deg]">
              <PawPrint size={23} />
            </span>
            <span className="text-xl font-black tracking-tight">
              Pet<span className="text-primary-strong">Mate</span>
              <span className="ml-2 text-sm font-medium text-ink-muted">
                Store
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/store"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/15 bg-white px-3 text-sm font-bold text-primary-strong transition hover:border-primary/30 hover:bg-primary-tint sm:px-4"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Continue Shopping</span>
              <span className="sm:hidden">Store</span>
            </Link>
            <Link
              href="/store/cart"
              aria-label="Shopping cart"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-strong text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-deep"
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-extrabold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 pt-6 sm:px-8 sm:pt-8">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-ink-muted"
        >
          <Link href="/" className="transition hover:text-primary-strong">
            Home
          </Link>
          <span className="text-primary/40">/</span>
          <Link href="/store" className="transition hover:text-primary-strong">
            Store
          </Link>
          <span className="text-primary/40">/</span>
          <span className="font-bold text-ink">{product.name}</span>
        </nav>
      </div>

      <section className="mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8 sm:pt-9">
        <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div
            className={`relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-[2rem] ${product.bg} sm:min-h-[480px]`}
          >
            <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-white/40" />
            <div className="pointer-events-none absolute -bottom-14 -right-8 h-56 w-56 rounded-full bg-white/40" />
            {product.tag && (
              <span className="absolute left-5 top-5 z-10 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-primary-strong shadow-sm">
                {product.tag}
              </span>
            )}
            <button
              type="button"
              onClick={toggleFavorite}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
              aria-pressed={isFavorite}
              className={`absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105 ${isFavorite ? "text-accent" : "text-ink-muted hover:text-accent"}`}
            >
              <Heart size={21} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <span className="relative text-[140px] drop-shadow-sm transition duration-500 hover:scale-110 sm:text-[190px]">
              {product.emoji}
            </span>
            <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-xs font-bold text-primary-strong shadow-sm">
              <Check size={15} /> Quality picks for happy pets
            </div>
          </div>

          <div className="pt-1 lg:pt-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-strong">
              {product.category}
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-2 shadow-sm">
                <Star size={16} className="fill-accent text-accent" />
                <span className="font-black">{product.rating}</span>
              </div>
              <span className="text-sm text-ink-muted">
                {product.reviews} customer reviews
              </span>
              <span className="h-1 w-1 rounded-full bg-primary/40" />
              <span className="flex items-center gap-1.5 text-sm font-bold text-primary-strong">
                <Check size={16} /> {product.stock}
              </span>
            </div>
            <p className="mt-6 text-3xl font-black tracking-tight">
              {product.price.toLocaleString()}{" "}
              <span className="text-base font-bold text-ink-muted">EGP</span>
            </p>
            <p className="mt-5 max-w-xl text-base leading-8 text-ink-muted">
              {product.details}
            </p>
            <div className="mt-6 space-y-3">
              {product.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary-strong">
                    <Check size={13} />
                  </span>
                  <p className="text-sm leading-6 text-ink-muted">{feature}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-primary/10 bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <p className="text-sm font-extrabold">Choose quantity</p>
                <p className="text-sm text-ink-muted">
                  Subtotal{" "}
                  <span className="ml-1 font-black text-ink">
                    {(product.price * quantity).toLocaleString()} EGP
                  </span>
                </p>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <div className="flex h-12 w-fit items-center rounded-full border border-primary/15 bg-cream p-1">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((current) => Math.max(1, current - 1))
                    }
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition hover:bg-white disabled:opacity-40"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="min-w-10 text-center font-black">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((current) => Math.min(99, current + 1))
                    }
                    disabled={quantity >= 99}
                    aria-label="Increase quantity"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-primary-strong transition hover:bg-white disabled:opacity-40"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={addToCart}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary-strong px-6 py-3 font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-deep"
                >
                  <ShoppingBag size={19} /> Add to Bag <ArrowRight size={17} />
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-white p-3">
                <Truck size={21} className="shrink-0 text-primary-strong" />
                <span className="text-xs font-bold leading-5">
                  Delivery options
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-white p-3">
                <ShieldCheck
                  size={21}
                  className="shrink-0 text-primary-strong"
                />
                <span className="text-xs font-bold leading-5">
                  Secure checkout
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-white p-3">
                <RotateCcw size={21} className="shrink-0 text-primary-strong" />
                <span className="text-xs font-bold leading-5">
                  Friendly support
                </span>
              </div>
            </div>
            <Link
              href="/store"
              className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-extrabold text-primary-strong transition hover:bg-primary-tint"
            >
              <ArrowLeft size={17} /> Back to all products
            </Link>
          </div>
        </div>
      </section>

      {showSuccess && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/35 p-4 backdrop-blur-[3px] sm:items-center"
          onClick={() => setShowSuccess(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-success-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-[1.8rem] border border-primary/10 bg-white p-6 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-tint text-primary-strong">
                  <Check size={24} />
                </span>
                <div>
                  <h2 id="add-success-title" className="text-xl font-black">
                    Added to your bag!
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-ink-muted">
                    {quantity} × {product.name} added successfully.
                  </p>
                  <p className="mt-2 font-black text-ink">
                    {(product.price * quantity).toLocaleString()} EGP
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSuccess(false)}
                aria-label="Close dialog"
                className="rounded-full p-2 text-ink-muted transition hover:bg-primary-tint"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                href="/store/cart"
                onClick={() => setShowSuccess(false)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary-strong px-5 py-3 text-sm font-extrabold text-white transition hover:bg-primary-deep"
              >
                View My Bag <ArrowRight size={17} />
              </Link>
              <button
                type="button"
                onClick={() => setShowSuccess(false)}
                className="min-h-12 rounded-full border border-primary/15 px-5 py-3 text-sm font-extrabold text-primary-strong transition hover:bg-primary-tint"
              >
                Continue Shopping
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

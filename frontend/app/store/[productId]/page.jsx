"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  PackageCheck,
  Sparkles,
} from "lucide-react";

import { useProduct } from "../../../hooks/useProducts";
import { useCart } from "../../../hooks/useCart";
import { useAuth } from "../../../lib/auth/AuthContext";
import { readSession } from "../../../lib/auth/session";

const FAVORITES_KEY = "petmate-favorites";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, requireAuth } = useAuth();
  const { addToCart, itemCount: cartCount } = useCart();

  const productId = params?.productId;
  const { product, loading, error } = useProduct(productId);

  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    try {
      const favorites = JSON.parse(
        localStorage.getItem(FAVORITES_KEY) || "[]",
      );
      if (product) {
        setIsFavorite(favorites.includes(product.id));
      }
    } catch {
      setIsFavorite(false);
    }
  }, [product]);

  function toggleFavorite() {
    if (!product) return;
    try {
      const favorites = JSON.parse(
        localStorage.getItem(FAVORITES_KEY) || "[]",
      );
      const updated = favorites.includes(product.id)
        ? favorites.filter((id) => id !== product.id)
        : [...favorites, product.id];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      setIsFavorite(updated.includes(product.id));
    } catch {}
  }

  async function handleAddToCart() {
    if (!product) return;

    const activeUser =
      user || (typeof window !== "undefined" ? readSession()?.user : null);
    if (!activeUser) {
      // Save item to bag locally so user doesn't lose it
      await addToCart(product, quantity, { promptAuthIfGuest: false });
      // Trigger modal to require sign-in, redirecting to /store/cart upon completion
      requireAuth("shop", null, "/store/cart");
      return;
    }

    const added = await addToCart(product, quantity, { promptAuthIfGuest: false });
    if (added) {
      setShowSuccess(true);
    }
  }

  async function handleBuyNow() {
    if (!product) return;

    await addToCart(product, quantity, { promptAuthIfGuest: false });
    const activeUser =
      user || (typeof window !== "undefined" ? readSession()?.user : null);
    if (!activeUser) {
      requireAuth("shop", null, "/store/checkout");
      return;
    }
    router.push("/store/checkout");
  }

  const productBg = useMemo(() => {
    if (!product) return "bg-[#e4f4f8]";
    if (product.bg) return product.bg;
    const bgs = ["bg-[#e4f4f8]", "bg-[#fff0e2]", "bg-[#f0f2df]", "bg-[#f7e9e3]"];
    const idNum = Number(product.id) || 0;
    return bgs[idNum % bgs.length];
  }, [product]);

  const stockText = useMemo(() => {
    if (!product) return "In stock";
    if (product.stockQuantity !== undefined) {
      return product.stockQuantity > 0
        ? `In stock (${product.stockQuantity} available)`
        : "Out of stock";
    }
    return product.stock || "In stock";
  }, [product]);

  const features = useMemo(() => {
    if (Array.isArray(product?.features) && product.features.length) {
      return product.features;
    }
    const list = [];
    if (product?.material) list.push(`Material: ${product.material}`);
    if (product?.color) list.push(`Color: ${product.color}`);
    if (product?.category) list.push(`Category: ${product.category}`);
    list.push("Carefully selected for pet health and happiness");
    list.push("Fast and reliable delivery to your door");
    return list;
  }, [product]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-5 text-ink">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-5xl animate-bounce">🐾</span>
          <p className="font-bold text-ink-muted">Loading product details…</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-5 text-ink">
        <div className="max-w-md text-center">
          <span className="text-6xl">🐾</span>
          <h1 className="mt-5 text-3xl font-black">Product not found</h1>
          <p className="mt-3 text-ink-muted">
            This product may no longer be available or could not be loaded.
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
              className="relative inline-flex h-11 items-center gap-2 rounded-full bg-primary-strong px-4 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-deep"
            >
              <ShoppingBag size={19} />
              <span className="hidden sm:inline font-bold">My Bag</span>
              {cartCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-extrabold text-primary-strong">
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
            className={`relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-[2rem] ${productBg} sm:min-h-[480px]`}
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
              className={`absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105 ${isFavorite ? "text-rose-500" : "text-ink-muted hover:text-rose-500"}`}
            >
              <Heart size={21} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="relative max-h-[340px] w-auto max-w-[85%] object-contain drop-shadow-md transition duration-500 hover:scale-105"
              />
            ) : (
              <span className="relative text-[140px] drop-shadow-sm transition duration-500 hover:scale-110 sm:text-[190px]">
                {product.emoji || "🐾"}
              </span>
            )}
            <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-xs font-bold text-primary-strong shadow-sm">
              <Check size={15} /> Quality picks for happy pets
            </div>
          </div>

          <div className="pt-1 lg:pt-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-strong">
              {product.category || "Pet Essentials"}
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-2 shadow-sm">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                <span className="font-black">{product.rating || 4.8}</span>
              </div>
              <span className="text-sm text-ink-muted">
                {product.reviews || 84} customer reviews
              </span>
              <span className="h-1 w-1 rounded-full bg-primary/40" />
              <span className="flex items-center gap-1.5 text-sm font-bold text-primary-strong">
                <Check size={16} /> {stockText}
              </span>
            </div>
            <p className="mt-6 text-3xl font-black tracking-tight">
              {Number(product.price || 0).toLocaleString()}{" "}
              <span className="text-base font-bold text-ink-muted">EGP</span>
            </p>
            <p className="mt-5 max-w-xl text-base leading-8 text-ink-muted">
              {product.description ||
                "Give your furry friend the care they deserve with a thoughtfully selected everyday essential. A great addition to your pet's routine."}
            </p>

            <div className="mt-6 space-y-3">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
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
                    {(Number(product.price || 0) * quantity).toLocaleString()} EGP
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
                  onClick={handleAddToCart}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary-strong px-6 py-3 font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-deep"
                >
                  <ShoppingBag size={19} /> Add to Bag <ArrowRight size={17} />
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/20 bg-white px-6 py-3 font-extrabold text-primary-strong shadow-sm transition hover:bg-primary-tint"
                >
                  Buy Now
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-white p-3">
                <Truck size={21} className="shrink-0 text-primary-strong" />
                <span className="text-xs font-bold leading-5">
                  Fast delivery across Egypt
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-white p-3">
                <ShieldCheck
                  size={21}
                  className="shrink-0 text-primary-strong"
                />
                <span className="text-xs font-bold leading-5">
                  100% Genuine pet products
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-white p-3">
                <RotateCcw size={21} className="shrink-0 text-primary-strong" />
                <span className="text-xs font-bold leading-5">
                  Friendly support team
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
                    {(Number(product.price || 0) * quantity).toLocaleString()} EGP
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

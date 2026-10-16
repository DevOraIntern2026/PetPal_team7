"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingBag,
  Heart,
  ArrowRight,
  PawPrint,
  SlidersHorizontal,
  Check,
  X,
  Sparkles,
} from "lucide-react";

import { useProducts } from "../../hooks/useProducts";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../lib/auth/AuthContext";
import { readSession } from "../../lib/auth/session";

const FAVORITES_KEY = "petmate-favorites";

function getProductBg(product, index) {
  if (product.bg) return product.bg;
  const bgs = ["bg-[#e4f4f8]", "bg-[#fff0e2]", "bg-[#f0f2df]", "bg-[#f7e9e3]"];
  return bgs[index % bgs.length];
}

export default function StorePage() {
  const { user, requireAuth } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [favorites, setFavorites] = useState([]);
  const [toast, setToast] = useState(null);

  const { products: apiProducts, loading: productsLoading } = useProducts({
    category,
    search,
  });

  const { itemCount: cartCount, addToCart } = useCart();

  useEffect(() => {
    try {
      setFavorites(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"));
    } catch {
      setFavorites([]);
    }
  }, []);

  const categories = useMemo(() => {
    const set = new Set(["All", "Food", "Toys", "Care", "Accessories"]);
    apiProducts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [apiProducts]);

  const filteredProducts = useMemo(() => {
    return apiProducts.filter((product) => {
      const matchesCategory =
        category === "All" ||
        String(product.category).toLowerCase() === category.toLowerCase();
      const matchesSearch = String(product.name || "")
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [apiProducts, category, search]);

  async function handleAddToCart(product) {
    const activeUser =
      user || (typeof window !== "undefined" ? readSession()?.user : null);
    if (!activeUser) {
      await addToCart(product, 1, { promptAuthIfGuest: false });
      requireAuth("shop", null, "/store/cart");
      return;
    }

    const added = await addToCart(product, 1, { promptAuthIfGuest: false });
    if (added) {
      setToast({
        title: "Added to your bag!",
        message: `${product.name} is ready for your pet.`,
        product,
      });
    }
  }

  function toggleFavorite(product) {
    const updated = favorites.includes(product.id)
      ? favorites.filter((id) => id !== product.id)
      : [...favorites, product.id];
    setFavorites(updated);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    setToast({
      title: updated.includes(product.id)
        ? "Saved to favorites"
        : "Removed from favorites",
      message: product.name,
      product: null,
    });
  }

  return (
    <main className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-30 border-b border-primary/10 bg-cream/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
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
          <nav className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden rounded-full px-4 py-2.5 text-sm font-bold text-ink-muted transition hover:bg-white hover:text-primary-strong sm:inline-flex"
            >
              ← Back to Home
            </Link>
            <Link
              href="/store/cart"
              className="relative inline-flex h-11 items-center gap-2 rounded-full bg-primary-strong px-4 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-deep"
            >
              <ShoppingBag size={19} />
              <span className="hidden sm:inline">My Bag</span>
              {cartCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-extrabold text-primary-strong">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/store/favorites"
              aria-label="View favorites"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/15 bg-white text-primary-strong transition hover:bg-primary-tint"
            >
              <Heart size={20} />
              {favorites.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-bold text-white">
                  {favorites.length}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-9 pt-8 sm:px-8 sm:pt-12">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-primary-tint px-6 py-10 sm:px-12 sm:py-14 lg:py-16">
          <div className="pointer-events-none absolute -right-12 -top-16 -z-10 h-64 w-64 rounded-full bg-white/60" />
          <div className="pointer-events-none absolute -bottom-24 right-36 -z-10 h-56 w-56 rounded-full bg-accent/10" />
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.15em] text-primary-strong shadow-sm">
              <Sparkles size={15} /> Made for your best friend
            </span>
            <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Little things.
              <br />
              <span className="text-primary-strong">Happier pets.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-ink-muted sm:text-lg">
              Discover everyday essentials, playful toys, and thoughtful care
              products for the pets who make life better.
            </p>
            <a
              href="#products"
              className="mt-7 inline-flex items-center gap-3 rounded-full bg-primary-strong px-6 py-3.5 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-deep"
            >
              Explore collection <ArrowRight size={18} />
            </a>
          </div>
          <div className="pointer-events-none absolute bottom-4 right-8 hidden text-8xl drop-shadow-sm sm:block lg:text-9xl">
            🐶
          </div>
        </div>
      </section>

      <section
        id="products"
        className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-20 sm:px-8"
      >
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-accent-strong">
              The PetMate collection
            </p>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Find their new favorite
            </h2>
            <p className="mt-3 text-ink-muted">
              Thoughtful picks for every kind of pet.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-primary/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink-muted md:self-auto">
            <SlidersHorizontal size={16} className="text-primary-strong" />{" "}
            {filteredProducts.length} products
          </div>
        </div>
        <div className="mt-7 flex flex-col gap-4 lg:flex-row lg:items-center">
          <label className="flex min-h-12 flex-1 items-center gap-3 rounded-full border border-primary/15 bg-white px-5 shadow-sm transition focus-within:border-primary-strong focus-within:ring-4 focus-within:ring-primary/10">
            <Search size={19} className="shrink-0 text-primary-strong" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search food, toys, accessories..."
              aria-label="Search products"
              className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-ink-muted/70"
            />
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full px-5 py-3 text-sm font-bold transition ${category === item ? "bg-primary-strong text-white shadow-sm" : "border border-primary/15 bg-white text-ink-muted hover:border-primary/30 hover:bg-primary-tint"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, index) => {
              const isFavorite = favorites.includes(product.id);
              const bg = getProductBg(product, index);

              return (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-[1.6rem] border border-primary/10 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl"
                >
                  <div
                    className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.2rem] ${bg}`}
                  >
                    <div className="absolute -bottom-10 -right-8 h-32 w-32 rounded-full bg-white/40 transition group-hover:scale-125" />
                    {product.tag && (
                      <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1.5 text-xs font-extrabold text-primary-strong shadow-sm">
                        {product.tag}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleFavorite(product)}
                      aria-label={
                        isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                      aria-pressed={isFavorite}
                      className={`absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105 ${isFavorite ? "text-accent" : "text-ink-muted hover:text-accent"}`}
                    >
                      <Heart
                        size={18}
                        fill={isFavorite ? "currentColor" : "none"}
                      />
                    </button>
                    <Link
                      href={`/store/${product.id}`}
                      aria-label={`View details for ${product.name}`}
                      className="relative flex h-full w-full items-center justify-center transition duration-300 group-hover:scale-105"
                    >
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-7xl drop-shadow-sm">
                          {product.emoji || "🐾"}
                        </span>
                      )}
                    </Link>
                  </div>
                  <div className="px-2 pb-2 pt-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-primary-strong">
                      {product.category}
                    </p>
                    <h3 className="mt-2 text-lg font-extrabold">
                      <Link
                        href={`/store/${product.id}`}
                        className="transition hover:text-primary-strong"
                      >
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-2 min-h-10 text-sm leading-5 text-ink-muted line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <p className="text-xl font-black">
                        {Number(product.price || 0).toLocaleString()}{" "}
                        <span className="text-xs font-bold text-ink-muted">
                          EGP
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="inline-flex h-11 items-center gap-2 rounded-full bg-primary-tint px-4 text-sm font-extrabold text-primary-strong transition hover:bg-primary-strong hover:text-white"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <ShoppingBag size={17} />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-[1.6rem] border border-primary/10 bg-white px-6 py-14 text-center">
            <span className="text-5xl">🐾</span>
            <h3 className="mt-4 text-xl font-extrabold">No products found</h3>
            <p className="mt-2 text-ink-muted">
              Try another search or choose a different category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-5 rounded-full bg-primary-strong px-5 py-3 font-bold text-white transition hover:bg-primary-deep"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {toast && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30 p-4 backdrop-blur-[2px] sm:items-center"
          onClick={() => setToast(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="store-toast-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md animate-in fade-in slide-in-from-bottom-3 rounded-[1.8rem] border border-primary/10 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-tint text-primary-strong">
                  <Check size={23} />
                </span>
                <div>
                  <h2 id="store-toast-title" className="text-lg font-black">
                    {toast.title}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-ink-muted">
                    {toast.message}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setToast(null)}
                aria-label="Close notification"
                className="rounded-full p-2 text-ink-muted transition hover:bg-primary-tint"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {toast.product && (
                <Link
                  href="/store/cart"
                  onClick={() => setToast(null)}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary-strong px-5 py-3 text-sm font-extrabold text-white transition hover:bg-primary-deep"
                >
                  View My Bag <ArrowRight size={17} />
                </Link>
              )}
              <button
                type="button"
                onClick={() => setToast(null)}
                className={`min-h-12 rounded-full border border-primary/15 px-5 py-3 text-sm font-extrabold text-primary-strong transition hover:bg-primary-tint ${toast.product ? "" : "sm:col-span-2"}`}
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

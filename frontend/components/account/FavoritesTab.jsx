"use client";

import { useEffect, useState } from "react";
import { Heart, ShoppingBag, Trash2, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useProducts, FALLBACK_PRODUCTS } from "../../hooks/useProducts";
import { useCart } from "../../hooks/useCart";

const FAVORITES_KEY = "petmate-favorites";
const money = (v) => `${Number(v || 0).toLocaleString("en-US")} EGP`;

export default function FavoritesTab() {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [addedId, setAddedId] = useState(null);

  const { products: apiProducts } = useProducts();
  const { addToCart } = useCart();

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setFavoriteIds(Array.isArray(parsed) ? parsed : []);
    } catch {
      setFavoriteIds([]);
    }
  }, []);

  function remove(id) {
    const next = favoriteIds.filter((item) => {
      const itemId = typeof item === "object" ? item?.id : item;
      return String(itemId) !== String(id);
    });
    setFavoriteIds(next);
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    } catch {}
  }

  async function handleAdd(product) {
    await addToCart(product, 1, { promptAuthIfGuest: false });
    setAddedId(product.id);
    setTimeout(() => {
      setAddedId(null);
    }, 1500);
  }

  if (!mounted) return null;

  if (!favoriteIds.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-ink/40">
        <div className="flex size-16 items-center justify-center rounded-3xl bg-rose-50 text-rose-400 mb-4 shadow-2xs">
          <Heart size={32} />
        </div>
        <h3 className="text-xl font-black text-ink">No favorites yet</h3>
        <p className="mt-1.5 max-w-sm text-sm text-ink/60">
          Tap the heart icon on any product in our store to save your favorite picks here.
        </p>
        <Link
          href="/store"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-strong px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-deep active:scale-95"
        >
          <ShoppingBag size={16} />
          <span>Browse Store</span>
        </Link>
      </div>
    );
  }

  // Combine products list for quick lookup
  const allAvailableProducts = [...(apiProducts || []), ...FALLBACK_PRODUCTS];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-ink">My Favorites</h2>
          <p className="text-xs text-ink/50 mt-0.5">
            {favoriteIds.length} item{favoriteIds.length === 1 ? "" : "s"} saved for later
          </p>
        </div>
        <Link
          href="/store"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-strong hover:underline"
        >
          <span>Explore more products</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {favoriteIds.map((item) => {
          const id = typeof item === "object" ? item?.id : item;

          // Lookup full product details from API or fallbacks
          const found = allAvailableProducts.find(
            (p) => String(p.id) === String(id),
          );

          const name =
            (typeof item === "object" && item?.name) ||
            found?.name ||
            `Product #${id}`;

          const price =
            (typeof item === "object" && (item?.price ?? item?.basePrice)) ??
            (found?.price ?? found?.basePrice ?? 0);

          const imageUrl =
            (typeof item === "object" && (item?.imageUrl || item?.image)) ||
            found?.imageUrl ||
            found?.image ||
            null;

          const category =
            (typeof item === "object" && item?.category) ||
            found?.category ||
            "Pet Essentials";

          const emoji =
            (typeof item === "object" && item?.emoji) ||
            found?.emoji ||
            "🐾";

          const productObject = found || {
            id,
            name,
            price,
            imageUrl,
            category,
            emoji,
          };

          return (
            <div
              key={id}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-2xs transition-all hover:border-primary/30 hover:shadow-md"
            >
              {/* Product Image / Visual frame */}
              <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#f0f9fb] to-[#e4f4f8]">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={name}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span className="text-6xl drop-shadow-sm transition-transform duration-300 group-hover:scale-110">
                    {emoji}
                  </span>
                )}

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => remove(id)}
                  className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/95 text-rose-500 shadow-md transition hover:scale-110 hover:bg-rose-50 hover:text-rose-600"
                  aria-label={`Remove ${name} from favorites`}
                  title="Remove from favorites"
                >
                  <Trash2 size={16} />
                </button>

                {/* Category tag */}
                {category && (
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-primary-strong shadow-2xs">
                    {category}
                  </span>
                )}
              </div>

              {/* Product Details */}
              <div className="flex flex-1 flex-col p-4">
                <Link
                  href={`/store/${id}`}
                  className="line-clamp-2 text-base font-extrabold text-ink transition hover:text-primary-strong"
                >
                  {name}
                </Link>

                {/* Price */}
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-lg font-black text-ink">
                    {money(price)}
                  </span>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 flex items-center gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => handleAdd(productObject)}
                    disabled={addedId === id}
                    className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full py-2.5 px-3 text-xs font-bold transition-all ${
                      addedId === id
                        ? "bg-emerald-600 text-white"
                        : "bg-primary-tint text-primary-strong hover:bg-primary-strong hover:text-white"
                    }`}
                  >
                    {addedId === id ? (
                      <>
                        <Check size={14} />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/store/${id}`}
                    className="flex size-9 items-center justify-center rounded-full border border-gray-200 text-ink/60 transition hover:border-primary hover:text-primary hover:bg-gray-50"
                    title="View details"
                  >
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

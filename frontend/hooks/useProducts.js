"use client";

import { useCallback, useEffect, useState } from "react";
import { productsApi, getErrorMessage } from "../lib/api";

export const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: "Premium Pet Food",
    category: "Food",
    price: 420,
    emoji: "🥣",
    bg: "bg-[#e4f4f8]",
    description: "Daily nutrition for happy, healthy pets.",
    tag: "Bestseller",
    imageUrl: "/images/pet-bowl.jpg",
    stockQuantity: 15,
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
    imageUrl: "/images/grooming-brush.jpg",
    stockQuantity: 20,
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
    imageUrl: "/images/pet-bed.jpg",
    stockQuantity: 10,
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
    imageUrl: "/images/pet-bed.jpg",
    stockQuantity: 8,
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
    imageUrl: "/images/dog-collar.jpg",
    stockQuantity: 30,
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
    imageUrl: "/images/grooming-brush.jpg",
    stockQuantity: 25,
  },
];

function isCanceledError(error) {
  return error?.name === "CanceledError" || error?.name === "AbortError";
}

export function useProducts({ category, search, page = 1, pageSize = 20 } = {}) {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(
    async (signal) => {
      setLoading(true);
      setError("");

      try {
        const data = await productsApi.list(
          { category, search, page, pageSize },
          signal,
        );

        const items = Array.isArray(data)
          ? data
          : (data?.items ??
            data?.data?.items ??
            data?.products ??
            data?.data?.products ??
            data?.data ??
            []);

        if (!signal?.aborted) {
          if (Array.isArray(items) && items.length > 0) {
            setProducts(items);
          } else {
            // Keep fallbacks if no items returned from API
            setProducts((prev) => (prev.length ? prev : FALLBACK_PRODUCTS));
          }
        }
      } catch (err) {
        if (!isCanceledError(err) && !signal?.aborted) {
          // If 401 or network error, fallback gracefully to sample products
          setError(getErrorMessage(err, "Failed to load products."));
          setProducts(FALLBACK_PRODUCTS);
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [category, search, page, pageSize],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);
    return () => controller.abort();
  }, [fetchProducts]);

  const refetch = useCallback(() => {
    return fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch };
}

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState("");

  const fetchProduct = useCallback(
    async (signal) => {
      if (!id) {
        setProduct(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await productsApi.get(id, signal);
        const item =
          response?.data?.product ??
          response?.data?.item ??
          response?.data ??
          response?.product ??
          response;

        if (!signal?.aborted) {
          setProduct(item);
        }
      } catch (err) {
        if (!isCanceledError(err) && !signal?.aborted) {
          const fallback = FALLBACK_PRODUCTS.find((p) => String(p.id) === String(id));
          if (fallback) {
            setProduct(fallback);
          } else {
            setError(getErrorMessage(err, "Failed to load product details."));
          }
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [id],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchProduct(controller.signal);
    return () => controller.abort();
  }, [fetchProduct]);

  return { product, loading, error, refetch: fetchProduct };
}


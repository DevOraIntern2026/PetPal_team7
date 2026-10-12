"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const products = [
  {
    id: 1,
    name: "Patterned Dog Collar",
    price: 250,
    image: "/images/dog-collar.jpg",
    category: "Accessories",
    tag: "Bestseller",
  },
  {
    id: 2,
    name: "Double Pet Food Bowl",
    price: 450,
    image: "/images/pet-bowl.jpg",
    category: "Feeding",
    tag: "Popular",
  },
  {
    id: 3,
    name: "Cozy Pet Bed",
    price: 800,
    image: "/images/pet-bed.jpg",
    category: "Comfort",
    tag: "Favorite",
  },
  {
    id: 4,
    name: "Grooming Brush",
    price: 180,
    image: "/images/grooming-brush.jpg",
    category: "Grooming",
    tag: null,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

export default function ProductsSection() {
  const [search, setSearch] = useState("");
  const [addedProducts, setAddedProducts] = useState([]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  function handleAdd(productId) {
    setAddedProducts((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }

  return (
    <section
      id="products"
      className="relative w-full overflow-hidden bg-cream px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20"
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-primary-tint/70 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-9 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-xl">
            {/* Label */}
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-tint px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-strong sm:text-xs"
            >
              <span className="h-2 w-2 rounded-full bg-primary" />
              Made with love for pets
            </motion.span>

            {/* Title */}
            <h2 className="text-title font-extrabold tracking-tight text-ink">
              Choices They’ll{" "}
              <span className="relative inline-block text-primary-strong">
                Love
                <motion.span
                  aria-hidden="true"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="absolute -bottom-1 left-0 h-1 w-full origin-left rounded-full bg-accent"
                />
              </span>
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-ink-muted sm:text-base">
              <span className="font-bold text-primary-strong">HERE</span>{" "}
              Quality you can trust. Care they can feel. Find little things that
              make your pet’s life happier.
            </p>
          </div>

          {/* Search */}
          <div className="w-full md:max-w-xs">
            <label
              htmlFor="product-search"
              className="mb-2 block text-xs font-semibold text-ink-muted"
            >
              Find their next favorite
            </label>

            <motion.div
              whileFocus={{ scale: 1.01 }}
              className="flex h-12 items-center gap-3 rounded-card border border-primary-tint bg-white px-4 shadow-sm transition-colors focus-within:border-primary-strong focus-within:ring-4 focus-within:ring-primary/10"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5 shrink-0 text-primary-strong"
                aria-hidden="true"
              >
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m15.5 15.5 5 5" />
              </svg>

              <input
                id="product-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products..."
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted/60"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Product count */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink">
            Our favorites{" "}
            <span className="ml-1 text-xs font-normal text-ink-muted">
              ({filteredProducts.length} items)
            </span>
          </p>

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-xs font-semibold text-primary-strong transition-colors hover:text-primary-deep hover:underline"
            >
              Clear search
            </button>
          )}
        </div>

        {/* Product cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => {
              const isAdded = addedProducts.includes(product.id);

              return (
                <motion.article
                  key={product.id}
                  layout
                  variants={cardVariants}
                  exit="exit"
                  whileHover={{ y: -6 }}
                  transition={{ layout: { duration: 0.25 } }}
                  className="group relative min-w-0 overflow-hidden rounded-card border border-primary-tint/70 bg-white shadow-card transition-shadow duration-300 hover:border-primary/40 hover:shadow-image"
                >
                  {/* Image area */}
                  <div className="relative m-2 flex aspect-square items-center justify-center overflow-hidden rounded-media bg-cream sm:m-3">
                    {product.tag && (
                      <span className="absolute left-2 top-2 z-10 rounded-full bg-white/95 px-2 py-1 text-[8px] font-bold text-primary-deep shadow-sm sm:left-3 sm:top-3 sm:text-[10px]">
                        {product.tag}
                      </span>
                    )}

                    <motion.img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      whileHover={{ scale: 1.09, rotate: 1 }}
                      transition={{ duration: 0.4 }}
                      className="h-full w-full object-contain p-2 sm:p-4"
                    />

                    <div className="absolute bottom-2 right-2 rounded-full bg-white/95 px-2 py-1 text-[8px] font-medium text-ink-muted sm:text-[10px]">
                      {product.category}
                    </div>
                  </div>

                  {/* Product details */}
                  <div className="px-3 pb-3 pt-1 sm:px-4 sm:pb-4">
                    <h3
                      title={product.name}
                      className="min-h-10 text-xs font-bold leading-5 text-ink sm:text-sm"
                    >
                      {product.name}
                    </h3>

                    <div className="mt-2 flex items-center justify-between gap-1">
                      <div className="min-w-0">
                        <p className="text-[9px] text-ink-muted sm:text-[10px]">
                          Price
                        </p>

                        <p className="text-sm font-extrabold text-primary-strong sm:text-base">
                          EGP {product.price}
                        </p>
                      </div>

                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.85 }}
                        onClick={() => handleAdd(product.id)}
                        aria-label={
                          isAdded
                            ? `Remove ${product.name} from selection`
                            : `Add ${product.name} to selection`
                        }
                        aria-pressed={isAdded}
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xl font-medium transition-colors sm:h-10 sm:w-10 ${
                          isAdded
                            ? "bg-primary-tint text-primary-deep"
                            : "bg-primary-tint text-primary-strong hover:bg-primary hover:text-white"
                        }`}
                      >
                        <motion.span
                          key={isAdded ? "added" : "add"}
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {isAdded ? "✓" : "+"}
                        </motion.span>
                      </motion.button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty search state */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-feature bg-primary-tint px-5 py-12 text-center"
          >
            <div className="mb-3 text-4xl" aria-hidden="true">
              🐾
            </div>

            <h3 className="font-bold text-ink">No products found</h3>

            <p className="mt-2 text-sm text-ink-muted">
              Try another name to find something for your furry friend.
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 rounded-full bg-primary-strong px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-deep"
            >
              Show all products
            </button>
          </motion.div>
        )}

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center text-xs text-ink-muted sm:mt-10"
        />
      </div>
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import FadeIn from "../shared/FadeIn";
import PetCard from "./PetCard";
import { pets } from "../../lib/adoptionPets";

const TYPES = ["All", "Dogs", "Cats", "Other"];

const SORTS = {
  newest: { label: "Newest", fn: (a, b) => b.id - a.id },
  name: { label: "Name (A-Z)", fn: (a, b) => a.name.localeCompare(b.name) },
  city: { label: "City (A-Z)", fn: (a, b) => a.city.localeCompare(b.city) },
};

export default function PetSection() {
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("newest");
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const visiblePets = useMemo(() => {
    const filtered =
      type === "All" ? pets : pets.filter((p) => p.type === type);
    return [...filtered].sort(SORTS[sort].fn);
  }, [type, sort]);

  return (
    <section
      id="available"
      className="mx-auto max-w-content px-4 py-12 font-display md:px-10"
    >
      {/* Heading */}
      <FadeIn className="text-center">
        <h2 className="text-title font-bold text-primary-strong">
          Available for Adoption
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          Meet the animals waiting for a loving home.
        </p>
      </FadeIn>

      {/* Toolbar: filters + sort */}
      <div className="mb-8 mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by type"
        >
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              aria-pressed={type === t}
              className={`focus-ring rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                type === t
                  ? "bg-primary-strong text-white"
                  : "bg-primary-tint text-primary-strong hover:bg-primary-tint/70"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-ink-muted">
          Sort by
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="focus-ring rounded-full border border-primary-strong/30 bg-white px-3 py-1.5 text-ink"
          >
            {Object.entries(SORTS).map(([key, s]) => (
              <option key={key} value={key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Grid */}
      {visiblePets.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visiblePets.map((pet, index) => (
            <FadeIn key={pet.id} delay={index * 0.08}>
              <PetCard
                pet={pet}
                isFav={favorites.includes(pet.id)}
                onToggleFavorite={toggleFavorite}
              />
            </FadeIn>
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-ink-muted">No pets found.</p>
      )}
    </section>
  );
}

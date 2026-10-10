"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaw, FaHeart, FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";

const pets = [
  {
    id: 1,
    name: "Sky",
    type: "Other",
    breed: "Bird",
    gender: "Female",
    city: "Cairo",
    image:
      "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=85",
  },
  {
    id: 2,
    name: "Rosie",
    type: "Dogs",
    breed: "Golden Retriever",
    gender: "Female",
    city: "Cairo",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=85",
  },
  {
    id: 3,
    name: "Luna",
    type: "Cats",
    breed: "Tabby Cat",
    gender: "Male",
    city: "Alex",
    image:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=85",
  },
  {
    id: 4,
    name: "Oreo",
    type: "Other",
    breed: "Rabbit",
    gender: "Male",
    city: "Cairo",
    image:
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=85",
  },
];

const pawPositions = [
  { top: "2%", left: "8%", rotate: "-20deg" },
  { top: "3%", left: "30%", rotate: "15deg" },
  { top: "1%", left: "70%", rotate: "-15deg" },
  { top: "18%", left: "3%", rotate: "20deg" },
  { top: "16%", left: "92%", rotate: "-25deg" },
  { top: "35%", left: "12%", rotate: "15deg" },
  { top: "29%", left: "82%", rotate: "-15deg" },
  { top: "53%", left: "4%", rotate: "-25deg" },
  { top: "56%", left: "94%", rotate: "20deg" },
  { top: "72%", left: "14%", rotate: "-10deg" },
  { top: "76%", left: "85%", rotate: "15deg" },
  { top: "90%", left: "6%", rotate: "15deg" },
  { top: "91%", left: "44%", rotate: "-15deg" },
  { top: "90%", left: "76%", rotate: "25deg" },
  { top: "42%", left: "55%", rotate: "15deg" },
  { top: "8%", left: "53%", rotate: "20deg" },
];

const filters = ["ALL", "Dogs", "Cats", "Near", "Other"];

export default function AdoptionSection() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [favorites, setFavorites] = useState([]);
  const [showLocations, setShowLocations] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Cairo");

  const filteredPets = useMemo(() => {
    if (activeFilter === "ALL") return pets;

    if (activeFilter === "Near") {
      return pets.filter((pet) => pet.city === selectedCity);
    }

    return pets.filter((pet) => pet.type === activeFilter);
  }, [activeFilter, selectedCity]);

  const toggleFavorite = (id) => {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((favoriteId) => favoriteId !== id)
        : [...previous, id],
    );
  };

  return (
    <section
      id="adoption-pets"
      className="relative isolate min-h-[600px] w-full overflow-hidden bg-white px-4 py-12 font-sans text-[#252525] sm:px-6 sm:py-16 lg:px-10 lg:py-20"
    >
      {/* Decorative paw-print background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        {pawPositions.map((paw, index) => (
          <FaPaw
            key={index}
            className="absolute h-7 w-7 text-[#2DAAC1] opacity-[0.055] sm:h-9 sm:w-9"
            style={{
              top: paw.top,
              left: paw.left,
              transform: `rotate(${paw.rotate})`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-7xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
          className="mb-9 text-center md:mb-12"
        >
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-[#2DAAC1] sm:text-4xl lg:text-5xl">
            A New Home. A New Story
          </h2>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-500 sm:text-base">
            Sweet pets looking for a safe home, a loving
            <br className="hidden sm:block" /> heart, and a second chance at
            happiness.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="relative z-20 mb-9 flex flex-wrap items-center justify-center gap-3 sm:mb-12 sm:gap-5">
          {filters.map((filter) => (
            <div key={filter} className="relative">
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (filter === "Near") {
                    setActiveFilter("Near");
                    setShowLocations((previous) => !previous);
                  } else {
                    setActiveFilter(filter);
                    setShowLocations(false);
                  }
                }}
                className={`flex h-10 min-w-[90px] items-center justify-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors duration-200 ${
                  activeFilter === filter
                    ? "border-[#2DAAC1] bg-[#2DAAC1] text-white"
                    : "border-[#2DAAC1] bg-white/90 text-[#252525] hover:bg-[#eaf9fc]"
                }`}
                aria-pressed={activeFilter === filter}
              >
                {filter}

                {filter === "Near" && (
                  <FaChevronDown
                    className={`h-3 w-3 transition-transform ${
                      showLocations ? "rotate-180" : ""
                    }`}
                  />
                )}
              </motion.button>

              {filter === "Near" && showLocations && (
                <div className="absolute left-1/2 top-12 z-30 min-w-[140px] -translate-x-1/2 overflow-hidden rounded-xl border border-slate-100 bg-white p-1 shadow-lg">
                  {["Cairo", "Alex"].map((city) => (
                    <button
                      type="button"
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setActiveFilter("Near");
                        setShowLocations(false);
                      }}
                      className={`block w-full rounded-lg px-4 py-2.5 text-left text-sm hover:bg-[#eaf9fc] ${
                        selectedCity === city
                          ? "font-semibold text-[#239bb2]"
                          : "text-slate-700"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pet cards */}
        <motion.div
          layout
          className="mx-auto grid w-full grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredPets.map((pet, index) => (
              <motion.article
                layout
                key={pet.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.25, delay: index * 0.055 }}
                whileHover={{ y: -5 }}
                className="group min-w-0 overflow-hidden rounded-2xl border border-[#f1f0d9] bg-white shadow-[0_5px_24px_rgba(25,65,70,0.05)] transition-shadow duration-300 hover:border-[#D5F0F2] hover:shadow-[0_15px_35px_rgba(25,120,130,0.12)] sm:rounded-3xl"
              >
                {/* Image */}
                <div className="relative h-[160px] overflow-hidden sm:h-[220px] lg:h-[280px]">
                  <motion.img
                    src={pet.image}
                    alt={pet.name}
                    loading="lazy"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.4 }}
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => toggleFavorite(pet.id)}
                    aria-label={
                      favorites.includes(pet.id)
                        ? `Remove ${pet.name} from favorites`
                        : `Add ${pet.name} to favorites`
                    }
                    aria-pressed={favorites.includes(pet.id)}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition-transform hover:scale-110"
                  >
                    <FaHeart
                      className={`h-4 w-4 ${
                        favorites.includes(pet.id)
                          ? "text-rose-500"
                          : "text-[#555555]"
                      }`}
                    />
                  </button>
                </div>

                {/* Pet details */}
                <div className="p-3 sm:p-4">
                  <h3 className="truncate text-sm font-bold leading-5 text-[#222222] sm:text-base">
                    {pet.name}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    {pet.breed}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="min-w-0 text-xs leading-relaxed text-[#555555] sm:text-sm">
                      <p>{pet.gender}</p>

                      <p className="flex items-center gap-1 truncate">
                        <FaMapMarkerAlt className="shrink-0 text-[#2DAAC1]" />
                        {pet.city}
                      </p>
                    </div>

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.94 }}
                      onClick={() => {
                        window.alert(
                          `Thanks for choosing ${pet.name}! Adoption details will be available soon.`,
                        );
                      }}
                      className="shrink-0 rounded-full bg-[#2DAAC1] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#218da2] sm:px-4 sm:text-sm"
                    >
                      Adopt me
                    </motion.button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredPets.length === 0 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-12 text-center text-sm text-slate-500"
          >
            No pets found in this category yet.
          </motion.p>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mt-8 flex justify-center sm:mt-10 sm:justify-end"
        >
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              setActiveFilter("ALL");
              setShowLocations(false);
              document
                .getElementById("adoption-pets")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="flex h-11 w-[150px] items-center justify-center gap-2 rounded-full bg-[#2DAAC1] text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#218da2] hover:shadow-md"
          >
            Go Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

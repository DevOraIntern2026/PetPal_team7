"use client";

import { useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import FadeIn from "../shared/FadeIn";
import PetCard from "./PetCard";
import ListingFormModal from "./ListingFormModal";
import { useListings, useMyListings } from "../../hooks/useAdoption";
import { adoptionApi, getErrorMessage } from "../../lib/api";
import { useAuth } from "../../lib/auth/AuthContext";

const SORTS = {
  newest: {
    label: "Newest",
    fn: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  },
  name: { label: "Name (A-Z)", fn: (a, b) => a.name.localeCompare(b.name) },
  city: {
    label: "Location (A-Z)",
    fn: (a, b) => a.location.localeCompare(b.location),
  },
};

const LISTING_PARAMS = { page: 1, pageSize: 20 };

export default function PetSection() {
  const { user, requireAuth } = useAuth();
  const myId = user?.id ?? user?.userId;

  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'my'
  const [sort, setSort] = useState("newest");
  const [favorites, setFavorites] = useState([]);
  const [modal, setModal] = useState({ open: false, listing: null });

  const all = useListings(LISTING_PARAMS);
  const mine = useMyListings(LISTING_PARAMS, {
    enabled: activeTab === "my" && !!user,
  });

  const current = activeTab === "my" ? mine : all;
  const { data, loading, error } = current;

  const toggleFavorite = (id) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const visiblePets = useMemo(
    () => [...(data?.items ?? [])].sort(SORTS[sort].fn),
    [data, sort],
  );

  const refreshAll = () => {
    all.refetch();
    mine.refetch();
  };

  const openCreate = () =>
    requireAuth("post a listing", () =>
      setModal({ open: true, listing: null }),
    );

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      await adoptionApi.remove(id);
      refreshAll();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const tabCls = (key) =>
    `rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
      activeTab === key
        ? "bg-white text-primary-strong shadow-sm"
        : "text-ink-muted hover:text-ink"
    }`;

  return (
    <section
      id="available"
      className="mx-auto max-w-content px-4 py-12 font-display md:px-10"
    >
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h2 className="text-title font-bold text-primary-strong">
            Available for Adoption
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Meet the animals waiting for a loving home, or list one for
            adoption.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-full bg-primary-strong px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:opacity-90"
        >
          <FaPlus size={14} /> Add Adoption Listing
        </button>
      </div>

      <div className="mb-8 mt-8 flex flex-col justify-between gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
        <div className="flex gap-2 rounded-xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={tabCls("all")}
          >
            All Pets
          </button>
          <button
            type="button"
            onClick={() =>
              requireAuth("view your listings", () => setActiveTab("my"))
            }
            className={tabCls("my")}
          >
            My Listings
          </button>
        </div>

        <label className="flex items-center gap-2 text-sm text-ink-muted">
          Sort by
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="focus-ring rounded-full border border-primary-strong/30 bg-white px-3 py-1.5 text-ink outline-none"
          >
            {Object.entries(SORTS).map(([key, s]) => (
              <option key={key} value={key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="min-h-112.5">
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 py-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm animate-pulse"
              >
                <div className="h-48 w-full bg-gray-200" />
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div className="h-5 w-28 bg-gray-200 rounded-md" />
                    <div className="h-4 w-12 bg-gray-200 rounded-md" />
                  </div>
                  <div className="h-4 w-20 bg-gray-200 rounded-md" />
                  <div className="h-9 w-full bg-gray-200 rounded-xl mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <p className="py-16 text-center text-red-600">{error}</p>
        )}

        {!loading && !error && visiblePets.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visiblePets.map((pet, index) => {
              const isOwner =
                activeTab === "my" || (myId && pet.ownerId === myId);
              return (
                <FadeIn
                  key={pet.id}
                  delay={index * 0.05}
                  className="flex flex-col"
                >
                  <PetCard
                    pet={pet}
                    isFav={favorites.includes(pet.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                  {isOwner && (
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setModal({ open: true, listing: pet })}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <FaEdit size={13} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(pet.id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 py-1.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <FaTrash size={13} /> Delete
                      </button>
                    </div>
                  )}
                </FadeIn>
              );
            })}
          </div>
        )}

        {!loading && !error && visiblePets.length === 0 && (
          <p className="py-16 text-center text-ink-muted">
            {activeTab === "my"
              ? "You haven't posted any adoption listings yet."
              : "No pets found."}
          </p>
        )}
      </div>

      {modal.open && (
        <ListingFormModal
          listing={modal.listing}
          onClose={() => setModal({ open: false, listing: null })}
          onSaved={() => {
            setModal({ open: false, listing: null });
            refreshAll();
          }}
        />
      )}
    </section>
  );
}

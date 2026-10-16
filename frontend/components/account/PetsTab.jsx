"use client";

import { useState } from "react";
import { Plus, Trash2, PawPrint, Calendar, Weight, Ruler, Heart, X, Upload } from "lucide-react";
import { usePets } from "../../hooks/usePets";

export default function PetsTab() {
  const {
    pets,
    petTypes,
    loading,
    createPet,
    deletePet,
    fetchBreeds,
    uploadPetImage,
  } = usePets();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [breeds, setBreeds] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    petTypeId: "",
    breedId: "",
    gender: "Female",
    birthDate: "2024-05-10",
    weightKg: 10,
    heightCm: 40,
    personality: "Friendly and playful",
    profileImageUrl: "",
  });

  async function handlePetTypeChange(typeId) {
    setFormData((prev) => ({ ...prev, petTypeId: typeId, breedId: "" }));
    const bList = await fetchBreeds(typeId);
    setBreeds(bList);
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadPetImage(file);
      setFormData((prev) => ({ ...prev, profileImageUrl: url }));
    } catch {}
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createPet({
        ...formData,
        weightKg: Number(formData.weightKg) || 0,
        heightCm: Number(formData.heightCm) || 0,
      });
      setIsModalOpen(false);
      setFormData({
        name: "",
        petTypeId: "",
        breedId: "",
        gender: "Female",
        birthDate: "2024-05-10",
        weightKg: 10,
        heightCm: 40,
        personality: "",
        profileImageUrl: "",
      });
    } catch {
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6">
        <div>
          <h1 className="text-2xl font-black text-ink sm:text-3xl">My Pets</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Manage your pet family and their records.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-primary-strong px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-primary-deep"
        >
          <Plus size={18} /> Add Pet
        </button>
      </div>

      {/* Pets Grid */}
      {loading ? (
        <div className="rounded-2xl border border-primary/10 bg-white p-12 text-center text-ink-muted">
          Loading pets…
        </div>
      ) : pets.length === 0 ? (
        <div className="rounded-3xl border border-primary/10 bg-white p-12 text-center">
          <PawPrint size={44} className="mx-auto text-primary-strong/40" />
          <h3 className="mt-4 text-xl font-black text-ink">No pets added yet</h3>
          <p className="mt-2 text-sm text-ink-muted">
            Add your furry, feathered, or scaly family member.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-strong px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-deep"
          >
            <Plus size={18} /> Add Your First Pet
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="overflow-hidden rounded-3xl border border-primary/15 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative h-48 w-full bg-primary-tint/40">
                {pet.profileImageUrl ? (
                  <img
                    src={pet.profileImageUrl}
                    alt={pet.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-5xl">
                    🐾
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => deletePet(pet.id)}
                  aria-label={`Delete ${pet.name}`}
                  className="absolute right-3.5 top-3.5 flex size-9 items-center justify-center rounded-full bg-white/90 text-ink-muted shadow-sm transition hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-xl font-black text-ink">{pet.name}</h3>
                  <span className="rounded-full bg-primary-tint px-3 py-1 text-xs font-extrabold text-primary-strong">
                    {pet.gender || "Pet"}
                  </span>
                </div>

                <p className="mt-1 text-xs font-bold text-ink-muted">
                  {pet.petTypeName || "Pet"}{" "}
                  {pet.breedName ? `• ${pet.breedName}` : ""}
                </p>

                {pet.personality && (
                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-ink/70">
                    "{pet.personality}"
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-4 border-t border-primary/10 pt-4 text-xs font-medium text-ink-muted">
                  {pet.birthDate && (
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-primary-strong" />{" "}
                      {pet.birthDate}
                    </span>
                  )}
                  {pet.weightKg && (
                    <span className="flex items-center gap-1.5">
                      <Weight size={14} className="text-primary-strong" />{" "}
                      {pet.weightKg} kg
                    </span>
                  )}
                  {pet.heightCm && (
                    <span className="flex items-center gap-1.5">
                      <Ruler size={14} className="text-primary-strong" />{" "}
                      {pet.heightCm} cm
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Pet Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-primary/10 bg-white p-6 shadow-2xl sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-primary/10">
              <h2 className="text-xl font-black text-ink">Add a New Pet</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-ink-muted transition hover:bg-cream"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="mb-1 block text-xs font-bold text-ink-muted">
                  Pet Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rosy"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-primary/15 bg-cream/50 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-primary-strong focus:bg-white text-ink"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-ink-muted">
                    Type *
                  </label>
                  <select
                    value={formData.petTypeId}
                    onChange={(e) => handlePetTypeChange(e.target.value)}
                    className="w-full rounded-2xl border border-primary/15 bg-cream/50 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-primary-strong focus:bg-white text-ink"
                  >
                    <option value="">Select type</option>
                    {petTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-ink-muted">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-primary/15 bg-cream/50 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-primary-strong focus:bg-white text-ink"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
              </div>

              {breeds.length > 0 && (
                <div>
                  <label className="mb-1 block text-xs font-bold text-ink-muted">
                    Breed
                  </label>
                  <select
                    value={formData.breedId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        breedId: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-primary/15 bg-cream/50 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-primary-strong focus:bg-white text-ink"
                  >
                    <option value="">Select breed</option>
                    {breeds.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-ink-muted">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        birthDate: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-primary/15 bg-cream/50 px-3 py-2 text-xs font-semibold outline-none focus:border-primary-strong focus:bg-white text-ink"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-ink-muted">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weightKg}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        weightKg: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-primary/15 bg-cream/50 px-3 py-2 text-xs font-semibold outline-none focus:border-primary-strong focus:bg-white text-ink"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-ink-muted">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.heightCm}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        heightCm: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-primary/15 bg-cream/50 px-3 py-2 text-xs font-semibold outline-none focus:border-primary-strong focus:bg-white text-ink"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-ink-muted">
                  Personality & Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.personality}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      personality: e.target.value,
                    }))
                  }
                  placeholder="Playful, friendly with other pets..."
                  className="w-full rounded-2xl border border-primary/15 bg-cream/50 px-3.5 py-2 text-sm font-semibold outline-none focus:border-primary-strong focus:bg-white text-ink"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-ink-muted">
                  Pet Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-xs text-ink-muted file:mr-3 file:rounded-full file:border-0 file:bg-primary-tint file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-primary-strong hover:file:bg-primary/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-primary/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full px-5 py-2.5 text-sm font-bold text-ink-muted hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-primary-strong px-6 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-primary-deep disabled:opacity-50"
                >
                  {submitting ? "Adding…" : "Save Pet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

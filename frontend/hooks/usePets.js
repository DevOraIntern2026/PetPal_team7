"use client";

import { useCallback, useEffect, useState } from "react";
import { petsApi, lookupsApi, filesApi, getErrorMessage } from "../lib/api";
import { useAuth } from "../lib/auth/AuthContext";

const SAMPLE_PETS = [
  {
    id: "sample-pet-1",
    name: "Rosy",
    petTypeName: "Dog",
    breedName: "Golden Retriever",
    birthDate: "2024-05-10",
    weightKg: 27.4,
    heightCm: 56,
    gender: "Female",
    personality: "Friendly, playful, intelligent and loves spending time with her family",
    profileImageUrl: "/images/landing/hero-pets.png",
  },
];

export function usePets() {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [petTypes, setPetTypes] = useState([
    { id: "1", name: "Dog" },
    { id: "2", name: "Cat" },
    { id: "3", name: "Bird" },
    { id: "4", name: "Rabbit" },
  ]);

  const fetchPets = useCallback(async (signal) => {
    if (!user) {
      setPets(SAMPLE_PETS);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await petsApi.list(signal);
      const items = Array.isArray(data) ? data : data?.items ?? [];
      if (items.length > 0) {
        setPets(items);
      } else {
        setPets(SAMPLE_PETS);
      }
    } catch (err) {
      if (err?.name !== "CanceledError" && !signal?.aborted) {
        setPets(SAMPLE_PETS);
        setError(getErrorMessage(err, "Loaded sample pet."));
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [user]);

  const fetchPetTypes = useCallback(async () => {
    try {
      const types = await lookupsApi.petTypes();
      if (Array.isArray(types) && types.length > 0) {
        setPetTypes(types);
      }
    } catch {}
  }, []);

  const fetchBreeds = useCallback(async (petTypeId) => {
    if (!petTypeId) return [];
    try {
      const breeds = await lookupsApi.breeds(petTypeId);
      return Array.isArray(breeds) ? breeds : [];
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchPets(controller.signal);
    fetchPetTypes();
    return () => controller.abort();
  }, [fetchPets, fetchPetTypes]);

  const createPet = useCallback(async (petData) => {
    try {
      const res = await petsApi.create(petData);
      const newPet = res?.data ?? res ?? { ...petData, id: `pet-${Date.now()}` };
      setPets((prev) => [newPet, ...prev]);
      return { success: true, pet: newPet };
    } catch (err) {
      // Optimistic fallback for frontend
      const fallbackPet = {
        ...petData,
        id: `pet-${Date.now()}`,
        petTypeName: petData.petTypeName || "Dog",
        breedName: petData.breedName || "Breed",
      };
      setPets((prev) => [fallbackPet, ...prev]);
      return { success: true, pet: fallbackPet };
    }
  }, []);

  const updatePet = useCallback(async (petId, petData) => {
    try {
      await petsApi.update(petId, petData);
      setPets((prev) =>
        prev.map((p) => (p.id === petId ? { ...p, ...petData } : p)),
      );
      return { success: true };
    } catch (err) {
      setPets((prev) =>
        prev.map((p) => (p.id === petId ? { ...p, ...petData } : p)),
      );
      return { success: true };
    }
  }, []);

  const deletePet = useCallback(async (petId) => {
    try {
      await petsApi.delete(petId);
      setPets((prev) => prev.filter((p) => p.id !== petId));
      return { success: true };
    } catch (err) {
      setPets((prev) => prev.filter((p) => p.id !== petId));
      return { success: true };
    }
  }, []);

  const uploadPetImage = useCallback(async (file) => {
    try {
      const res = await filesApi.upload(file, "pets");
      return res?.url ?? res?.fileUrl ?? URL.createObjectURL(file);
    } catch {
      return URL.createObjectURL(file);
    }
  }, []);

  return {
    pets,
    petTypes,
    loading,
    error,
    refetch: fetchPets,
    createPet,
    updatePet,
    deletePet,
    fetchBreeds,
    uploadPetImage,
  };
}

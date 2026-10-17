"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useListing } from "../../../hooks/useAdoption";

export default function PetDetailsPage({ params }) {
  const { id } = use(params);
  const { data: pet, loading, error } = useListing(id);

  if (loading) {
    return (
      <section className="mx-auto max-w-content px-4 py-20 text-center font-display text-ink-muted">
        Loading...
      </section>
    );
  }

  if (error || !pet) {
    return (
      <section className="mx-auto max-w-content px-4 py-20 text-center font-display">
        <p className="text-ink-muted">{error || "Listing not found."}</p>
        <Link href="/adoption" className="btn-secondary mt-6 inline-block">
          Back to listings
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-content px-4 py-10 font-display md:px-10">
      <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
        {/* Image */}
        <div className="relative h-80 overflow-hidden rounded-card shadow-card md:h-96">
          <Image
            src={pet.image}
            alt={pet.name}
            fill
            priority
            unoptimized
            sizes="(min-width: 768px) 55vw, 100vw"
            className="object-cover"
          />
        </div>

        {/* Summary */}
        <div className="flex flex-col justify-center">
          <h1 className="text-title font-bold text-ink">{pet.name}</h1>
          {!pet.isAvailable && (
            <span className="mt-1 w-fit rounded-full bg-primary-tint px-3 py-1 text-xs font-semibold text-primary-strong">
              {pet.status}
            </span>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-ink-muted">
            <span>{pet.gender}</span>
            <span>{pet.age}</span>
            <span>{pet.weightKg} kg</span>
            <span className="flex items-center gap-1">
              <FaMapMarkerAlt className="h-3 w-3 text-primary-strong" />
              {pet.location}
            </span>
          </div>

          <p className="mt-4 text-lg font-bold text-primary-strong">
            {pet.isFree ? "Free" : `${pet.price} EGP`}
          </p>

          {pet.about && (
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              {pet.about}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:max-w-xs">
            <button
              type="button"
              disabled
              className="btn-primary cursor-not-allowed opacity-60"
              title="Contact info is not available yet"
            >
              Contact owner (soon)
            </button>
            <Link href="/adoption" className="btn-secondary">
              Back to listings
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

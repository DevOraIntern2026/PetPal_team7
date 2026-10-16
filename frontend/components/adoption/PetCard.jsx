"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaHeart, FaMapMarkerAlt } from "react-icons/fa";

export default function PetCard({ pet, isFav, onToggleFavorite }) {
  const detailsHref = `/adoption/${pet.id}`;

  return (
    <article className="flex flex-col overflow-hidden rounded-card bg-white shadow-card">
      <div className="relative h-40 overflow-hidden sm:h-55 lg:h-70">
        {/* Image links to the details page */}
        <Link
          href={detailsHref}
          aria-label={`View details for ${pet.name}`}
          className="focus-ring block h-full w-full"
        >
          <motion.div
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.4 }}
            className="relative h-full w-full"
          >
            <Image
              src={pet.image}
              alt={pet.name}
              fill
              unoptimized
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </Link>

        {/* Price badge */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary-strong shadow-sm">
          {pet.isFree ? "Free" : `${pet.price} EGP`}
        </span>

        <button
          type="button"
          onClick={() => onToggleFavorite(pet.id)}
          aria-label={
            isFav
              ? `Remove ${pet.name} from favorites`
              : `Add ${pet.name} to favorites`
          }
          aria-pressed={isFav}
          className="focus-ring absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition-transform hover:scale-110"
        >
          <FaHeart
            className={`h-4 w-4 ${isFav ? "text-accent-strong" : "text-ink-muted"}`}
          />
        </button>

        {/* Status badge (only when not available) */}
        {!pet.isAvailable && (
          <span className="absolute bottom-3 left-3 rounded-full bg-primary-strong px-3 py-1 text-xs font-semibold text-white">
            {pet.status}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-bold text-ink">
          <Link href={detailsHref} className="hover:text-primary-strong">
            {pet.name}
          </Link>
        </h3>
        <p className="text-sm text-ink-muted">
          {pet.gender} · {pet.age}
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
          <FaMapMarkerAlt className="h-3 w-3 text-primary-strong" />
          {pet.location}
        </p>

        <Link href={detailsHref} className="btn-primary mt-4 text-center">
          View details
        </Link>
      </div>
    </article>
  );
}

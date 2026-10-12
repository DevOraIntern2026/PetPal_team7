"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaHeart, FaMapMarkerAlt } from "react-icons/fa";
import { useAuth } from "../../lib/auth/AuthContext";

export default function PetCard({ pet, isFav, onToggleFavorite }) {
  const router = useRouter();
  const { requireAuth } = useAuth();

  const detailsHref = `/adoption/${pet.id}`;

  // Opens the sign-in modal if the user is not signed in
  const handleAdopt = () => {
    requireAuth("adopt", () => router.push(`/adoption/${pet.id}/apply`));
  };

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
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </Link>

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
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-bold text-ink">
          <Link href={detailsHref} className="hover:text-primary-strong">
            {pet.name}
          </Link>
        </h3>
        <p className="text-sm text-ink-muted">
          {pet.breed} · {pet.gender}
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
          <FaMapMarkerAlt className="h-3 w-3 text-primary-strong" />
          {pet.city}
        </p>

        <button
          type="button"
          onClick={handleAdopt}
          className="btn-primary mt-4"
        >
          Adopt
        </button>
      </div>
    </article>
  );
}

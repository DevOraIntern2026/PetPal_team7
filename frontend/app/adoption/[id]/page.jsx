import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaMapMarkerAlt } from "react-icons/fa";
import { getPetById } from "../../../lib/adoptionPets";
import PetTabs from "../../../components/adoption/PetTabs";
import ApplyButton from "../../../components/adoption/ApplyButton";

export default async function PetDetailsPage({ params }) {
  const { id } = await params;
  const pet = getPetById(id);

  if (!pet) notFound();

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
            sizes="(min-width: 768px) 55vw, 100vw"
            className="object-cover"
          />
        </div>

        {/* Summary */}
        <div className="flex flex-col justify-center">
          <h1 className="text-title font-bold text-ink">{pet.name}</h1>
          <p className="text-sm text-ink-muted">{pet.breed}</p>

          <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-ink-muted">
            <span>{pet.gender}</span>
            <span>{pet.age}</span>
            <span className="flex items-center gap-1">
              <FaMapMarkerAlt className="h-3 w-3 text-primary-strong" />
              {pet.city}
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:max-w-xs">
            <ApplyButton petId={pet.id} />
            <Link href="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <PetTabs pet={pet} />
    </section>
  );
}

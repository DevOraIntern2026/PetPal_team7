import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPetById } from "../../../../lib/adoptionPets";
import ApplyForm from "../../../../components/adoption/ApplyForm";

export default async function ApplyPage({ params }) {
  const { id } = await params;
  const pet = getPetById(id);

  if (!pet) notFound();

  return (
    <Suspense fallback={null}>
      <ApplyForm pet={pet} />
    </Suspense>
  );
}

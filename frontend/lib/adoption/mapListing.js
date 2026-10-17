function formatAge(months) {
  if (months == null) return "";
  if (months < 12) return `${months} ${months === 1 ? "month" : "months"}`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const y = `${years} ${years === 1 ? "year" : "years"}`;
  return rem ? `${y} ${rem} mo` : y;
}

export function mapListing(l) {
  return {
    id: l.id,
    ownerId: l.ownerId,
    name: l.petName,
    location: l.location,
    gender: l.gender,
    price: l.price,
    isFree: Number(l.price) === 0,
    weightKg: l.weightKg,
    age: formatAge(l.ageInMonths),
    about: l.about ?? "",
    image: l.imageUrl || "/images/landing/adopt.webp",
    status: l.status,
    isAvailable: l.status === "Available",
    createdAt: l.createdAt,
    //     ageInMonths: l.ageInMonths,
    // rawImageUrl: l.imageUrl,
  };
}

// TODO: fetch pets from backend
export const pets = [
  {
    id: 1,
    name: "Sky",
    type: "Other",
    breed: "Bird",
    gender: "Female",
    city: "Cairo, Egypt",
    age: "1 year",
    image: "/images/landing/adopt.webp",
    about: "Cheerful and loves to sing in the morning.",
    health: "Healthy and active. Last checkup: 1 month ago.",
    personality: "Cheerful, curious and loves company.",
    adoptionInfo: "Adoption fee: free. Cage and food guide included.",
  },
  {
    id: 2,
    name: "Rosie",
    type: "Dogs",
    breed: "Golden Retriever",
    gender: "Female",
    city: "Cairo, Egypt",
    age: "3 years",
    image: "/images/landing/adopt.webp",
    about:
      "Rosie is a friendly golden retriever who loves playing out doors, spending time with people, and learning new tricks, she is looking for a loving family to call home.",
    health:
      "Vaccinated, neutered, and in great health. Last checkup: 2 months ago.",
    personality: "Friendly, playful, intelligent and great with kids.",
    adoptionInfo:
      "Adoption fee: free. Home visit required before final approval.",
  },
];

export const getPetById = (id) => pets.find((p) => String(p.id) === String(id));

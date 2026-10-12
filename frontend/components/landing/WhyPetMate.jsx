import Image from "next/image";
import FadeIn from "../shared/FadeIn";

const features = [
  {
    title: "Pet Health",
    description:
      "Keep your pet's health information organized and easy to access.",
    icon: "/images/landing/pet-health.png",
  },
  {
    title: "Daily Care",
    description:
      "Stay on top of feeding, grooming, exercise, and everyday routines.",
    icon: "/images/landing/daily-care.png",
  },
  {
    title: "Smart Reminders",
    description:
      "Never miss important appointments, medications, or care tasks.",
    icon: "/images/landing/smart-reminders.png",
  },
];

export default function WhyPetMate() {
  return (
    <section
      id="features"
      className="bg-white px-4 py-16 font-display md:px-10 md:py-20"
      style={{ backgroundImage: "var(--paw-pattern)" }}
    >
      <div className="mx-auto max-w-content">
        {/* Heading */}
        <FadeIn className="text-center">
          <h2 className="text-2xl font-bold text-ink md:text-3xl">
            Why <span className="text-primary-strong">Pet</span>{" "}
            <span className="font-medium text-primary-strong">Mate</span> !?
          </h2>
          <p className="mt-4 text-xs text-ink-muted md:text-sm">
            Everything you need to keep your pet happy, healthy, and well cared
            for
          </p>
        </FadeIn>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <FadeIn key={feature.title} delay={index * 0.15}>
              <div className="flex h-full flex-col items-center rounded-card bg-cream px-6 py-8 text-center transition hover:-translate-y-1 hover:shadow-card">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={56}
                  height={56}
                  className="h-14 w-14 object-contain"
                />
                <h3 className="mt-4 text-sm font-bold text-ink">
                  {feature.title}
                </h3>
                <p className="mt-3 max-w-56 text-xs leading-relaxed text-ink-muted">
                  {feature.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

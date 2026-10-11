import Image from "next/image";
import Link from "next/link";
import FadeIn from "../shared/FadeIn";

const FEATURES = [
  {
    id: "care",
    title: "Full care",
    text: "Keep your pet happy and healthy with helpful care tips, guidance, and easy access to veterinary services and booking.",
    points: [
      "Book vets in a few taps",
      "Get care answers any time from the AI Assistant",
    ],
    href: "/vets",
    cta: "Find a vet",
    image: "/images/landing/vet.webp",
    alt: "A vet examining a ginger cat",
  },
  {
    id: "shop",
    title: "Pet Shop",
    text: "Discover quality products for your furry friends, from everyday essentials to toys and accessories.",
    points: [
      "Food, toys and accessories in one place",
      "See details before you order",
    ],
    href: "/store",
    cta: "Visit the store",
    image: "/images/landing/store.webp",
    alt: "Shelves of pet supplies",
  },
  {
    id: "adoption",
    title: "Adoption",
    text: "Explore adorable cats and dogs looking for a loving home, and find a companion that could become part of your family.",
    points: [
      "Browse pets available near you",
      "Learn a little about each one before you meet",
    ],
    href: "/adopt",
    cta: "Meet your match",
    image: "/images/landing/adopt.webp",
    alt: "A golden retriever being cuddled",
  },
];

const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-primary-deep";

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true">
      <path
        d="M3 7.5l2.5 2.5L11 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true">
      <path
        d="M3 8h10m0 0L9 4m4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="bg-cream px-4 py-20 text-ink sm:px-6 lg:py-24"
      aria-labelledby="features-heading">
      <div className="mx-auto max-w-content">
        <FadeIn direction="up" className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold tracking-wider text-accent-strong">
            WHAT YOU GET
          </p>
          <h2
            id="features-heading"
            className="mb-4 font-display text-hero font-bold tracking-tight text-balance text-primary-strong">
            Everything your pet needs, in one place
          </h2>
          <p className="text-lg leading-relaxed text-ink-muted">
            Care, shopping and adoption, all connected to one smart assistant
            that is there whenever you have a question.
          </p>
        </FadeIn>

        {/* Feature rows */}
        <div className="grid gap-20 lg:gap-28">
          {FEATURES.map((feature, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={feature.id}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
                {/* Text */}
                <FadeIn
                  direction={flip ? "left" : "right"}
                  className={flip ? "lg:order-2" : ""}>
                  <span className="mb-4 inline-flex items-center gap-3 text-sm font-semibold text-primary-strong">
                    <span className="grid size-9 place-items-center rounded-full bg-primary-tint">
                      0{i + 1}
                    </span>
                    <span className="h-px w-10 bg-primary-strong/30" />
                  </span>

                  <h3 className="mb-4 font-display text-title font-semibold tracking-tight text-primary-strong">
                    {feature.title}
                  </h3>
                  <p className="mb-6 max-w-[48ch] text-lg leading-relaxed text-ink-muted">
                    {feature.text}
                  </p>

                  <ul className="mb-8 grid list-none gap-3 p-0">
                    {feature.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 leading-snug">
                        <span className="mt-0.5 inline-grid size-6 shrink-0 place-items-center rounded-full bg-primary-tint text-primary-strong">
                          <CheckIcon />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={feature.href}
                    className={`group inline-flex items-center gap-2 rounded-full bg-primary-strong px-6 py-3 text-sm font-semibold text-white no-underline transition hover:bg-primary-deep active:scale-95 motion-reduce:transition-none ${focusRing}`}>
                    {feature.cta}
                    <span className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none">
                      <ArrowIcon />
                    </span>
                  </Link>
                </FadeIn>

                {/* Image */}
                <FadeIn
                  direction={flip ? "right" : "left"}
                  delay={0.15}
                  className={flip ? "lg:order-1" : ""}>
                  <div
                    className={`group relative mx-auto max-w-md pb-4 before:absolute before:bottom-0 before:top-4 before:rounded-feature before:bg-primary-tint lg:max-w-none ${
                      flip
                        ? "pl-4 before:left-0 before:right-4"
                        : "pr-4 before:left-4 before:right-0"
                    }`}>
                    <div className="relative aspect-4/3 overflow-hidden rounded-feature bg-linear-to-br from-primary-tint to-cream shadow-image">
                      <Image
                        src={feature.image}
                        alt={feature.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 560px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                      />
                    </div>
                  </div>
                </FadeIn>
              </article>
            );
          })}
        </div>

        {/* CTA */}
        <FadeIn direction="up" className="mt-24">
          <div className="rounded-feature bg-primary-strong bg-(image:--paw-pattern) px-6 py-12 text-center text-white sm:px-12">
            <h3 className="mb-3 font-display text-title font-semibold tracking-tight text-balance">
              Not sure where to start?
            </h3>
            <p className="mx-auto mb-8 max-w-[44ch] text-lg leading-relaxed text-white/85">
              Ask the AI Assistant anything about your pet and get clear answers
              right away.
            </p>
            <Link
              href="/assistant"
              className={`inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary-deep no-underline transition hover:scale-105 hover:bg-primary-tint active:scale-95 motion-reduce:transition-none ${focusRing}`}>
              Try the AI Assistant
              <ArrowIcon />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

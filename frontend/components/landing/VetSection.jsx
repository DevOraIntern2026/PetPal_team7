import Image from "next/image";
import Link from "next/link";

const POINTS = [
  "Trusted, certified veterinarians",
  "In-clinic visits or online consultations",
  "Keep your pet's medical records and follow-ups all in one place",
];

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

export default function VetSection() {
  return (
    <section
      className="bg-white bg-(image:--paw-pattern) px-4 py-20 text-ink sm:px-6 lg:py-24"
      aria-labelledby="vet-heading">
      <div className="mx-auto grid max-w-content items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-20">
        <div>
          <h2
            id="vet-heading"
            className="mb-6 max-w-[18ch] font-display text-title font-semibold tracking-tight text-balance text-primary-strong">
            Find a trusted vet near you, whenever your pet needs you most.
          </h2>
          <p className="mb-6 max-w-[52ch] text-lg leading-relaxed text-ink-muted">
            Choose the right veterinarian, read reviews from fellow pet parents,
            and book an appointment in just a few simple steps.
          </p>

          <ul className="mb-8 grid list-none gap-3 p-0">
            {POINTS.map((point) => (
              <li
                key={point}
                className="flex max-w-[52ch] items-start gap-3 leading-snug">
                <span className="mt-0.5 inline-grid size-6 shrink-0 place-items-center rounded-full bg-primary-tint text-primary-strong">
                  <CheckIcon />
                </span>
                {point}
              </li>
            ))}
          </ul>

          <Link
            href="/vets"
            className="inline-block rounded-full bg-primary-strong px-6 py-2 font-semibold text-white no-underline transition-colors hover:bg-primary-deep focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-primary-deep motion-reduce:transition-none">
            Find a vet
          </Link>
        </div>

        <div className="relative order-first max-w-105 pr-4 pb-4 before:absolute before:top-4 before:right-0 before:bottom-0 before:left-4 before:rounded-feature before:bg-primary-tint lg:order-none lg:max-w-none">
          <div className="relative aspect-4/3 overflow-hidden rounded-feature bg-linear-to-br from-primary-tint to-cream shadow-image lg:aspect-4/5">
            <Image
              src="/images/landing/vet.webp"
              alt="A vet examining a ginger cat on a clinic table"
              fill
              sizes="(max-width: 1024px) 100vw, 480px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

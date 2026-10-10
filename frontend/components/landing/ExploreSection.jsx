"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "../shared/FadeIn";

const FILTERS = ["All", "Adopt", "Store", "Vets"];

const CARDS = [
  {
    id: "adopt",
    category: "Adopt",
    caption: "Find your best companion",
    cta: "Adopt",
    href: "/adopt",
    image: "/images/landing/adopt.webp",
    alt: "A golden retriever being cuddled",
  },
  {
    id: "vets",
    category: "Vets",
    caption: "Best choice for your pet",
    cta: "Vets",
    href: "/vets",
    image: "/images/landing/vets.jpg",
    alt: "A vet gently examining a dog",
  },
  {
    id: "store",
    category: "Store",
    caption: "Quality stuff for pets",
    cta: "Store",
    href: "/store",
    image: "/images/landing/store.webp",
    alt: "Shelves of pet supplies",
  },
  {
    id: "chat",
    category: "Chat",
    caption: "Ask Pet Mate anything",
    cta: "Chat",
    href: "/chat",
    image: "/images/landing/chat.jpg",
    alt: "Chatting with the Pet Mate assistant",
  },
];

const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-primary-deep";

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

function SparkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="text-accent"
      aria-hidden="true">
      <path d="M8 0l1.6 5.4L15 7l-5.4 1.6L8 14l-1.6-5.4L1 7l5.4-1.6z" />
    </svg>
  );
}

export default function ExploreSection() {
  const [active, setActive] = useState("All");

  const visible =
    active === "All" ? CARDS : CARDS.filter((card) => card.category === active);

  return (
    <section
      className="bg-cream px-4 pt-6 pb-20 text-ink sm:px-6"
      aria-labelledby="explore-heading">
      <div className="mx-auto max-w-content">
        <div className="mb-12 flex items-center justify-between gap-4 text-sm">
          <span className="font-medium">Explore Pet Mate</span>
          <Link
            href="/assistant"
            className={`inline-flex items-center gap-2 font-semibold text-accent-strong underline-offset-4 hover:underline ${focusRing}`}>
            <SparkIcon />
            AI Assistant
          </Link>
        </div>

        <FadeIn direction="up">
          <h2
            id="explore-heading"
            className="mb-3 font-display text-hero font-semibold tracking-tight text-balance text-primary-strong">
            A Little Knowledge, Better Care
          </h2>
          <p className="mb-6 max-w-[36ch] text-lg leading-normal text-ink-muted">
            Clear, simple answers to the questions you face every day with your
            pet
          </p>
        </FadeIn>

        <div
          className="mb-8 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter topics">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              aria-pressed={active === filter}
              onClick={() => setActive(filter)}
              className={`min-w-20 cursor-pointer rounded-full border-[1.5px] border-primary px-5 py-2 text-sm font-medium text-primary-strong transition-colors hover:bg-primary-tint aria-pressed:border-primary-strong aria-pressed:bg-primary-strong aria-pressed:text-white aria-pressed:hover:bg-primary-strong motion-reduce:transition-none ${focusRing}`}>
              {filter}
            </button>
          ))}
        </div>

        <ul className="m-0 flex list-none snap-x snap-mandatory scroll-px-1 gap-4 overflow-x-auto p-1 pb-6">
          {visible.map((card, i) => (
            <li
              key={card.id}
              style={{ animationDelay: `${i * 90}ms` }}
              className="group flex w-[min(280px,78vw)] shrink-0 snap-start flex-col gap-3 rounded-card bg-white p-2 pb-3 shadow-card transition duration-300 hover:-translate-y-1.5 hover:shadow-image motion-safe:animate-rise motion-reduce:transition-none">
              <div className="relative aspect-4/3 overflow-hidden rounded-media bg-linear-to-br from-primary-tint to-cream">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  sizes="(max-width: 640px) 78vw, 280px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden";
                  }}
                />
              </div>
              <div className="flex items-center justify-between gap-3 px-2">
                <p className="m-0 text-sm leading-snug font-medium">
                  {card.caption}
                </p>
                <Link
                  href={card.href}
                  aria-label={`${card.cta}: ${card.caption}`}
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full border-[1.5px] border-primary px-3 py-1 text-sm font-semibold text-primary-strong no-underline transition-colors hover:border-primary-strong hover:bg-primary-strong hover:text-white motion-reduce:transition-none ${focusRing}`}>
                  {card.cta}
                  <ArrowIcon />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

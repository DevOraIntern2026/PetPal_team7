import Link from "next/link";
import Image from "next/image";
import FadeIn from "../shared/FadeIn";
import dogAndCatImage from "../../public/hero-pets.png";

export default function Hero() {
  return (
    <section className="flex min-h-162.5 items-center bg-surface px-4 py-10 md:px-10 md:py-0">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-8 md:flex-row md:gap-10">
        {/* Text */}
        <FadeIn direction="right" className="max-w-md text-center md:text-left">
          <p className="mb-4 text-xs font-semibold md:mb-6">
            <span className="text-accent">WELCOME</span> to Pet Mate ...
          </p>

          <h1 className="text-3xl font-bold leading-tight text-primary md:text-4xl">
            Everything Your Pet Needs, All in One Place.
          </h1>

          <p className="mt-4 text-sm text-ink">
            Your smart companion for a happier, healthier pet. Track their care,
            stay organized, and give them the love they deserve.
          </p>

          <div className="mt-8 flex justify-center gap-4 md:justify-start">
            <Link
              href="/signup"
              className="rounded-md bg-primary px-6 py-2 text-xs font-semibold text-white transition hover:scale-105 hover:bg-primary-hover active:scale-95"
            >
              Get Started
            </Link>
            <Link
              href="#features"
              className="rounded-md border border-muted bg-white px-6 py-2 text-xs font-semibold text-ink transition hover:scale-105 active:scale-95"
            >
              Explore Features
            </Link>
          </div>
        </FadeIn>

        {/* Image */}
        <FadeIn direction="left" delay={0.2} className="w-full md:w-1/2">
          <Image
            src={dogAndCatImage}
            alt="Dog and cat"
            priority
            className="h-auto w-full max-w-xs md:max-w-md lg:max-w-125"
          />
        </FadeIn>
      </div>
    </section>
  );
}

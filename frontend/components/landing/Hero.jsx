import Link from "next/link";
import Image from "next/image";
import FadeIn from "../shared/FadeIn";
import dogAndCatImage from "../../public/images/landing/hero-pets.png";

export default function Hero() {
  return (
    <section className="flex min-h-162.5 items-center bg-cream  px-4 py-10 font-display md:px-10 md:py-0">
      <div className="mx-auto flex w-full max-w-content flex-col items-center justify-between gap-8 md:flex-row md:gap-12">
        {/* Text */}
        <FadeIn direction="right" className="max-w-lg text-center md:text-left">
          <p className="mb-4 text-xs font-semibold tracking-wider text-ink md:mb-6 md:text-sm">
            <span className="text-accent-strong">WELCOME</span> to Pet Mate ...
          </p>

          <h1 className="text-hero font-bold text-primary-strong">
            Everything Your Pet Needs, All in One Place.
          </h1>

          <p className="mt-5 text-base leading-relaxed text-ink-muted md:text-lg">
            Your smart companion for a happier, healthier pet. Track their care,
            stay organized, and give them the love they deserve.
          </p>

          <div className="mt-8 flex justify-center gap-4 md:justify-start">
            <Link
              href="/signup"
              className="rounded-md bg-primary-strong px-8 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:bg-primary-deep active:scale-95">
              Get Started
            </Link>
            <Link
              href="#features"
              className="rounded-md border border-primary-strong/30 bg-white px-8 py-3 text-sm font-semibold text-ink transition hover:scale-105 hover:bg-primary-tint active:scale-95">
              Explore Features
            </Link>
          </div>
        </FadeIn>

        {/* Image */}
        <FadeIn
          direction="left"
          delay={0.2}
          className="flex w-full justify-center md:w-1/2">
          <div className="relative w-full max-w-xs md:max-w-md lg:max-w-125">
            <Image
              src={dogAndCatImage}
              alt="Dog and cat"
              priority
              className="relative h-auto w-full rounded-2xl"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

import Image from "next/image";

export default function AuthLayout({ heading, subheading, aside, children }) {
  return (
    <main className="bg-cream bg-(image:--paw-pattern) px-4 py-10 sm:px-6 lg:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-feature bg-white shadow-card motion-safe:animate-rise lg:grid-cols-[1fr_1.1fr]">
        <aside className="relative hidden min-h-136 lg:block">
          <Image
            src="/images/landing/cat-dog.jpg"
            alt=""
            fill
            priority
            sizes="480px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-primary-deep via-primary-deep/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-white">
            <h2 className="mb-3 font-display text-title font-semibold tracking-tight text-balance">
              {aside.title}
            </h2>
            <p className="max-w-[34ch] leading-relaxed text-white/90">
              {aside.text}
            </p>
          </div>
        </aside>

        <div className="px-6 py-10 sm:px-12 lg:px-14 lg:py-14">
          <h1 className="mb-2 font-display text-title font-bold tracking-tight text-primary-strong">
            {heading}
          </h1>
          <p className="mb-8 text-ink-muted">{subheading}</p>
          {children}
        </div>
      </div>
    </main>
  );
}

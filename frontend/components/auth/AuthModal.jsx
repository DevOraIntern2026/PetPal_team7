"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuLock } from "react-icons/lu";
import { useAuth } from "../../lib/auth/AuthContext";

const COPY = {
  vets: {
    title: "Sign in to book",
    text: "You need to sign in or create an account before booking an appointment with a veterinarian.",
  },
  appointment: {
    title: "Sign in to book",
    text: "You need to sign in or create an account before booking an appointment with a veterinarian.",
  },
  shop: {
    title: "Sign in to shop",
    text: "Log in or create a free account to add items to your cart and check out.",
  },
  adopt: {
    title: "Sign in to adopt",
    text: "You need an account to send an adoption request. It only takes a minute.",
  },
  default: {
    title: "Sign in to continue",
    text: "Log in or create an account to use this feature.",
  },
};

export default function AuthGuardModal() {
  const { promptReason, promptRedirect, closePrompt } = useAuth();
  const pathname = usePathname();
  const ref = useRef(null);
  const copy = COPY[promptReason] ?? COPY.default;
  const targetPath = promptRedirect || pathname;
  const next = encodeURIComponent(targetPath);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (promptReason && !dialog.open) dialog.showModal();
    if (!promptReason && dialog.open) dialog.close();
  }, [promptReason]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="auth-modal-title"
      onClose={closePrompt}
      onClick={(e) => e.target === ref.current && closePrompt()}
      className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-feature bg-white p-0 text-ink shadow-card backdrop:bg-ink/50 backdrop:backdrop-blur-sm open:motion-safe:animate-rise">
      <div className="p-8 text-center">
        <span className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-primary-tint text-primary-strong">
          <LuLock size={26} aria-hidden="true" />
        </span>
        <h2
          id="auth-modal-title"
          className="mb-2 font-display text-2xl font-semibold tracking-tight text-primary-strong">
          {copy.title}
        </h2>
        <p className="mx-auto mb-7 max-w-[34ch] leading-relaxed text-ink-muted">
          {copy.text}
        </p>

        <div className="grid gap-3">
          <Link
            href={`/login?next=${next}`}
            onClick={closePrompt}
            className="btn-primary">
            Log in
          </Link>
          <Link
            href={`/signup?next=${next}`}
            onClick={closePrompt}
            className="btn-secondary">
            Create an account
          </Link>
          <button
            type="button"
            onClick={closePrompt}
            className="rounded-full py-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink focus-ring">
            Maybe later
          </button>
        </div>
      </div>
    </dialog>
  );
}

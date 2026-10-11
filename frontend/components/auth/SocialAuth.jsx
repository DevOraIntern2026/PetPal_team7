"use client";

import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const btn =
  "inline-flex items-center justify-center gap-3 rounded-full border-[1.5px] border-primary-strong/25 bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-primary-tint motion-reduce:transition-none focus-ring";

export default function SocialAuth() {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" className={btn}>
          <FcGoogle size={20} aria-hidden="true" /> Google
        </button>
        <button type="button" className={btn}>
          <FaFacebook size={20} aria-hidden="true" className="text-[#1877F2]" />{" "}
          Facebook
        </button>
      </div>
      <div
        className="flex items-center gap-4 text-sm text-ink-muted"
        role="separator">
        <span className="h-px flex-1 bg-primary-strong/15" />
        or
        <span className="h-px flex-1 bg-primary-strong/15" />
      </div>
    </>
  );
}

"use client";

import { forwardRef, useId, useState } from "react";
const Field = forwardRef(function Field(
  { label, error, type = "text", ...props },
  ref,
) {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          ref={ref}
          type={isPassword && show ? "text" : type}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-media border-[1.5px] border-primary-strong/25 bg-white px-4 py-3 text-base text-ink transition-colors hover:border-primary-strong/50 focus-visible:border-primary-strong focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/30 aria-invalid:border-danger motion-reduce:transition-none ${
            isPassword ? "pr-16" : ""
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-pressed={show}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute inset-y-1 right-1 rounded-media px-3 text-sm font-semibold text-primary-strong hover:bg-primary-tint focus-ring">
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
});

export default Field;

"use client";

import { ChevronRight } from "lucide-react";

const TONES = {
  primary: "bg-primary-tint text-primary-strong",
  accent: "bg-accent/10 text-accent-strong",
  green: "bg-emerald-50 text-emerald-700",
  rose: "bg-rose-50 text-rose-600",
};

export default function StatStrip({ items }) {
  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-card bg-white shadow-card ring-1 ring-primary/10 lg:grid-cols-4">
      {items.map(
        (
          {
            key,
            label,
            value,
            hint,
            icon: Icon,
            tone = "primary",
            onClick,
            status,
          },
          i,
        ) => (
          <button
            key={key}
            type="button"
            onClick={onClick}
            className={`focus-ring group flex items-center gap-4 p-5 text-left transition hover:bg-primary-tint/40 ${
              i > 0 ? "lg:border-l lg:border-primary/10" : ""
            } ${i >= 2 ? "border-t border-primary/10 lg:border-t-0" : ""} ${
              i % 2 === 1 ? "border-l border-primary/10 lg:border-l" : ""
            }`}>
            <span
              className={`grid size-12 shrink-0 place-items-center rounded-2xl ${TONES[tone]}`}>
              <Icon size={22} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-3xl font-bold leading-none text-ink">
                {status === "loading" ? (
                  <span className="inline-block h-7 w-8 animate-pulse rounded bg-primary-tint" />
                ) : status === "error" ? (
                  <span className="text-xl text-ink-muted">N/A</span>
                ) : (
                  value
                )}
              </span>
              <span className="mt-1.5 block truncate text-sm text-ink-muted">
                {label}
              </span>
              {hint && status === "ready" && (
                <span className="block truncate text-xs font-semibold text-primary-strong">
                  {hint}
                </span>
              )}
            </span>
            <ChevronRight
              size={16}
              className="shrink-0 text-ink-muted/50 transition group-hover:translate-x-0.5 group-hover:text-primary-strong motion-reduce:transition-none"
              aria-hidden="true"
            />
          </button>
        ),
      )}
    </div>
  );
}

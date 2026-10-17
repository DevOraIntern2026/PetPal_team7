"use client";

import { ArrowRight, AlertCircle } from "lucide-react";

export default function Panel({
  title,
  icon: Icon,
  status = "ready",
  isEmpty = false,
  empty,
  onRetry,
  actionLabel = "View all",
  onAction,
  className = "",
  children,
}) {
  return (
    <section
      className={`flex flex-col rounded-card bg-white p-6 shadow-card ring-1 ring-primary/10 ${className}`}>
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-3 text-lg font-bold text-ink">
          {Icon && (
            <span className="grid size-9 place-items-center rounded-xl bg-primary-tint text-primary-strong">
              <Icon size={18} aria-hidden="true" />
            </span>
          )}
          {title}
        </h2>
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="focus-ring inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-primary-strong transition hover:bg-primary-tint">
            {actionLabel}
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        )}
      </header>

      {status === "loading" ? (
        <div className="space-y-3" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-media bg-primary-tint/60"
            />
          ))}
        </div>
      ) : status === "error" ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center">
          <AlertCircle size={22} className="text-danger" aria-hidden="true" />
          <p className="text-sm text-ink-muted">
            We could not load this section.
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="focus-ring rounded-full px-4 py-1.5 text-sm font-semibold text-primary-strong hover:bg-primary-tint">
              Try again
            </button>
          )}
        </div>
      ) : isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8 text-center">
          {empty}
        </div>
      ) : (
        children
      )}
    </section>
  );
}

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

// columns: [{ key, header, className, render(row) }]
export default function DataTable({
  columns,
  rows,
  status,
  onRetry,
  page,
  pageSize,
  totalCount,
  onPage,
  emptyText = "Nothing here yet.",
}) {
  const pages = Math.max(1, Math.ceil(totalCount / pageSize));
  const span = columns.length;

  return (
    <div className="overflow-hidden rounded-card bg-white shadow-card ring-1 ring-primary/10">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-primary-tint/50 text-ink-muted">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={`px-5 py-3 font-semibold ${c.className ?? ""}`}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10">
            {status === "loading" ? (
              [0, 1, 2, 3].map((i) => (
                <tr key={i}>
                  <td colSpan={span} className="px-5 py-4">
                    <div className="h-8 animate-pulse rounded-lg bg-primary-tint/60" />
                  </td>
                </tr>
              ))
            ) : status === "error" ? (
              <tr>
                <td colSpan={span} className="px-5 py-10 text-center">
                  <p className="text-ink-muted">We could not load this list.</p>
                  <button
                    type="button"
                    onClick={onRetry}
                    className="focus-ring mt-2 rounded-full px-4 py-1.5 font-semibold text-primary-strong hover:bg-primary-tint">
                    Try again
                  </button>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={span}
                  className="px-5 py-10 text-center text-ink-muted">
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-primary-tint/30">
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={`px-5 py-3.5 align-middle text-ink ${c.className ?? ""}`}>
                      {c.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-primary/10 px-5 py-3 text-sm text-ink-muted">
        <span>
          {totalCount} {totalCount === 1 ? "item" : "items"}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPage(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="focus-ring grid size-8 place-items-center rounded-full hover:bg-primary-tint disabled:opacity-40">
            <ChevronLeft size={16} />
          </button>
          <span>
            Page {page} of {pages}
          </span>
          <button
            type="button"
            onClick={() => onPage(page + 1)}
            disabled={page >= pages}
            aria-label="Next page"
            className="focus-ring grid size-8 place-items-center rounded-full hover:bg-primary-tint disabled:opacity-40">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

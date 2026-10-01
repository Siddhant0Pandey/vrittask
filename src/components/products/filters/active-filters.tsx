"use client";

import { X } from "lucide-react";

export interface ActiveFilter {
  key: string;
  label: string;
  onRemove: () => void;
}

export function ActiveFilters({ filters }: { filters: readonly ActiveFilter[] }) {
  if (filters.length === 0) return null;

  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {filters.map((filter) => (
        <li key={filter.key}>
          <button
            type="button"
            onClick={filter.onRemove}
            className="group inline-flex items-center gap-1.5 rounded-full bg-citron-200 py-1.5 pr-2 pl-3 text-xs font-semibold text-pine-900 transition hover:bg-citron-300"
            aria-label={`Remove filter: ${filter.label}`}
          >
            {filter.label}
            <span className="grid size-4 place-items-center rounded-full bg-pine-900/10 transition group-hover:bg-pine-900 group-hover:text-citron-200">
              <X className="size-2.5" strokeWidth={3} />
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

"use client";

import { LayoutGrid, List, LoaderCircle, SlidersHorizontal } from "lucide-react";
import { Select, type SelectOption } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { SortOrder } from "@/types/product";
import type { ProductCardLayout } from "./product-card";

type SortValue = SortOrder | "default";

const SORT_OPTIONS: readonly SelectOption<SortValue>[] = [
  { value: "default", label: "Featured" },
  { value: "desc", label: "Newest arrivals" },
  { value: "asc", label: "Oldest arrivals" },
];

interface CatalogToolbarProps {
  rangeStart: number;
  rangeEnd: number;
  totalItems: number;
  sort: SortOrder | null;
  onSortChange: (sort: SortOrder | null) => void;
  isSorting: boolean;
  layout: ProductCardLayout;
  onLayoutChange: (layout: ProductCardLayout) => void;
  activeFilterCount: number;
  onOpenFilters: () => void;
}

export function CatalogToolbar({
  rangeStart,
  rangeEnd,
  totalItems,
  sort,
  onSortChange,
  isSorting,
  layout,
  onLayoutChange,
  activeFilterCount,
  onOpenFilters,
}: CatalogToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onOpenFilters}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 text-sm font-semibold transition hover:border-ink lg:hidden"
      >
        <SlidersHorizontal className="size-4" />
        Filters
        {activeFilterCount > 0 && (
          <span className="grid size-5 place-items-center rounded-full bg-persimmon-500 text-[11px] text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      <p className="order-last w-full text-sm text-ink-soft sm:order-none sm:w-auto" aria-live="polite">
        {totalItems === 0 ? (
          "No matches"
        ) : (
          <>
            Showing{" "}
            <span className="font-semibold text-ink tabular-nums">
              {rangeStart}–{rangeEnd}
            </span>{" "}
            of <span className="font-semibold text-ink tabular-nums">{totalItems}</span> products
          </>
        )}
      </p>

      <div className="ml-auto flex items-center gap-2">
        {isSorting && <LoaderCircle className="size-4 animate-spin text-pine-600" aria-label="Updating" />}
        <label className="sr-only" htmlFor="catalog-sort">
          Sort products
        </label>
        <Select
          id="catalog-sort"
          options={SORT_OPTIONS}
          value={sort ?? "default"}
          onValueChange={(value) => onSortChange(value === "default" ? null : value)}
          className="w-44"
        />
        <div className="hidden items-center rounded-full border border-line-strong bg-surface p-1 sm:flex" role="group" aria-label="Layout">
          {(
            [
              { value: "grid", Icon: LayoutGrid, label: "Grid view" },
              { value: "list", Icon: List, label: "List view" },
            ] as const
          ).map(({ value, Icon, label }) => (
            <button
              key={value}
              type="button"
              aria-label={label}
              aria-pressed={layout === value}
              onClick={() => onLayoutChange(value)}
              className={cn(
                "grid size-8 place-items-center rounded-full transition",
                layout === value ? "bg-ink text-white" : "text-ink-faint hover:text-ink",
              )}
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

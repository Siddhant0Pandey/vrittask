"use client";

import type { ReactNode } from "react";
import { SearchField } from "@/components/ui/search-field";
import type { Category, PriceRange } from "@/types/product";
import { CategoryFilter } from "./category-filter";
import { PriceRangeFilter } from "./price-range-filter";

export interface FilterPanelProps {
  categories: readonly Category[];
  categoryCounts: Partial<Record<Category, number>>;
  totalCount: number;
  priceBounds: PriceRange;
  search: string;
  category: Category | null;
  price: [number, number];
  activeCount: number;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: Category | null) => void;
  onPriceChange: (value: [number, number]) => void;
  onReset: () => void;
}

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-5 first:border-t-0 first:pt-0">
      <h3 className="mb-3 font-sans text-xs font-bold tracking-[0.14em] text-ink-faint uppercase">{title}</h3>
      {children}
    </section>
  );
}

/** Presentational, fully controlled filter UI — reusable in the sidebar and the mobile drawer. */
export function FilterPanel({
  categories,
  categoryCounts,
  totalCount,
  priceBounds,
  search,
  category,
  price,
  activeCount,
  onSearchChange,
  onCategoryChange,
  onPriceChange,
  onReset,
}: FilterPanelProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Filters</h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-semibold text-persimmon-600 underline-offset-4 hover:underline"
          >
            Clear all ({activeCount})
          </button>
        )}
      </div>

      <FilterSection title="Search">
        <SearchField
          value={search}
          onValueChange={onSearchChange}
          placeholder="Search by name…"
          aria-label="Search products by name"
        />
      </FilterSection>

      <FilterSection title="Category">
        <CategoryFilter
          categories={categories}
          value={category}
          onChange={onCategoryChange}
          counts={categoryCounts}
          totalCount={totalCount}
        />
      </FilterSection>

      <FilterSection title="Price">
        <PriceRangeFilter bounds={priceBounds} value={price} onChange={onPriceChange} />
      </FilterSection>
    </div>
  );
}

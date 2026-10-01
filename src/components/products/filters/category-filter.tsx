"use client";

import { CategoryIcon } from "@/components/products/category-icon";
import { formatCategory } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/product";

interface CategoryFilterProps {
  categories: readonly Category[];
  value: Category | null;
  onChange: (category: Category | null) => void;
  /** Result counts per category, given the other active filters. */
  counts?: Partial<Record<Category, number>>;
  totalCount?: number;
}

export function CategoryFilter({ categories, value, onChange, counts, totalCount }: CategoryFilterProps) {
  const options: { key: Category | null; label: string; count?: number }[] = [
    { key: null, label: "All products", count: totalCount },
    ...categories.map((category) => ({
      key: category,
      label: formatCategory(category),
      count: counts?.[category],
    })),
  ];

  return (
    <ul className="space-y-1">
      {options.map(({ key, label, count }) => {
        const active = value === key;
        return (
          <li key={key ?? "all"}>
            <button
              type="button"
              aria-pressed={active}
              onClick={() => onChange(key)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition",
                active ? "bg-pine-700 text-white shadow-soft" : "text-ink-soft hover:bg-sunken hover:text-ink",
              )}
            >
              <span
                className={cn(
                  "grid size-7 place-items-center rounded-lg transition",
                  active ? "bg-white/15" : "bg-surface ring-1 ring-line group-hover:ring-line-strong",
                )}
              >
                <CategoryIcon category={key} className="size-3.5" />
              </span>
              <span className="flex-1">{label}</span>
              {count !== undefined && (
                <span
                  className={cn(
                    "min-w-6 rounded-full px-1.5 py-0.5 text-center text-xs tabular-nums",
                    active ? "bg-citron-300 text-pine-900" : "bg-sunken text-ink-faint",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

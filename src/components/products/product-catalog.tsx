"use client";

import { SearchX } from "lucide-react";
import { useDeferredValue, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Pagination } from "@/components/ui/pagination";
import { StateMessage } from "@/components/ui/state-message";
import { useCatalogQuery } from "@/hooks/use-catalog-query";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useSyncedState } from "@/hooks/use-synced-state";
import { countActiveFilters, filterProducts, formatCategory, paginate } from "@/lib/catalog";
import { catalogConfig } from "@/lib/config";
import { cn, formatPrice } from "@/lib/utils";
import type { Category, PriceRange, Product, ProductFilters } from "@/types/product";
import { CatalogToolbar } from "./catalog-toolbar";
import { ActiveFilters, type ActiveFilter } from "./filters/active-filters";
import { FilterPanel } from "./filters/filter-panel";
import type { ProductCardLayout } from "./product-card";
import { ProductGrid } from "./product-grid";

interface ProductCatalogProps {
  /** Server-fetched, server-sorted products. */
  products: Product[];
  categories: Category[];
  priceBounds: PriceRange;
}

type PriceTuple = [number, number];

const URL_DEBOUNCE_MS = 300;
const tupleEqual = (a: PriceTuple, b: PriceTuple) => a[0] === b[0] && a[1] === b[1];

/**
 * Client-side catalogue: receives server data and applies search, category and
 * price filtering plus pagination locally, mirroring all state into the URL.
 */
export function ProductCatalog({ products, categories, priceBounds }: ProductCatalogProps) {
  const { query, update, reset, hrefFor, isSorting } = useCatalogQuery();
  const [layout, setLayout] = useState<ProductCardLayout>("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Inputs update instantly; URL writes are debounced so typing doesn't spam history.
  const [searchDraft, setSearchDraft] = useSyncedState(query.search);
  const [priceDraft, setPriceDraft] = useSyncedState<PriceTuple>(
    [query.price.min ?? priceBounds.min, query.price.max ?? priceBounds.max],
    tupleEqual,
  );
  const commitSearch = useDebouncedCallback((search: string) => update({ search: search.trim() }, "replace"), URL_DEBOUNCE_MS);
  const commitPrice = useDebouncedCallback(
    ([min, max]: PriceTuple) =>
      update(
        { price: { min: min > priceBounds.min ? min : undefined, max: max < priceBounds.max ? max : undefined } },
        "replace",
      ),
    URL_DEBOUNCE_MS,
  );

  const deferredSearch = useDeferredValue(searchDraft);
  const deferredPrice = useDeferredValue(priceDraft);

  const filters: ProductFilters = useMemo(
    () => ({
      search: deferredSearch.trim(),
      category: query.category,
      price: {
        min: deferredPrice[0] > priceBounds.min ? deferredPrice[0] : undefined,
        max: deferredPrice[1] < priceBounds.max ? deferredPrice[1] : undefined,
      },
    }),
    [deferredSearch, deferredPrice, query.category, priceBounds],
  );

  const { filtered, categoryCounts, totalForOtherFilters } = useMemo(() => {
    // Facet counts ignore the category filter so users can see where results live.
    const withoutCategory = filterProducts(products, { ...filters, category: null });
    const counts: Partial<Record<Category, number>> = {};
    for (const product of withoutCategory) counts[product.category] = (counts[product.category] ?? 0) + 1;
    const result = filters.category ? withoutCategory.filter((p) => p.category === filters.category) : withoutCategory;
    return { filtered: result, categoryCounts: counts, totalForOtherFilters: withoutCategory.length };
  }, [products, filters]);

  const page = paginate(filtered, query.page, catalogConfig.pageSize);
  const activeCount = countActiveFilters(filters);
  const isStale = deferredSearch !== searchDraft || deferredPrice !== priceDraft;

  const handleSearchChange = (value: string) => {
    setSearchDraft(value);
    commitSearch.run(value);
  };
  const handlePriceChange = (value: PriceTuple) => {
    setPriceDraft(value);
    commitPrice.run(value);
  };
  const handleReset = () => {
    commitSearch.cancel();
    commitPrice.cancel();
    setSearchDraft("");
    setPriceDraft([priceBounds.min, priceBounds.max]);
    reset();
  };
  const handlePageChange = (target: number) => {
    update({ page: target });
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeFilters: ActiveFilter[] = [
    filters.search && { key: "search", label: `“${filters.search}”`, onRemove: () => handleSearchChange("") },
    filters.category && {
      key: "category",
      label: formatCategory(filters.category),
      onRemove: () => update({ category: null }),
    },
    (filters.price.min !== undefined || filters.price.max !== undefined) && {
      key: "price",
      label: `${formatPrice(priceDraft[0])} – ${formatPrice(priceDraft[1])}`,
      onRemove: () => handlePriceChange([priceBounds.min, priceBounds.max]),
    },
  ].filter((filter): filter is ActiveFilter => Boolean(filter));

  const panel = (
    <FilterPanel
      categories={categories}
      categoryCounts={categoryCounts}
      totalCount={totalForOtherFilters}
      priceBounds={priceBounds}
      search={searchDraft}
      category={query.category}
      price={priceDraft}
      activeCount={activeCount}
      onSearchChange={handleSearchChange}
      onCategoryChange={(category) => update({ category })}
      onPriceChange={handlePriceChange}
      onReset={handleReset}
    />
  );

  const rangeStart = page.totalItems === 0 ? 0 : (page.page - 1) * catalogConfig.pageSize + 1;

  return (
    <div className="grid gap-8 lg:grid-cols-[272px_minmax(0,1fr)] lg:gap-10">
      <aside className="hidden lg:block">
        <div className="sticky top-28 rounded-[var(--radius-card)] border border-line bg-surface/70 p-5 shadow-soft">
          {panel}
        </div>
      </aside>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Refine results"
        side="left"
        footer={
          <Button fullWidth onClick={() => setFiltersOpen(false)}>
            Show {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </Button>
        }
      >
        <div className="p-5">{panel}</div>
      </Drawer>

      <div ref={resultsRef} className="min-w-0 scroll-mt-28 space-y-5">
        <CatalogToolbar
          rangeStart={rangeStart}
          rangeEnd={rangeStart === 0 ? 0 : rangeStart + page.items.length - 1}
          totalItems={page.totalItems}
          sort={query.sort}
          onSortChange={(sort) => update({ sort })}
          isSorting={isSorting}
          layout={layout}
          onLayoutChange={setLayout}
          activeFilterCount={activeCount}
          onOpenFilters={() => setFiltersOpen(true)}
        />
        <ActiveFilters filters={activeFilters} />

        <div className={cn("transition-opacity duration-200", (isSorting || isStale) && "opacity-55")}>
          {page.items.length > 0 ? (
            <ProductGrid
              // Re-key so the entrance animation replays when the result set changes.
              key={`${query.sort}-${page.page}-${layout}`}
              products={page.items}
              layout={layout}
              priorityCount={4}
            />
          ) : (
            <StateMessage
              icon={SearchX}
              title="Nothing matches those filters"
              description="Try a different search term, widen the price range, or browse another category."
              action={<Button onClick={handleReset}>Clear all filters</Button>}
            />
          )}
        </div>

        <Pagination
          page={page.page}
          totalPages={page.totalPages}
          getHref={(target) => hrefFor({ page: target })}
          onPageChange={handlePageChange}
          className="pt-6"
        />
      </div>
    </div>
  );
}

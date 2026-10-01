import type { CatalogQuery, Category, PriceRange, Product, ProductFilters, SortOrder } from "@/types/product";

/**
 * Pure catalogue helpers shared by the server (initial render) and the client
 * (interactive filtering), so both always agree on the result for a given URL.
 */

type RawSearchParams = Record<string, string | string[] | undefined> | URLSearchParams;

function read(params: RawSearchParams, key: string): string | undefined {
  if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function toNumber(value: string | undefined): number | undefined {
  if (value === undefined || value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export function parseSort(value: string | undefined): SortOrder | null {
  return value === "asc" || value === "desc" ? value : null;
}

export function parseCatalogQuery(params: RawSearchParams): CatalogQuery {
  const page = Math.floor(toNumber(read(params, "page")) ?? 1);
  return {
    search: read(params, "search")?.trim() ?? "",
    category: read(params, "category") || null,
    price: { min: toNumber(read(params, "minPrice")), max: toNumber(read(params, "maxPrice")) },
    sort: parseSort(read(params, "sort")),
    page: page >= 1 ? page : 1,
  };
}

/** Serialises catalogue state into a query string, omitting defaults for clean, shareable URLs. */
export function serializeCatalogQuery(query: Partial<CatalogQuery>): string {
  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  if (query.sort) params.set("sort", query.sort);
  if (query.search) params.set("search", query.search);
  if (query.price?.min !== undefined) params.set("minPrice", String(query.price.min));
  if (query.price?.max !== undefined) params.set("maxPrice", String(query.price.max));
  if (query.page && query.page > 1) params.set("page", String(query.page));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function filterProducts(products: readonly Product[], { search, category, price }: ProductFilters): Product[] {
  const needle = search.toLowerCase();
  return products.filter(
    (product) =>
      (!category || product.category === category) &&
      (!needle || product.title.toLowerCase().includes(needle)) &&
      (price.min === undefined || product.price >= price.min) &&
      (price.max === undefined || product.price <= price.max),
  );
}

export interface Page<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export function paginate<T>(items: readonly T[], page: number, pageSize: number): Page<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page: current, totalPages, totalItems: items.length };
}

/** Price bounds of the catalogue, rounded outward to whole numbers for the slider. */
export function getPriceBounds(products: readonly Product[]): PriceRange {
  if (products.length === 0) return { min: 0, max: 0 };
  const prices = products.map((product) => product.price);
  return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
}

export function countActiveFilters({ search, category, price }: ProductFilters): number {
  return [search, category, price.min !== undefined || price.max !== undefined].filter(Boolean).length;
}

export function formatCategory(category: Category): string {
  return category.replace(/(^|\s)\S/g, (char) => char.toUpperCase()).replace("Jewelery", "Jewellery");
}

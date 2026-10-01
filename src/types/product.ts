export interface ProductRating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: Category;
  image: string;
  rating: ProductRating;
}

/** Categories are open-ended strings returned by the API (e.g. "electronics"). */
export type Category = string;

export type SortOrder = "asc" | "desc";

export interface PriceRange {
  min: number;
  max: number;
}

/** Filters applied client-side to the server-fetched catalogue. */
export interface ProductFilters {
  search: string;
  category: Category | null;
  price: Partial<PriceRange>;
}

/** Full catalogue state, as represented in the URL query string. */
export interface CatalogQuery extends ProductFilters {
  sort: SortOrder | null;
  page: number;
}
